import { expect, type Locator, type Page } from '@playwright/test';

/**
 * فلوی نوبت‌دهی (`/booking/<slug>/?centerId=…&serviceId=…`).
 *
 * مراحلِ واقعیِ مشاهده‌شده روی production: «انتخاب زمان نوبت» (زودترین زمانِ خالی + گزینه‌ی
 * «انتخاب زمان دیگر») → «ادامه» → [لاگین اگر لاگین نیستی] → انتخاب بیمار → تأیید نهایی → قبض.
 * نگاشتِ این مراحل به رویدادهای Splunk در ghane/docs/infrastructure-maneuver/analytics-events-map.md.
 */
export class BookingPage {
  readonly page: Page;
  readonly timeSection: Locator;
  readonly earliestSlot: Locator;
  readonly anotherTimeButton: Locator;
  readonly continueButton: Locator;
  readonly loginPrompt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.timeSection = page.getByText(/انتخاب زمان نوبت/).first();
    this.earliestSlot = page.getByText(/زودترین زمان نوبت خالی/).first();
    this.anotherTimeButton = page.getByRole('button', { name: /انتخاب زمان دیگر/ }).first();
    this.continueButton = page.getByRole('button', { name: /^ادامه$/ }).first();
    this.loginPrompt = page.getByRole('button', { name: /ورود|ثبت‌نام/ }).first();
  }

  /** صفحه‌ی انتخابِ زمان باید با یک زمانِ خالیِ واقعی رندر شده باشد. */
  async expectTimeStep() {
    await expect(this.timeSection).toBeVisible({ timeout: 45_000 });
    await expect(this.earliestSlot).toBeVisible();
    await expect(this.continueButton).toBeEnabled();
  }

  /** متنِ زمانِ پیشنهادی — برای assertکردنِ این‌که همان زمان تا انتها حمل می‌شود. */
  async earliestSlotText(): Promise<string> {
    return (await this.earliestSlot.innerText()).replace(/\s+/g, ' ').trim();
  }

  async continue() {
    await this.continueButton.click();
  }

  /**
   * مرحله‌ی بعدِ «ادامه» به وضعیتِ لاگین بستگی دارد:
   *  - بدونِ لاگین ⇒ باید به لاگین/OTP هدایت شویم (خودِ این یک assertِ معتبر است).
   *  - با لاگین ⇒ باید به انتخابِ بیمار/تأیید برسیم.
   */
  async expectLoginWall() {
    await expect(
      this.page.getByText(/کد|شماره موبایل|ورود/).first(),
      'بعد از «ادامه» بدونِ لاگین، انتظارِ صفحه‌ی ورود داشتیم',
    ).toBeVisible({ timeout: 45_000 });
  }
}
