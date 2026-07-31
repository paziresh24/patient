/**
 * پچِ idempotent برایِ `@plasmicpkgs/radix-ui` — ریشه‌کنِ تکرارِ ۱۵۱بارهٔ یک بلوکِ `<style>` در SSR.
 *
 * چرا: تابعِ `BaseStyles()` در این پکیج به‌ازایِ **هر instance** از کامپوننت‌هایِ Radix (Dialog/Popover/...)
 * یک `<style dangerouslySetInnerHTML>` با همان بلوکِ ثابتِ ~۲.۵KB (کلاس‌هایِ `.pl__*` + `@keyframes plsmc-enter`)
 * رندر می‌کند. روی صفحاتِ لیستینگ که ده‌ها Radix instance دارند، همین یک بلوک ده‌ها بار تکرار می‌شود
 * (روی /s/tehran/dermatology/ اندازه‌گیری شد: ۱۵۱ بار، ۳۷۲KB خالص از ۸۸۸KB HTMLِ خام).
 *
 * راهِ حل: خودِ CSS جای دیگری inject می‌شود، پس این‌جا فقط لازم است `BaseStyles()` هیچ‌چیز رندر
 * نکند (`return null`) تا موتور دیگر این تگ‌هایِ تکراری را در HTMLِ سرور ننویسد.
 *
 * ⚠️ re-land (DR-08 §۲۵.۴، ghane/docs/bug-tickets/city-modal-basestyles-cascade.md): جایِ CSS
 * دیگر `src/styles/plasmic-radix-base.css` + importِ `_app.tsx` **نیست** — نسخه‌ی اول این‌طور بود
 * و یک رگرسیونِ cascade ساخت (CSS در `<head>` رفت و `.pl__fixed` در تساویِ specificity به
 * CSS-moduleِ Plasmic باخت ⇒ دیالوگِ «انتخاب شهر» نامرئی شد). الان CSS در
 * `src/styles/plasmicRadixBaseCss.ts` export می‌شود و `_document.tsx` آن را **بعد از `<Main/>`،
 * در انتهایِ `<body>`** رندر می‌کند — دقیقاً همان موقعیتِ cascadeی که `BaseStyles()`ِ اصلی داشت.
 *
 * چرا دست‌زدن به node_modules مجاز است: Plasmic در حالِ discontinue شدن است (ghane DR-08)، پس
 * patch-package/PR بالادستی هزینه‌اش را نمی‌ارزد؛ این اسکریپت idempotent است و با pattern-drift
 * (آپدیتِ نسخهٔ پکیج) به‌جایِ patchِ خاموش، fail می‌کند تا حواسمان جمعِ تغییرِ upstream باشد. گاردِ
 * دومِ همین فایل (پایین) یک drift-checkِ جداگانه است: محتوایِ فعلیِ پکیج را دوباره استخراج می‌کند
 * و با `plasmicRadixBaseCss.ts`ِ checked-in مقایسه می‌کند — اگر آپدیتِ پکیج این CSS را بی‌صدا عوض
 * کرده باشد (نه فقط امضایِ تابع)، همین‌جا با پیامِ واضح fail می‌شود.
 *
 * ⚠️ هرگز در این worktree `npm install`/`npm ci` اجرا نکن — node_modules یک junction به
 * worktreeِ اصلی است و install آن را خراب می‌کند.
 */
const fs = require('fs');
const path = require('path');
const { extractRadixBaseCss } = require('./lib/extractRadixBaseStyles');

const TARGET_FILES = [
  path.join(__dirname, '..', 'node_modules', '@plasmicpkgs', 'radix-ui', 'dist', 'index.js'),
  path.join(__dirname, '..', 'node_modules', '@plasmicpkgs', 'radix-ui', 'dist', 'index.mjs'),
];

// ⚠️ CRLF-tolerant: node_modules روی این worktreeِ ویندوزی می‌تواند خطِ‌آخرِ \r\n داشته باشد
// (junction به یک checkoutِ دیگر) — پس به‌جایِ برابریِ رشته‌ایِ دقیق، regexِ `\r?\n` تطبیق می‌دهد.
const OLD_BODY_PATTERN =
  /function BaseStyles\(\) \{\r?\n {2}return \/\* @__PURE__ \*\/ React\.createElement\("style", \{ dangerouslySetInnerHTML: \{ __html: prefixedBaseStyles \} \}\);\r?\n\}/;

const NEW_BODY = 'function BaseStyles() {\n  return null;\n}';
const NEW_BODY_CRLF = NEW_BODY.replace(/\n/g, '\r\n');

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ patch-radix-basestyles: فایل پیدا نشد: ${filePath}`);
    console.error('   احتمالاً نسخهٔ @plasmicpkgs/radix-ui تغییر کرده یا node_modules نصب نشده.');
    process.exitCode = 1;
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(NEW_BODY) || content.includes(NEW_BODY_CRLF)) {
    console.log(`✅ patch-radix-basestyles: از قبل patch شده، رد شد: ${filePath}`);
    return true;
  }

  if (OLD_BODY_PATTERN.test(content)) {
    const patched = content.replace(OLD_BODY_PATTERN, NEW_BODY);
    fs.writeFileSync(filePath, patched, 'utf8');
    console.log(`✅ patch-radix-basestyles: patch شد: ${filePath}`);
    return true;
  }

  console.error(`❌ patch-radix-basestyles: patternِ موردِ انتظارِ BaseStyles() در فایل پیدا نشد: ${filePath}`);
  console.error('   احتمالاً نسخهٔ @plasmicpkgs/radix-ui عوض شده — این اسکریپت را با محتوایِ جدید هماهنگ کن.');
  process.exitCode = 1;
  return false;
}

/**
 * گاردِ drift: `src/styles/plasmicRadixBaseCss.ts` باید بایت‌به‌بایت همان چیزی باشد که همین لحظه
 * از `node_modules/@plasmicpkgs/radix-ui` قابل‌استخراج است. اگر آپدیتِ پکیج محتوایِ
 * `prefixedBaseStyles` را عوض کرده باشد (نه فقط بدنه‌ی `BaseStyles()` که بالا patch شد)، فایلِ
 * checked-in از upstream عقب می‌ماند و کاربر یک نسخه‌ی کهنه از CSS را می‌بیند — بی‌صدا، چون هیچ
 * خطایِ build/type این را نمی‌گیرد. این تابع دقیقاً همان استخراجِ برنامه‌ای را دوباره اجرا می‌کند
 * (`scripts/lib/extractRadixBaseStyles.js`) و رشته‌ی نتیجه را با چیزی که در فایلِ TSِ ما export
 * شده مقایسه می‌کند.
 */
function assertNoRadixCssDrift() {
  const tsFile = path.join(__dirname, '..', 'src', 'styles', 'plasmicRadixBaseCss.ts');

  if (!fs.existsSync(tsFile)) {
    console.error(`❌ patch-radix-basestyles: ${tsFile} پیدا نشد — فایلِ export موردِ انتظار حذف شده؟`);
    return false;
  }

  let currentCss;
  try {
    currentCss = extractRadixBaseCss();
  } catch (err) {
    console.error(`❌ patch-radix-basestyles: استخراجِ CSS از پکیجِ زنده شکست خورد: ${err.message}`);
    return false;
  }

  const tsContent = fs.readFileSync(tsFile, 'utf8');
  const match = tsContent.match(/export const plasmicRadixBaseCss = ("(?:[^"\\]|\\.)*");/);
  if (!match) {
    console.error(`❌ patch-radix-basestyles: الگویِ «export const plasmicRadixBaseCss = "..."؛» در ${tsFile} پیدا نشد.`);
    return false;
  }

  let checkedInCss;
  try {
    checkedInCss = JSON.parse(match[1]);
  } catch (err) {
    console.error(`❌ patch-radix-basestyles: مقدارِ export شده در ${tsFile} یک رشته‌ی JSONِ معتبر نیست: ${err.message}`);
    return false;
  }

  if (checkedInCss !== currentCss) {
    console.error(
      '❌ patch-radix-basestyles: drift — CSSِ checked-inِ src/styles/plasmicRadixBaseCss.ts با آنچه ' +
        'الان از @plasmicpkgs/radix-ui استخراج می‌شود فرق دارد.',
    );
    console.error(`   طول checked-in: ${checkedInCss.length} — طول استخراجِ تازه: ${currentCss.length}`);
    console.error(
      '   احتمالاً نسخه‌ی @plasmicpkgs/radix-ui آپدیت شده. برایِ رفع: از نو تولید کن ' +
        '(همان منطقِ scripts/lib/extractRadixBaseStyles.js را روی پکیجِ جدید اجرا کن و ' +
        'src/styles/plasmicRadixBaseCss.ts را جایگزین کن) و e2e/specs/ssr-style-dedupe.spec.ts + ' +
        'dialog-city-select.spec.ts را دوباره اجرا کن.',
    );
    return false;
  }

  console.log('✅ patch-radix-basestyles: بدونِ drift — plasmicRadixBaseCss.ts با پکیجِ فعلی یکی است.');
  return true;
}

let ok = true;
for (const filePath of TARGET_FILES) {
  if (!patchFile(filePath)) ok = false;
}

if (!assertNoRadixCssDrift()) ok = false;

if (!ok) {
  process.exit(1);
}
