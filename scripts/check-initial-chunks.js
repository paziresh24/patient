#!/usr/bin/env node
/**
 * DR-08 (ghane/docs/dev-requests/dr-08-listing-pagespeed.md §۱۲) — گاردِ «حملِ کدِ سنگین در
 * chunkِ initial».
 *
 * چرا وجود دارد: دو بار پشتِ سر هم یک کلاسِ باگ تکرار شد — گیتِ runtime دورِ *استفاده* گذاشته شد
 * (isPWA() برای Firebase، فلگ+نقشِ کاربر برای LiveKit) در حالی که *import* استاتیک ماند، پس webpack
 * کتابخانه را در گرافِ initialِ هر صفحه نگه داشت و مرورگر آن را eager دانلود/parse کرد. این باگ در
 * code review دیده نمی‌شود (کد کاملاً درست به‌نظر می‌رسد) و فقط در خروجیِ build دیدنی است.
 *
 * این اسکریپت همان تستی است که دستی روی production زده شد، ولی خودکار: build-manifestِ واقعی را
 * می‌خواند، فایل‌های initialِ صفحه‌ها را جمع می‌کند و مطمئن می‌شود امضای هیچ‌کدام از پکیج‌های
 * denylist داخلشان نیست.
 *
 * اجرا (بعد از `next build`):
 *   node scripts/check-initial-chunks.js            # پیش‌فرض: .next
 *   node scripts/check-initial-chunks.js --dir .next --max-kb 4500
 *
 * مرزِ اعتبار: این گارد فقط «آیا این پکیج در گرافِ initial هست؟» را جواب می‌دهد. اندازه‌ی کلِ
 * bundle و متریک‌های کاربر (LCP/TBT) کارِ گیتِ Lighthouse در `lighthouserc.js` است — این دو مکمل‌اند.
 */

const fs = require('fs');
const path = require('path');

/** پکیج‌هایی که ثابت شده نباید در گرافِ initialِ صفحاتِ عمومی باشند + امضای قابل‌اتکا در خروجیِ minified. */
const DENYLIST = [
  {
    package: 'firebase / @firebase',
    marker: /@firebase\/(analytics|app|installations)/,
    why: 'فقط داخلِ PWA لازم است (src/firebase/analytics.ts پشتِ گیتِ isPWA()) — باید async بماند',
  },
  {
    package: 'livekit-client / @livekit',
    marker: /@livekit\/components-react|livekit-client/,
    why: 'فقط برای تماسِ صوتیِ دکترها (VoiceCallHost پشتِ فلگ) — باید async بماند',
  },
];

/** صفحاتی که گارد رویشان اعمال می‌شود (پرترافیک‌ترین‌های ورودیِ گوگل + shell مشترک). */
const WATCHED_PAGES = ['/_app', '/s/[[...params]]'];

function parseArgs(argv) {
  const args = { dir: '.next', maxKb: 0 };
  for (let i = 2; i < argv.length; i += 1) {
    if (argv[i] === '--dir') args.dir = argv[i + 1];
    if (argv[i] === '--max-kb') args.maxKb = Number(argv[i + 1]);
  }
  return args;
}

/**
 * runtimeِ webpack **نامِ همه‌ی chunkها** را نگه می‌دارد — از جمله chunkهای async — تا بتواند
 * هنگامِ نیاز لودشان کند. پس دیدنِ رشته‌ی «lib-livekit-client» در این فایل کاملاً طبیعی است و
 * ربطی به حملِ کدِ کتابخانه ندارد؛ اسکنِ محتوایش false positive می‌دهد.
 */
const RUNTIME_CHUNK = /[\\/]webpack-[^\\/]+\.js$/;

function initialFilesFor(manifest, page) {
  const root = manifest.rootMainFiles || [];
  const app = manifest.pages['/_app'] || [];
  const own = manifest.pages[page] || [];
  return [...new Set([...root, ...app, ...own])].filter(file => file.endsWith('.js'));
}

function main() {
  const { dir, maxKb } = parseArgs(process.argv);
  const manifestPath = path.join(dir, 'build-manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.error(`✗ ${manifestPath} پیدا نشد — این اسکریپت باید بعد از \`next build\` اجرا شود.`);
    process.exit(2);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const violations = [];
  let failed = false;

  for (const page of WATCHED_PAGES) {
    if (!manifest.pages[page]) {
      console.error(`✗ صفحه‌ی «${page}» در build-manifest نیست — نام صفحه عوض شده؟ گارد بی‌اثر می‌ماند.`);
      process.exit(2);
    }

    const files = initialFilesFor(manifest, page);
    let totalBytes = 0;

    for (const file of files) {
      const full = path.join(dir, file);
      if (!fs.existsSync(full)) continue;
      totalBytes += fs.statSync(full).size;
      if (RUNTIME_CHUNK.test(full)) continue;
      const content = fs.readFileSync(full, 'utf8');
      for (const entry of DENYLIST) {
        if (entry.marker.test(content)) {
          violations.push({ page, file, ...entry });
        }
      }
    }

    const totalKb = Math.round(totalBytes / 1024);
    console.log(`${page}: ${files.length} فایلِ initial، مجموعِ خام ${totalKb}KB`);

    if (maxKb && totalKb > maxKb) {
      console.error(`✗ بودجه شکست: ${totalKb}KB > ${maxKb}KB برای ${page}`);
      failed = true;
    }
  }

  if (violations.length) {
    failed = true;
    console.error('\n✗ کدِ سنگین در گرافِ initial پیدا شد:\n');
    for (const v of violations) {
      console.error(`  • ${v.package}  →  ${v.file}   (صفحه: ${v.page})`);
      console.error(`    چرا مهم است: ${v.why}`);
    }
    console.error(
      '\n  رفعِ معمول: importِ استاتیک را به `next/dynamic` یا `import()` تبدیل کن — گذاشتنِ `if` دورِ\n' +
        '  *استفاده* کافی نیست؛ webpack بر اساسِ *import* تصمیم می‌گیرد.\n'
    );
  }

  if (failed) process.exit(1);
  console.log('\n✓ هیچ پکیجِ denylist در گرافِ initialِ صفحاتِ پایش‌شده نیست.');
}

main();
