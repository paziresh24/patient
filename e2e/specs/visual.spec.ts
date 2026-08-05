import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES, MIN_RESULTS } from '../fixtures/test-data';
import { SearchPage } from '../pages/search.page';

/**
 * Visual Regression — با `toHaveScreenshot()` خودِ Playwright (بدونِ Percy/BackstopJS).
 *
 * ⚠️ درسِ سختِ اجرا (2026-07-30): نسخه‌ی اولِ این تست اسکرین‌شاتِ **کلِ صفحه‌ی نتایج** را با
 * ماسک‌کردنِ عکس‌ها و لینک‌ها می‌گرفت. نتیجه: baseline یک روز بعد شکست — نه به‌خاطرِ رگرسیون، بلکه
 * چون محتوای واقعی عوض شده بود (نامِ پزشکان و طولِ متن‌ها ارتفاعِ کارت‌ها را جابه‌جا می‌کند و ماسک
 * جلوی آن را نمی‌گیرد). پروب شبکه هم نشان داد نتایجِ لیستینگ **SSR** است، پس نمی‌شود با stubِ
 * کلاینت آن را قطعی کرد. یک گاردِ نویزی از نبودنِ گارد بدتر است (کسی جدی‌اش نمی‌گیرد).
 *
 * طراحیِ دوم — دو لایه‌ی **قطعی**:
 *  ۱. اسکرین‌شاتِ فقط **chromeِ بالای صفحه** (هدر/سرچ‌بار/نوار فیلتر) که به دیتای نتایج وابسته
 *     نیست ⇒ «استایل لود نشد»، «کانتینر جابه‌جا شد»، «ابعادِ فونت/آیکن عوض شد» را می‌گیرد.
 *  ۲. **invariantهای عددیِ چیدمان** که مستقل از محتوا صادق‌اند (سرریزِ افقی، ترتیبِ عمودیِ
 *     بخش‌ها، وجودِ حداقلِ کارت). این‌ها همان خانواده‌ای را می‌گیرند که CLS تولید می‌کند.
 *
 * به‌روزرسانیِ baseline بعد از تغییرِ عمدیِ UI: `npm run e2e:visual:update`
 */
const CHROME_HEIGHT = 260;

test.describe('Visual regression', () => {
  test('chromeِ بالای لیستینگ — مقایسه‌ی پیکسلی', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    // best-effort با سقف — بدونِ timeout این انتظار بی‌نهایت است (playwright.config.ts).
    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);

    const viewport = page.viewportSize();
    await expect(page).toHaveScreenshot('listing-chrome.png', {
      clip: { x: 0, y: 0, width: viewport?.width ?? 1280, height: CHROME_HEIGHT },
      // آواتار/لوگوها ممکن است دیرتر برسند؛ خودِ چیدمان مهم است نه بیت‌های تصویر.
      mask: [page.locator('img')],
    });
  });

  test('invariantهای چیدمانِ لیستینگ (مستقل از محتوا)', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    // best-effort با سقف — بدونِ timeout این انتظار بی‌نهایت است (playwright.config.ts).
    await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => undefined);

    const layout = await page.evaluate(() => {
      const doc = document.documentElement;
      const firstCard = document.querySelector('a[href*="/dr/"]');
      const input = document.querySelector('input[name="searchInput"]');
      const rect = (el: Element | null) => (el ? el.getBoundingClientRect().top + window.scrollY : -1);
      return {
        horizontalOverflow: doc.scrollWidth - doc.clientWidth,
        searchTop: rect(input),
        firstCardTop: rect(firstCard),
        cards: new Set([...document.querySelectorAll('a[href*="/dr/"]')].map(a => a.getAttribute('href'))).size,
      };
    });

    // ۱) هیچ سرریزِ افقی — رایج‌ترین شکستِ لِی‌اوت روی موبایل.
    expect(layout.horizontalOverflow, 'صفحه سرریزِ افقی دارد').toBeLessThanOrEqual(1);
    // ۲) نوارِ جستجو بالای اولین کارت است (ترتیبِ عمودیِ بخش‌ها نشکسته).
    expect(layout.searchTop, 'نوارِ جستجو پیدا نشد').toBeGreaterThanOrEqual(0);
    expect(layout.firstCardTop, 'اولین کارت بالاتر از نوارِ جستجو رفته').toBeGreaterThan(layout.searchTop);
    // ۳) تعدادِ کارت‌ها معنادار است.
    expect(layout.cards).toBeGreaterThanOrEqual(MIN_RESULTS);
  });
});
