import { expect, type Locator, type Page } from '@playwright/test';

/** صفحه‌ی پروفایلِ پزشک (`/dr/<slug>/`). */
export class DoctorProfilePage {
  readonly page: Page;
  readonly name: Locator;
  readonly bookingButton: Locator;
  readonly reviewsHeading: Locator;
  readonly scheduleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('h1').first();
    // متنِ دکمه ممکن است «دریافت نوبت»/«دریافت نوبت آنلاین» باشد ⇒ regex نه تساویِ دقیق.
    this.bookingButton = page.getByRole('button', { name: /دریافت نوبت/ }).first();
    // ⚠️ درسِ اجرای واقعی: تب‌های «نظرات» و «آدرس و تلفن» فقط در لِی‌اوتِ **موبایل** visible‌اند؛
    // روی دسکتاپ در DOM هستند ولی نامرئی. پس assertِ حیاتی روی چیزهایی بسته می‌شود که در هر دو
    // لِی‌اوت دیده می‌شوند: نام، دکمه‌ی نوبت، برنامه‌ی کاری، و عنوانِ بخشِ نظرات.
    this.reviewsHeading = page.getByText(/نظرات درمورد/).first();
    this.scheduleButton = page.getByRole('button', { name: /برنامه کاری/ }).first();
  }

  async goto(href: string) {
    await this.page.goto(href, { waitUntil: 'domcontentloaded' });
  }

  /**
   * «صفحه درست رندر شده» یعنی اجزای حیاتی حاضرند — نه صرفاً status 200.
   * این دقیقاً همان چیزی است که یک خطای hydration می‌شکند: HTML می‌آید ولی تعامل نمی‌چسبد.
   */
  async expectRendered() {
    await expect(this.name).toBeVisible();
    await expect(this.name).not.toHaveText('');
    await expect(this.bookingButton).toBeVisible();
    await expect(this.scheduleButton).toBeVisible();
  }

  /**
   * همان بررسیِ بالا، ولی بدونِ throw — برای حلقه‌زدن روی چند پزشک.
   *
   * ⚠️ درسِ اجرای واقعی: «برنامه کاری» و بخشِ نظرات **داده-وابسته‌اند** (هر پزشکی برنامه/نظر
   * ندارد). assert کردنشان روی «اولین پزشکِ نتایج» تستی می‌سازد که با عوض‌شدنِ نتایج به‌دروغ
   * قرمز می‌شود. invariantِ درست: «این صفحه برای **حداقل یک** پزشکِ واقعی کامل رندر می‌شود».
   */
  async isFullyRendered(): Promise<boolean> {
    // ⚠️ `isVisible()` لحظه‌ای است و انتظار نمی‌کشد؛ بخشِ نظرات سمتِ کلاینت می‌آید، پس باید
    // صریح `waitFor` بزنیم وگرنه همیشه false می‌گیریم.
    const visible = async (locator: Locator, timeout: number) => {
      try {
        await locator.waitFor({ state: 'visible', timeout });
        return true;
      } catch {
        return false;
      }
    };
    if (!(await visible(this.name, 20_000))) return false;
    if (!(await visible(this.bookingButton, 20_000))) return false;
    if (!(await visible(this.scheduleButton, 15_000))) return false;
    return visible(this.reviewsHeading, 20_000);
  }

  /** بخشِ نظرات باید محتوا داشته باشد (عنوانِ «نظرات درمورد …»). */
  async expectReviewsSection() {
    await expect(this.reviewsHeading).toBeVisible({ timeout: 30_000 });
  }

  /**
   * گاردِ واقعیِ hydration: دکمه فقط «دیده‌شدن» کافی نیست، باید **کار کند**.
   * کلیک باید ما را به فلوی نوبت‌دهی ببرد.
   */
  async openBookingFlow() {
    await this.bookingButton.click();
    await this.page.waitForURL(/\/booking\//, { timeout: 45_000 });
  }
}
