import { test } from '@playwright/test';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { DoctorProfilePage } from '../pages/doctor-profile.page';
import { SearchPage } from '../pages/search.page';

/**
 * مسیرِ بحرانی #۲ — پروفایلِ پزشک.
 *
 * پزشکِ هدف از نتایجِ زنده انتخاب می‌شود (نه هاردکد)، تا غیرفعال‌شدنِ یک پزشک تست را
 * به‌دروغ قرمز نکند.
 */
test.describe('پروفایلِ پزشک', () => {
  test('اجزای حیاتیِ صفحه رندر می‌شوند (نام، نظرات، آدرس، دکمه‌ی نوبت)', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    const href = await search.firstDoctorHref();

    const profile = new DoctorProfilePage(page);
    await profile.goto(href);
    await profile.expectRendered();
    await profile.expectReviewsSection();
  });
});
