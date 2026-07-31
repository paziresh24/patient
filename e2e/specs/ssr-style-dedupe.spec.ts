import { expect, test } from '@playwright/test';
import { LISTING_TEMPLATES } from '../fixtures/test-data';

/**
 * گاردِ «بلوکِ CSSِ پایه‌ی Radix نباید در SSR تکرار شود» (DR-08).
 *
 * چرا این تست وجود دارد: `BaseStyles()` در `@plasmicpkgs/radix-ui` به‌ازایِ **هر instance** از
 * کامپوننت‌هایِ Radix (Dialog/Popover/...) یک `<style>` inline با همان بلوکِ ثابتِ `.pl__*` +
 * `@keyframes plsmc-enter` رندر می‌کرد. روی `/s/tehran/dermatology/` این بلوک **۱۵۱ بار** در
 * HTMLِ خامِ سرور تکرار شده بود (~۳۷۲KB خالص تکرار از ۸۸۸KB). فیکس = پچِ
 * `scripts/patch-radix-basestyles.js` (که `BaseStyles()` را به `return null` تبدیل می‌کند) +
 * CSSِ معادل یک‌بار در `src/styles/plasmic-radix-base.css` (import شده در `_app.tsx`).
 *
 * ⚠️ عمداً `request` می‌گیرد نه `page`: هیچ JSای اجرا نمی‌شود، پس چیزی که این‌جا دیده می‌شود
 * دقیقاً HTMLِ خامِ سرور است — همان چیزی که وزنِ SSR را تعیین می‌کند.
 *
 * ⚠️ mutation-test شده: علیهِ production (که هنوز پچ ندارد) این تست باید **fail** شود (۱۵۱ >> ۲)؛
 * علیهِ یک buildِ لوکالِ patch‌شده (`E2E_BASE_URL=http://localhost:PORT`) باید **pass** شود.
 * اگر این تست علیهِ production سبز شد، یعنی خودِ تست چیزِ اشتباهی چک می‌کند — نه این‌که فیکس
 * جواب داده.
 */
const MARKER = '.pl__box-border';
// یک instance می‌تواند یک‌بار (از CSSِ globalِ importedِ ما) در body نمود پیدا کند؛ اجازه‌ی
// حاشیه‌ی کوچک برایِ اختلافِ minify/whitespace بینِ محیط‌ها هم می‌دهیم.
const MAX_OCCURRENCES = 2;

test.describe('SSR — تکرارِ CSSِ پایه‌ی Radix', () => {
  test('بلوکِ .pl__box-border نباید بیش از یک‌بار در HTMLِ سرورِ لیستینگ ظاهر شود', async ({
    request,
    baseURL,
  }) => {
    const res = await request.get(new URL(LISTING_TEMPLATES.specialtyInCity, baseURL).toString(), {
      headers: {
        'user-agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      },
    });
    expect(res.status()).toBe(200);
    const html = await res.text();
    // فقط بدنه — نه `__NEXT_DATA__`، وگرنه رشته‌ی داخلِ JSON هم شمرده می‌شود.
    const body = html.split('<script id="__NEXT_DATA__"')[0];
    const occurrences = body.split(MARKER).length - 1;

    expect(
      occurrences,
      `«${MARKER}» ${occurrences} بار در HTMLِ سرور تکرار شده — یعنی BaseStyles() هنوز به‌ازایِ هر instanceِ Radix رندر می‌شود (patch اعمال نشده یا از upstream عقب افتاده)`,
    ).toBeLessThanOrEqual(MAX_OCCURRENCES);
  });
});
