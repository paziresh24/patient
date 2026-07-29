import { expect, test } from '@playwright/test';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { BookingPage } from '../pages/booking.page';
import { DoctorProfilePage } from '../pages/doctor-profile.page';
import { SearchPage } from '../pages/search.page';

/**
 * مسیرِ بحرانی #۳ (بخشِ عمومی) — «دریافت نوبت» تا دیوارِ لاگین.
 *
 * این تست بدونِ هیچ حساب/دیتای واقعی اجرا می‌شود و همان چیزی را می‌گیرد که یک رگرسیونِ
 * lazy-load/hydration اول از همه می‌شکند: دکمه‌ی «دریافت نوبت» دیده می‌شود ولی کلیک اثری ندارد،
 * یا صفحه‌ی انتخابِ زمان بدونِ زمانِ خالی رندر می‌شود.
 * ادامه‌ی فلو (انتخاب بیمار → ثبت نهایی) در `booking-authenticated.spec.ts` است.
 */
test.describe('نوبت‌گیری — بخشِ عمومی', () => {
  test('از پروفایل تا انتخابِ زمانِ نوبت', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();

    // بینِ نتایج، اولین پزشکی که واقعاً دکمه‌ی نوبت‌دهیِ فعال دارد را پیدا کن.
    const candidates = (await search.uniqueDoctorLinks()).slice(0, 6);
    const profile = new DoctorProfilePage(page);
    let opened = false;

    for (const href of candidates) {
      await profile.goto(href);
      if (!(await profile.bookingButton.isVisible().catch(() => false))) continue;
      await profile.bookingButton.click();
      const wentToBooking = await page
        .waitForURL(/\/booking\//, { timeout: 20_000 })
        .then(() => true)
        .catch(() => false);
      if (wentToBooking) {
        opened = true;
        break;
      }
    }

    expect(opened, 'هیچ‌کدام از ۶ پزشکِ اولِ نتایج فلوی نوبت‌دهی را باز نکردند').toBe(true);

    const booking = new BookingPage(page);
    await booking.expectTimeStep();
    const slot = await booking.earliestSlotText();
    expect(slot, 'متنِ زودترین زمانِ خالی خالی است').not.toHaveLength(0);
  });
});
