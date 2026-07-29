import { expect, test } from '@playwright/test';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { DoctorProfilePage } from '../pages/doctor-profile.page';
import { SearchPage } from '../pages/search.page';

/**
 * Visual Regression — با `toHaveScreenshot()` خودِ Playwright (بدونِ Percy/BackstopJS).
 *
 * چه چیزی را می‌گیرد: جابه‌جاییِ کانتینرها، لود نشدنِ استایل، تغییرِ ابعادِ فونت/تصویر — یعنی
 * دقیقاً همان خانواده‌ای که تغییراتِ CLS/lazy-load تولید می‌کنند و در تستِ کارکردی نامرئی‌اند.
 *
 * ⚠️ چالشِ ذاتی: این صفحات **دیتای زنده** دارند (نامِ پزشکان، عکس‌ها، امتیازها) ⇒ اسکرین‌شاتِ خام
 * هر روز فرق می‌کند و تست به نویز تبدیل می‌شود. راهکار:
 *   ۱) ماسک‌کردنِ نواحیِ دیتا-محور (`mask`) تا فقط **اسکلتِ چیدمان** مقایسه شود،
 *   ۲) `maxDiffPixelRatio` کوچک ولی غیرصفر (playwright.config.ts) برای anti-aliasingِ فونتِ فارسی.
 * یعنی این تست «آیا layout جابه‌جا شد؟» را می‌سنجد، نه «آیا محتوا عوض شد؟».
 *
 * به‌روزرسانیِ baseline بعد از یک تغییرِ عمدیِ UI:
 *   npm run e2e:visual:update
 */
test.describe('Visual regression', () => {
  test('لندینگِ تخصص+شهر — اسکلتِ چیدمان', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await expect(page).toHaveScreenshot('listing-specialty-city.png', {
      fullPage: false,
      mask: [page.locator('img'), page.locator('a[href*="/dr/"]')],
    });
  });

  test('پروفایلِ پزشک — اسکلتِ چیدمان', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    const href = await search.firstDoctorHref();

    const profile = new DoctorProfilePage(page);
    await profile.goto(href);
    await profile.expectRendered();
    await page.waitForLoadState('networkidle').catch(() => undefined);

    await expect(page).toHaveScreenshot('doctor-profile.png', {
      fullPage: false,
      mask: [page.locator('img'), page.locator('h1')],
    });
  });
});
