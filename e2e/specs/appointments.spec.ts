import { expect, test } from '../support/fixtures';
import { AUTH_STATE_PATH, hasAuthState, NEEDS_LOGIN } from '../support/auth';

/**
 * مسیرِ بحرانی #۴ — «لیستِ نوبت‌های من».
 *
 * نیازمندِ session (OTP دستی، یک‌بار): `npm run e2e:login`.
 * اگر session نباشد تست **skip** می‌شود، نه fail — تا نبودِ لاگین با خرابیِ محصول اشتباه نشود.
 */
test.describe('نوبت‌های من', () => {
  test.skip(!hasAuthState(), NEEDS_LOGIN);
  test.use({ storageState: hasAuthState() ? AUTH_STATE_PATH : undefined });

  test('لیستِ نوبت‌ها برای کاربرِ لاگین‌شده باز می‌شود', async ({ page }) => {
    await page.goto('/patient/appointments/', { waitUntil: 'domcontentloaded' });

    // نباید به لاگین برگردیم (یعنی session معتبر است).
    await expect(page).not.toHaveURL(/\/login/, { timeout: 30_000 });

    // صفحه باید یا نوبت نشان بدهد یا حالتِ «نوبتی ندارید» — هر دو رندرِ سالم‌اند؛
    // آن‌چه قبول نیست، صفحه‌ی سفید/اسکلتِ گیرکرده است.
    const hasContent = page.getByText(/نوبت/).first();
    await expect(hasContent).toBeVisible({ timeout: 45_000 });
  });
});
