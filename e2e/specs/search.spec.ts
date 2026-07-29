import { expect, test } from '@playwright/test';
import { LISTING_TEMPLATES, SEARCH_QUERIES } from '../fixtures/test-data';
import { SearchPage } from '../pages/search.page';

/**
 * مسیرِ بحرانی #۱ — جستجو.
 *
 * چرا این تست‌ها دقیقاً این چیزها را چک می‌کنند: تغییراتِ CWV (lazy-load، defer/async، دستکاری
 * critical rendering path) دقیقاً همین‌جا خطرناک‌اند — HTMLِ SSR سالم می‌آید ولی JS دیر/ناقص
 * hydrate می‌شود و نوارِ سرچ یا کارت‌ها بی‌جان می‌مانند. پس فقط «۲۰۰ گرفتن» کافی نیست؛ باید
 * **تعاملِ واقعی** (تایپ + Enter + رسیدن به نتایج) هم سبز باشد.
 */
test.describe('جستجو', () => {
  test('لندینگِ تخصص+شهر نتایجِ سالم رندر می‌کند', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
  });

  test('جستجوی تخصص از نوارِ سرچ کار می‌کند (گاردِ hydration)', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.cityRoot);
    await search.searchFor(SEARCH_QUERIES.specialty);
    await search.expectHealthyResults();
  });

  test('جستجوی نامِ پزشک نتیجه می‌دهد', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.cityRoot);
    await search.searchFor(SEARCH_QUERIES.doctorName);
    // نامِ پزشک مسیرِ retrievalِ متفاوتی دارد و ممکن است نتایجِ کمتری بدهد ⇒ فقط «خالی نباشد».
    await expect(search.doctorCards.first()).toBeVisible({ timeout: 30_000 });
  });

  test('کلیک روی نتیجه به پروفایلِ همان پزشک می‌رود', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    const href = await search.firstDoctorHref();
    await search.doctorCards.first().click();
    await page.waitForURL(/\/dr\//, { timeout: 45_000 });
    expect(decodeURIComponent(page.url())).toContain(decodeURIComponent(href));
  });
});
