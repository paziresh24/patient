import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { SearchPage } from '../pages/search.page';

/**
 * Visual regression — **سطحِ خودِ کارت** (نه فقط chromeِ بالای صفحه).
 *
 * چرا این فایل لازم است: `visual.spec.ts` صراحتاً مستندش کرده — آن تست فقط ۲۶۰px بالای صفحه
 * (هدر/سرچ‌بار) را اسکرین‌شات می‌گیرد، پس امروز **هیچ پوششِ بصری‌ای روی خودِ کارت‌ها نیست**.
 * دقیقاً همان بخشی که قرار است با کامپوننتِ سبکِ دستی جایگزین شود. این فایل آن حفره را می‌بندد:
 * اسکرین‌شاتِ element-levelِ خودِ اولین کارت، روی هر دو پروژه‌ی `mobile` و `desktop`.
 *
 * ⛔ همان درسِ `visual.spec.ts`: چون این علیهِ **دیتای زنده‌ی production** اجرا می‌شود، محتوای
 * متغیر (آواتار، قیمت، امتیاز/نظر) باید mask شود — وگرنه baseline با تغییرِ دیتای روزانه شکست
 * می‌خورد، نه با رگرسیونِ واقعی. mask کردن یعنی این پیکسل‌ها از diff کنار گذاشته می‌شوند و فقط
 * **چیدمان** (ابعاد، جای‌گذاریِ نسبیِ عناصر) سنجیده می‌شود.
 *
 * ⚠️ محدودیتِ باقی‌مانده (صادقانه ثبت می‌شود، مثلِ توضیحِ خودِ visual.spec.ts): نامِ پزشک mask
 * نمی‌شود چون بخشی از چیدمان است که می‌خواهیم بسنجیم، ولی طولِ نام روز به روز عوض می‌شود و می‌تواند
 * ارتفاعِ کارت را کمی جابه‌جا کند. `maxDiffPixelRatio: 0.02` (تنظیمِ سراسریِ playwright.config)
 * تا حدی این را تحمل می‌کند؛ اگر این تست به‌خاطرِ طولِ نام flaky شد، گزینه‌ی بعدی maskِ ناحیه‌ی
 * متنِ نام (نه فقط تصویر/قیمت/امتیاز) است — عمداً این‌جا این کار نشده چون آن‌وقت دیگر عملاً فقط
 * اسکلتِ خالیِ کارت سنجیده می‌شود.
 *
 * سلکتورِ کارت عمداً بدونِ کلاسِ Plasmic — همان تکنیکِ `card-content.spec.ts`: گروهِ anchorهایِ
 * هم-href را پیدا و نزدیک‌ترین اجدادِ مشترک‌شان را تگ می‌کند؛ قبل/بعدِ رفکتور یکسان کار می‌کند.
 */
async function tagFirstCard(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    const anchors = [...document.querySelectorAll<HTMLAnchorElement>('a[href*="/dr/"]')];
    const firstHref = anchors[0]?.getAttribute('href');
    if (!firstHref) return;
    const group = anchors.filter(a => a.getAttribute('href') === firstHref);
    let ancestor: Element | null = group[0];
    while (ancestor && !group.every(a => ancestor!.contains(a))) {
      ancestor = ancestor.parentElement;
    }
    ancestor?.setAttribute('data-e2e-first-card', 'true');
  });
}

test.describe('Visual regression — کارتِ اول (element-level)', () => {
  test('اسکرین‌شاتِ کارتِ اول', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await tagFirstCard(page);
    const card = page.locator('[data-e2e-first-card="true"]');
    await expect(card, 'کارتِ اول برای اسکرین‌شات پیدا نشد').toBeVisible({ timeout: 15_000 });

    // نواحیِ متغیر: آواتار (تصویر) + هر متنی که شبیهِ قیمت («تومان») یا امتیاز/نظر («۴.۸(۲۸۶ نظر)»)
    // است. این‌ها روزانه عوض می‌شوند؛ mask یعنی از pixel-diff کنار گذاشته می‌شوند و فقط جای‌گذاریِ
    // نسبی‌شان (چیدمان) سنجیده می‌شود.
    const maskLocators = [card.locator('img'), card.getByText(/تومان/), card.getByText(/\d(\.\d)?\s*\(\s*\d+\s*نظر\)/)];

    await expect(card).toHaveScreenshot('first-result-card.png', {
      mask: maskLocators,
    });
  });
});
