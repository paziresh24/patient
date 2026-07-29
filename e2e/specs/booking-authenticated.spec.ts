import { expect, test } from '@playwright/test';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { BookingPage } from '../pages/booking.page';
import { DoctorProfilePage } from '../pages/doctor-profile.page';
import { SearchPage } from '../pages/search.page';
import { AUTH_STATE_PATH, hasAuthState, NEEDS_LOGIN } from '../support/auth';

/**
 * مسیرِ بحرانی #۳ (ادامه) — انتخابِ بیمار و ثبتِ نهاییِ نوبت.
 *
 * ⚠️ این تست روی **دیتای واقعی** می‌نویسد (یک نوبتِ واقعی برای یک پزشکِ واقعی ثبت می‌شود). به همین
 * دلیل:
 *   ۱) فقط با `E2E_BOOKING_SUBMIT=1` دکمه‌ی نهایی زده می‌شود؛ بدونِ آن، تست تا **یک قدم قبل**
 *      می‌رود و همه‌ی گاردهای hydration را می‌گیرد بدونِ اشغالِ نوبتِ کسی.
 *   ۲) وقتی هم ثبت می‌کند، بلافاصله **خودش لغو می‌کند** و لغو را assert می‌کند ⇒ تست خودتمیزکن
 *      است و دیتای زباله جا نمی‌گذارد.
 *
 * صداقتِ وضعیت: گام‌های پس از لاگین از روی نقشه‌ی رویدادهای قیف نوشته شده‌اند
 * (ghane/docs/infrastructure-maneuver/analytics-events-map.md: choose-sub-user → book-date →
 * doctor profile book received → view-receipt-page) و **هنوز با یک حسابِ واقعی اجرا نشده‌اند**؛
 * اولین اجرا با حسابِ تست ممکن است نیاز به تنظیمِ متنِ سلکتورها داشته باشد — traceِ Playwright
 * (`e2e/.report`) دقیقاً نشان می‌دهد کجا.
 */
test.describe('نوبت‌گیری — با لاگین', () => {
  test.skip(!hasAuthState(), NEEDS_LOGIN);
  test.use({ storageState: hasAuthState() ? AUTH_STATE_PATH : undefined });

  test('انتخاب زمان → انتخاب بیمار → تأیید (و در صورت اجازه، ثبت و لغو)', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();

    const profile = new DoctorProfilePage(page);
    const candidates = (await search.uniqueDoctorLinks()).slice(0, 6);
    let opened = false;
    for (const href of candidates) {
      await profile.goto(href);
      if (!(await profile.bookingButton.isVisible().catch(() => false))) continue;
      await profile.bookingButton.click();
      opened = await page
        .waitForURL(/\/booking\//, { timeout: 20_000 })
        .then(() => true)
        .catch(() => false);
      if (opened) break;
    }
    expect(opened, 'فلوی نوبت‌دهی باز نشد').toBe(true);

    const booking = new BookingPage(page);
    await booking.expectTimeStep();
    await booking.continue();

    // چون لاگین هستیم نباید به صفحه‌ی ورود برویم.
    await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });

    // انتخابِ بیمار (`choose-sub-user` در قیف). حسابِ تست معمولاً «خودم» را دارد.
    const patientChoice = page.getByRole('button', { name: /خودم|انتخاب بیمار|ادامه/ }).first();
    await expect(patientChoice, 'مرحله‌ی انتخابِ بیمار ظاهر نشد').toBeVisible({ timeout: 45_000 });
    await patientChoice.click();

    // صفحه‌ی تأیید/فاکتور باید اطلاعاتِ نوبت را نشان بدهد.
    const confirmStep = page.getByText(/تأیید|تایید|پرداخت|هزینه|فاکتور/).first();
    await expect(confirmStep, 'مرحله‌ی تأیید/فاکتور ظاهر نشد').toBeVisible({ timeout: 45_000 });

    if (process.env.E2E_BOOKING_SUBMIT !== '1') {
      test.info().annotations.push({
        type: 'note',
        description:
          'ثبتِ نهایی انجام نشد (E2E_BOOKING_SUBMIT=1 ست نیست) — عمدی، تا نوبتِ واقعی اشغال نشود.',
      });
      return;
    }

    const submit = page.getByRole('button', { name: /ثبت نوبت|تأیید و پرداخت|تایید و پرداخت|پرداخت/ }).first();
    await submit.click();

    // conversion واقعی = رسیدن به صفحه‌ی قبض (`view-receipt-page`).
    await expect(page.getByText(/کد رهگیری|قبض|رسید/).first(), 'به صفحه‌ی قبض نرسیدیم').toBeVisible({
      timeout: 60_000,
    });

    // خودتمیزکن: نوبتِ ثبت‌شده باید لغو شود.
    await page.goto('/patient/appointments/', { waitUntil: 'domcontentloaded' });
    const cancel = page.getByRole('button', { name: /لغو نوبت|لغو/ }).first();
    await expect(cancel, 'دکمه‌ی لغو در لیستِ نوبت‌ها پیدا نشد — نوبتِ تست باید دستی لغو شود!').toBeVisible({
      timeout: 45_000,
    });
    await cancel.click();
    const confirmCancel = page.getByRole('button', { name: /بله|تأیید|تایید/ }).first();
    if (await confirmCancel.isVisible().catch(() => false)) await confirmCancel.click();
    await expect(page.getByText(/لغو شد|لغو شده/).first()).toBeVisible({ timeout: 45_000 });
  });
});
