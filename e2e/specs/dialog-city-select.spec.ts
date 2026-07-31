import { expect, test } from '../support/fixtures';
import { CITY_FA, LISTING_TEMPLATES } from '../fixtures/test-data';

/**
 * گاردِ «دیالوگِ Plasmic/Radix واقعاً روی صفحه دیده می‌شود» — انتخابِ شهر.
 *
 * چرا این فایل وجود دارد (رگرسیونِ واقعیِ 2026-07-31، ghane:
 * `docs/bug-tickets/city-modal-radix-basestyles-cascade.md`):
 * commit `00c2a06a` بلوکِ base CSSِ `@plasmicpkgs/radix-ui` را از یک `<style>`ِ inline **داخلِ
 * body** به یک stylesheetِ معمولی در `<head>` (import در `_app.tsx`) منتقل کرد تا ۱۵۱ تکرارِ SSR
 * حذف شود. خودِ CSS بایت‌به‌بایت درست بود؛ چیزی که عوض شد **موقعیتِ cascade** بود:
 *
 *   .pl__fixed                          { position: fixed    }  ← sheetِ head (جدید)
 *   .PlasmicDialog_pcls_W-THuxFZxtZl__* { position: relative }  ← CSS moduleِ Plasmic، بعدتر
 *
 * هر دو specificityِ (0,1,0) دارند ⇒ ترتیب تصمیم می‌گیرد ⇒ `fixed` باخت. نتیجه روی production:
 * دیالوگ **باز می‌شد**، `baseinfo` هم کال می‌شد، محتوایش هم کامل بود — ولی چون از `fixed` افتاده
 * بود داخلِ جریانِ عادیِ سند در `y≈3094` (viewport = 812) رندر می‌شد و Radix هم‌زمان روی body
 * `overflow:hidden` + `pointer-events:none` گذاشته بود ⇒ کاربر «هیچ اتفاقی نمی‌افتد» می‌دید.
 *
 * ⚠️ درسِ اصلی که شکلِ این تست را تعیین کرد: گاردِ همراهِ آن commit
 * (`ssr-style-dedupe.spec.ts`) **optimization** را می‌سنجید (تعدادِ تکرارِ `.pl__box-border` صفر
 * شد؟) نه **invariantی که به خطر می‌انداخت** (استایل هنوز اعمال می‌شود؟). آن تست حتی اگر همه‌ی
 * دیالوگ‌های سایت نامرئی شوند سبز می‌ماند. پس این‌جا عمداً روی `page` (نه `request`) کار می‌کنیم
 * و **خروجیِ نهاییِ رندر** را ادعا می‌کنیم، نه محتوای HTML/CSS را.
 *
 * دو لایه‌ی ادعا:
 *  ۱. سطحِ کاربر — `toBeInViewport()`: «کادر را می‌بینم». مستقل از مکانیزم؛ هر علتِ دیگری
 *     (z-index، display، جابه‌جاییِ portal، انیمیشنِ گیرکرده) را هم می‌گیرد.
 *  ۲. سطحِ مکانیزم — `position === 'fixed'`: وقتی لایه‌ی ۱ قرمز شد، مستقیم می‌گوید **چرا**.
 *
 * ⚠️ verify-the-verifier: این تست علیهِ productionِ ۲۰۲۶-۰۷-۳۱ (قبل از revert) باید **قرمز**
 * شود و بعد از آن سبز. اگر روی buildِ شکسته سبز شد، یعنی خودِ تست چیزِ اشتباهی چک می‌کند.
 */

/** عنوانِ خودِ دیالوگ — پایدارترین امضایِ کاربر-دیدنیِ آن (کلاس‌های Plasmic با هر build عوض می‌شوند). */
const DIALOG_TITLE = 'انتخاب شهر';

/**
 * چیپِ شهر کنارِ کادرِ جستجو. `data-testid` در این کدبیس وجود ندارد (e2e/README)، پس از متنِ
 * کاربر-دیدنی استفاده می‌کنیم: روی `/s/tehran/**` این چیپ نامِ فارسیِ همان شهر را نشان می‌دهد.
 */
const cityChip = (page: import('@playwright/test').Page) => page.getByText(CITY_FA, { exact: true }).first();

for (const [label, path] of [
  ['لندینگِ شهر', LISTING_TEMPLATES.cityLanding],
  ['لندینگِ تخصص+شهر', LISTING_TEMPLATES.specialtyInCity],
] as const) {
  test(`دیالوگِ انتخابِ شهر روی ${label} داخلِ viewport باز می‌شود`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'domcontentloaded' });

    const chip = cityChip(page);
    await expect(chip, 'چیپِ شهر کنارِ کادرِ جستجو پیدا نشد').toBeVisible({ timeout: 30_000 });
    await chip.click();

    // ۱) سطحِ کاربر: عنوانِ دیالوگ باید **دیده** شود، نه فقط در DOM باشد.
    const title = page.getByText(DIALOG_TITLE, { exact: true }).first();
    await expect(title, 'دیالوگ در DOM نیامد').toBeVisible({ timeout: 15_000 });
    await expect(title, 'دیالوگ باز شد ولی بیرونِ viewport رندر شده — رگرسیونِ cascadeِ base CSSِ Radix؟').toBeInViewport();

    // ۲) سطحِ مکانیزم: overlay باید هنوز `fixed` باشد. این ادعا دقیقاً همان چیزی است که
    //    جابه‌جاییِ cascade می‌شکند، و پیامِ خطا مستقیماً به علت اشاره می‌کند.
    const overlay = page.locator('[data-state="open"]').first();
    const box = await overlay.evaluate(el => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return { position: cs.position, top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
    });

    expect(
      box.position,
      `overlayِ دیالوگ position=${box.position} دارد نه fixed — یعنی قاعده‌ی .pl__fixed در cascade به CSS moduleِ Plasmic باخته (هر دو specificityِ (0,1,0) دارند، پس ترتیبِ stylesheet تعیین‌کننده است)`,
    ).toBe('fixed');

    // و واقعاً با viewport تلاقی دارد (نه فقط «fixed» روی کاغذ).
    const viewportHeight = page.viewportSize()?.height ?? 0;
    expect(box.top, `overlay در y=${box.top} است در حالی که ارتفاعِ viewport ${viewportHeight} است`).toBeLessThan(viewportHeight);
    expect(box.bottom, 'overlay کاملاً بالای viewport است').toBeGreaterThan(0);
    expect(box.height, 'overlay ارتفاعِ صفر دارد').toBeGreaterThan(0);
  });
}

/**
 * تستِ ناوبریِ client-side (DR-08 §۲۵.۴، چک‌لیستِ re-land، بندِ ۲).
 *
 * چرا این تست لازم است: re-landِ درست (بلوکِ CSSِ پایه‌ی Radix در انتهای `<body>` از طریقِ
 * `_document.tsx`) روی این فرضِ **تئوریک** تکیه دارد که «cascade با موقعیتِ عنصر در سند تعیین
 * می‌شود، نه زمانِ درج» — پس حتی وقتی sheetِ CSS-moduleِ یک chunkِ lazy در **runtime** به `head`
 * اضافه می‌شود (که دقیقاً در یک ناوبریِ دوم اتفاق می‌افتد، نه در لودِ اول)، styleِ ما همچنان باید
 * برنده بماند. این فرض باید **تجربی** هم اثبات شود، نه فقط با استدلال — دقیقاً همان چیزی که چک‌لیست
 * (بندِ ۲) می‌خواهد.
 *
 * اثباتِ «واقعاً client-side بود، نه full reload»: قبل از کلیک یک probe روی `window` می‌گذاریم.
 * یک full page load این متغیر را پاک می‌کند؛ ناوبریِ SPAیِ next/router (این چیپ از طریقِ
 * `useSearchRouting().changeRoute` → `router.push({...}, undefined, {shallow:true})` می‌رود —
 * `src/modules/search/hooks/useSearchRouting.ts`) آن را دست‌نخورده نگه می‌دارد.
 *
 * ⚠️ این چیپِ ناوبری («پزشکان متخصص {شهر}») فقط وقتی رندر می‌شود که فلگِ GrowthBookِ
 * `search::desktop-filters-row` **خاموش** باشد (`src/pages/s/[[...params]].tsx`:
 * `showDesktopFiltersRow ? <MobileToolbar/> : <MobileRowFilter/>`؛ چیپ از دومی می‌آید). اگر آن
 * فلگ روشن شد این تست skip می‌شود با پیامِ صریح — این پیش‌نیازِ رسیدن به صحنه است، نه خودِ
 * regressionِ cascade، پس نباید با قرمزیِ گمراه‌کننده اشتباه گرفته شود.
 *
 * ⚠️ محلی‌بودن vs. production (یافته‌ی تجربی، هنگامِ اجرا علیهِ `next start`ِ محلی): نامِ شهر روی
 * `{شهر}` یک فراخوانیِ سمتِ کلاینت به `getbaseinfo` نیاز دارد که از `localhost` با CORS بلاک
 * می‌شود (همان کلاسِ محدودیتِ مستندشده در `e2e/support/capabilities.ts` برایِ فلوهای پروفایل/نوبت،
 * منتها این‌جا هیچ گاردی برایش نبود). نتیجه: چیپ و شهرِ پیش‌فرض به‌جایِ نامِ واقعی («تهران») مقدارِ
 * fallbackِ استور (`src/modules/search/store/search.ts`: «همه شهرها» → cityName محاسبه‌شده
 * «ایران») را نشان می‌دهند. **خودِ دیالوگ و مکانیزمِ Radix/`.pl__*` عوض نمی‌شود** — با کلیک روی
 * چیپِ fallback هم همان دیالوگ با `data-state="open"` و کلاس‌هایِ `.pl__*` باز می‌شود (تأییدِ دستی).
 * پس به‌جایِ گره‌زدنِ سخت به `CITY_FA`، این تست با یک الگوی متنیِ عمومی هم به چیپِ ناوبری هم به
 * چیپِ شهر می‌رسد — روی production (نامِ واقعیِ شهر) و روی لوکال (fallback) هر دو کار می‌کند، و
 * چیزی که assert می‌شود (باز شدنِ واقعیِ دیالوگ، در viewport، position:fixed) دست‌نخورده می‌ماند.
 */
test.describe('ناوبریِ client-side + دیالوگِ شهر (چک‌لیستِ re-land، بندِ ۲)', () => {
  // چیپِ ناوبری `md:hidden` است — ویوپورتِ موبایل را صریح تحمیل می‌کنیم تا صرفِ نظر از پروژه
  // (mobile/desktop) قابل‌مشاهده باشد.
  test.use({ viewport: { width: 390, height: 844 } });

  test('بعد از ناوبریِ client-side به لندینگِ دیگر، دیالوگِ شهر هنوز داخلِ viewport باز می‌شود', async ({ page }) => {
    await page.goto(LISTING_TEMPLATES.cityLanding, { waitUntil: 'domcontentloaded' });

    // «پزشکان متخصص {نامِ شهر یا fallback}» — نامِ دقیق بسته به این‌که getbaseinfo از این هدف
    // در دسترس است یا نه فرق می‌کند (بالا توضیح داده شد)؛ الگو هر دو حالت را می‌گیرد.
    const navChip = page.getByText(/^پزشکان متخصص /).first();
    const chipVisible = await navChip.isVisible({ timeout: 8_000 }).catch(() => false);
    test.skip(
      !chipVisible,
      'چیپِ ناوبریِ «پزشکان متخصص ...» دیده نشد — احتمالاً فلگِ GrowthBookِ search::desktop-filters-row ' +
        'روشن است و به‌جای MobileRowFilter کامپوننتِ MobileToolbar رندر شده (src/pages/s/[[...params]].tsx). ' +
        'این پیش‌نیازِ رسیدن به صحنه است، نه خودِ regressionِ cascade.',
    );

    // probe: مقداری که فقط یک full page reload آن را پاک می‌کند.
    await page.evaluate(() => {
      (window as any).__navProbe = 1;
    });

    await navChip.click();
    // مقصد `/s/{city-or-ir}/doctor` است — روی production همان اسلاگِ شهرِ فعلی (`tehran`) حفظ
    // می‌شود، روی لوکال (fallbackِ `en_slug=ir`) به `/s/ir/doctor` می‌رود؛ هر دو یک لندینگِ
    // «دسته‌بندی‌شده»ی متفاوت از مبدأ‌اند — که تمامِ چیزی است که این تست لازم دارد.
    // ⚠️ عمداً `page.waitForFunction` روی `location.pathname` است نه `page.waitForURL`: این یک
    // ناوبریِ shallow (`router.push(..., {shallow:true})`) است، بدونِ eventِ `load`ِ واقعیِ مرورگر
    // که `waitForURL` پیش‌فرض منتظرش می‌ماند — در عمل flaky از آب درآمد.
    await page.waitForFunction(() => /\/s\/[^/]+\/doctor\/?(\?|$)/.test(window.location.pathname + window.location.search), {
      timeout: 15_000,
    });

    const probeSurvived = await page.evaluate(() => (window as any).__navProbe);
    expect(
      probeSurvived,
      'window.__navProbe پاک شده — یعنی ناوبری واقعاً client-side نبود (full page reload رخ داد) و این تست فرضِ لازمش را نمی‌سنجد',
    ).toBe(1);

    // حالا، بعد از این ناوبریِ دوم (که chunk/CSS-moduleِ جدید ممکن است به head اضافه کرده باشد)،
    // دقیقاً همان دو لایه‌ی ادعایِ تستِ اصلی را تکرار می‌کنیم — منتها با همان چیپِ عمومی (بالا).
    const chip = page.getByText(new RegExp(`^(${CITY_FA}|همه شهرها|اطراف من)$`)).first();
    await expect(chip, 'چیپِ شهر بعد از ناوبریِ client-side پیدا نشد').toBeVisible({ timeout: 30_000 });
    await chip.click();

    const title = page.getByText(DIALOG_TITLE, { exact: true }).first();
    await expect(title, 'دیالوگ در DOM نیامد').toBeVisible({ timeout: 15_000 });
    await expect(
      title,
      'دیالوگ بعد از ناوبریِ client-side بیرونِ viewport رندر شده — یعنی sheetِ CSS-moduleِ لودشده در ' +
        'ناوبریِ دوم در cascade بعد از styleِ انتهایِ body نشسته (فرضِ نظریِ چک‌لیست شکسته)',
    ).toBeInViewport();

    const overlay = page.locator('[data-state="open"]').first();
    const position = await overlay.evaluate(el => getComputedStyle(el).position);
    expect(position, `overlayِ دیالوگ بعد از ناوبریِ client-side position=${position} دارد نه fixed`).toBe('fixed');
  });
});

/**
 * best-effort (DR-08 §۲۵.۴ بندِ ۳): دیالوگِ «فیلترها» روی یک لندینگِ غیرِ landing.
 *
 * ⚠️ این مودال از `src/common/components/atom/modal` می‌آید (react-spring)، نه Radixِ Plasmic —
 * طبقِ خودِ bug-ticket این کامپوننت اصلاً درگیرِ رگرسیونِ cascadeِ `.pl__*` نیست (positionِ آن از
 * یک کلاسِ Tailwindِ ثابت می‌آید، نه از `.pl__fixed`). پس این تست regressionِ اصلی را دوباره
 * ثابت نمی‌کند؛ صرفاً یک پوششِ اضافیِ ارزان برای دیالوگِ رایجِ دیگری در همین صفحات است.
 */
test.describe('دیالوگِ فیلترها (best-effort، پوششِ اضافی)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('دیالوگِ «فیلترها» روی نتایجِ دسته‌بندی‌شده داخلِ viewport باز می‌شود', async ({ page }) => {
    await page.goto('/s/tehran/doctor', { waitUntil: 'domcontentloaded' });

    const trigger = page.getByText('فیلترها', { exact: true }).first();
    const triggerVisible = await trigger.isVisible({ timeout: 8_000 }).catch(() => false);
    test.skip(
      !triggerVisible,
      'چیپِ «فیلترها» دیده نشد — یا فلگِ search::desktop-filters-row روشن است (MobileToolbar جایگزینِ ' +
        'MobileRowFilter شده) یا صفحه landing تشخیص داده شده (این چیپ فقط در حالتِ !isLanding رندر می‌شود).',
    );
    await trigger.click();

    // بعد از باز شدن، دو عنصر با متنِ «فیلترها» در DOM هست: خودِ چیپِ trigger و عنوانِ مودال —
    // مودال از طریقِ ClientOnlyPortal به انتهایِ body پورتال می‌شود، پس در ترتیبِ سند بعد از
    // چیپ می‌آید ⇒ آخرین match عنوانِ مودالِ باز شده است.
    const modalTitle = page.getByText('فیلترها', { exact: true }).last();
    await expect(modalTitle, 'عنوانِ مودالِ فیلترها دیده نشد').toBeVisible({ timeout: 15_000 });
    await expect(modalTitle, 'مودالِ فیلترها باز شد ولی بیرونِ viewport است').toBeInViewport();
  });
});
