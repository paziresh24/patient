import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { BookingPage } from '../pages/booking.page';
import { DoctorProfilePage } from '../pages/doctor-profile.page';
import { SearchPage } from '../pages/search.page';
import { FULL_FLOW_SKIP, shouldRunFullFlows } from '../support/capabilities';

/**
 * مسیرِ بحرانی #۳ (بخشِ عمومی) — «دریافت نوبت» تا مرحله‌ی انتخابِ زمان.
 *
 * این تست بدونِ هیچ حساب/دیتای واقعی اجرا می‌شود و همان چیزی را می‌گیرد که یک رگرسیونِ
 * lazy-load/hydration اول از همه می‌شکند: دکمه‌ی «دریافت نوبت» دیده می‌شود ولی کلیک اثری ندارد،
 * یا صفحه‌ی انتخابِ زمان بدونِ زمانِ خالی رندر می‌شود.
 *
 * ⚠️ داده-وابستگی (درسِ اجرای واقعی): هر پزشکی زمانِ خالی ندارد. پس تست روی چند کاندید حلقه
 * می‌زند و ادعایش این است: «برای حداقل یک پزشکِ واقعی، مسیرِ پروفایل → انتخابِ زمان **کار
 * می‌کند**». ادامه‌ی فلو (انتخاب بیمار → ثبت نهایی) در `booking-authenticated.spec.ts` است.
 */
test.describe('نوبت‌گیری — بخشِ عمومی', () => {
  test('از پروفایل تا انتخابِ زمانِ نوبت', async ({ page, baseURL }) => {
    test.skip(!shouldRunFullFlows(baseURL), FULL_FLOW_SKIP);

    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();

    const candidates = (await search.uniqueDoctorLinks()).slice(0, 8);
    const profile = new DoctorProfilePage(page);
    const booking = new BookingPage(page);
    const tried: string[] = [];

    for (const href of candidates) {
      await profile.goto(href);
      tried.push(href);
      if (!(await profile.bookingButton.isVisible().catch(() => false))) continue;

      await profile.bookingButton.click();
      const wentToBooking = await page
        .waitForURL(/\/booking\//, { timeout: 20_000 })
        .then(() => true)
        .catch(() => false);
      if (!wentToBooking) continue;

      // این پزشک ممکن است زمانِ خالی نداشته باشد ⇒ کاندیدِ بعدی.
      if (!(await booking.hasTimeStep())) continue;

      await booking.expectTimeStep();
      const slot = await booking.earliestSlotText();
      expect(slot, 'متنِ زودترین زمانِ خالی خالی است').not.toHaveLength(0);
      return;
    }

    expect(
      false,
      `هیچ‌کدام از ${tried.length} پزشکِ آزمایش‌شده به مرحله‌ی انتخابِ زمان نرسیدند:\n${tried.join('\n')}`,
    ).toBe(true);
  });
});
