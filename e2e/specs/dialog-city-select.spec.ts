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
