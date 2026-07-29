import { expect, type Locator, type Page } from '@playwright/test';
import { MIN_RESULTS } from '../fixtures/test-data';

/**
 * صفحه‌ی نتایجِ جستجو (`/s/**`).
 *
 * ⚠️ نکته‌ی مهمِ این کدبیس: **هیچ `data-testid`ای در اپ وجود ندارد** (بررسی شد، صفر مورد). پس
 * سلکتورها عمداً «معنایی» انتخاب شده‌اند — نقشِ عنصر، متنِ کاربر-دیدنی، و الگوی `href` — نه
 * کلاسِ CSS. کلاس‌ها را Plasmic/Tailwind تولید می‌کنند و با هر ری‌بیلد عوض می‌شوند؛ سلکتورِ
 * کلاس‌محور یعنی تستی که فردا بی‌دلیل قرمز می‌شود.
 * (بهبودِ پایدارِ بعدی: افزودنِ `data-testid` به عناصرِ بحرانی — در e2e/README.md ثبت شده.)
 */
export class SearchPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly doctorCards: Locator;

  constructor(page: Page) {
    this.page = page;
    // ⚠️ درسِ اجرای واقعی: بعضی صفحات **دو** `input[name=searchInput]` دارند (یکی مخصوصِ لِی‌اوتِ
    // دیگر که hidden است). `.first()` خام روی موبایل به نمونه‌ی نامرئی می‌خورد و تست بی‌دلیل
    // تایم‌اوت می‌شود. فیلترِ `:visible` این را layout-agnostic می‌کند.
    this.searchInput = page.locator('input[name="searchInput"]:visible').first();
    // هر کارتِ نتیجه یک لینک به پروفایلِ پزشک دارد؛ همین پایدارترین امضای «کارت» است.
    this.doctorCards = page.locator('a[href*="/dr/"]');
  }

  async gotoListing(pathname: string) {
    await this.page.goto(pathname, { waitUntil: 'domcontentloaded' });
  }

  /**
   * جستجو از خودِ نوارِ سرچ (مسیرِ تعاملیِ کاربر، نه فقط لندینگِ SSR).
   *
   * ⚠️ درسِ اجرای واقعی: `waitForURL(/\/s\//)` به‌تنهایی **گاردِ معتبری نیست** اگر از خودِ یک صفحه‌ی
   * `/s/*` شروع کرده باشیم — الگو از همان اول match است و انتظار بی‌درنگ برمی‌گردد، پس تست
   * گاهی سبز و گاهی (وقتی رندرِ نتایج عقب بیفتد) قرمز می‌شود؛ یعنی flaky. این‌جا صریحاً منتظرِ
   * **تغییرِ** URL می‌مانیم، نه صرفاً match شدنش.
   */
  async searchFor(term: string) {
    const before = this.page.url();
    await this.searchInput.click();
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
    await this.page.waitForURL(url => url.href !== before && /\/s\//.test(url.href), {
      timeout: 30_000,
    });
  }

  /** «صفحه‌ی نتایج سالم است» = حداقل چند کارتِ واقعی رندر شده. */
  async expectHealthyResults() {
    await expect(this.doctorCards.first()).toBeVisible({ timeout: 30_000 });
    const count = await this.uniqueDoctorLinks();
    expect(count.length, `تعدادِ نتایجِ یکتا کمتر از ${MIN_RESULTS} است`).toBeGreaterThanOrEqual(MIN_RESULTS);
  }

  /** هر کارت چند لینک به یک پزشک دارد (عکس/نام/دکمه) ⇒ یکتاسازی لازم است. */
  async uniqueDoctorLinks(): Promise<string[]> {
    const hrefs = await this.doctorCards.evaluateAll(nodes =>
      nodes.map(n => (n as HTMLAnchorElement).getAttribute('href') ?? ''),
    );
    return [...new Set(hrefs.filter(h => h.includes('/dr/')))];
  }

  /** پزشکِ اولِ زنده — تست‌ها هرگز به یک پزشکِ هاردکدشده گره نمی‌خورند. */
  async firstDoctorHref(): Promise<string> {
    const links = await this.uniqueDoctorLinks();
    expect(links.length, 'هیچ لینکِ پزشکی در نتایج نبود').toBeGreaterThan(0);
    return links[0];
  }
}
