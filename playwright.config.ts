import { defineConfig, devices } from '@playwright/test';

/**
 * هارنسِ E2E + Visual Regression — پذیرش۲۴ (patient)
 *
 * چرا Playwright و نه Cypress+Percy/BackstopJS: هر سه نیازِ صورت‌مسئله (E2E روی فلوهای بحرانی،
 * مقایسه‌ی بصری، و اجرای local-first بدونِ سرویسِ ابریِ پولی) با **یک** ابزار پوشش داده می‌شود —
 * `toHaveScreenshot()` خودش visual-regressionِ pixel-diff دارد، پس نه اکانتِ Percy لازم است نه
 * یک پایپ‌لاینِ دومِ BackstopJS. کمترین قطعه‌ی متحرک = کمترین چیزی که بعداً بشکند.
 *
 * راهنمای کامل: e2e/README.md
 */

const baseURL = process.env.E2E_BASE_URL ?? 'https://www.paziresh24.com';

/**
 * چرا `channel: 'chrome'` (یعنی Chromeِ نصب‌شده‌ی سیستم) و نه Chromiumِ همراهِ Playwright:
 * دانلودِ باینریِ Chromium از `playwright.azureedge.net` از داخلِ ایران انجام نمی‌شود (تست شد،
 * قطع می‌شود). با این تنظیم هیچ دانلودی لازم نیست و تست‌ها روی همان Chromeِ لپ‌تاپ اجرا می‌شوند.
 * اگر روی ماشینی بودی که `npx playwright install chromium` جواب می‌دهد، می‌توانی این خط را
 * بردار — بقیه‌ی هارنس تغییری نمی‌کند.
 */
// در CI (imageِ رسمیِ Playwright) اصلاً Chromeِ برندشده نصب نیست و فقط chromiumِ همراهِ
// Playwright هست. آن‌جا `E2E_BROWSER_CHANNEL=` (خالی) ست می‌شود؛ پس رشته‌ی خالی باید به
// `undefined` تبدیل شود، نه این‌که به‌عنوانِ نامِ channel پاس داده شود (`??` این را نمی‌گیرد).
const CHANNEL = process.env.E2E_BROWSER_CHANNEL === undefined ? 'chrome' : process.env.E2E_BROWSER_CHANNEL || undefined;

/**
 * روی هدفِ **غیر-production** (لوکال/استیجینگ) اسکریپت‌های third-party بلاک می‌شوند.
 *
 * چرا (یافته‌ی اندازه‌گیری‌شده 2026-07-30): همان تست‌هایی که علیه production سبزند، علیه یک
 * buildِ لوکال قرمز می‌شدند — علتش کد نبود: اسکریپت‌های تحلیلی روی localhost با ۴۰۰/۵۰۳ برمی‌گردند
 * و یک `ReferenceError: referrer is not defined` پرتاب می‌کنند که **hydration را نصفه می‌گذارد**؛
 * نتیجه‌اش صفحه‌ای است که HTMLش هست ولی دکمه‌هایش رولِ درست نمی‌گیرند. کنترلِ اثبات‌کننده: با
 * بلاک‌کردنِ همین دامنه‌ها، همان تست روی همان build سبز شد.
 * پس این بلاک «پنهان‌کردنِ باگ» نیست؛ حذفِ نویزِ محیطی است تا تست دربارهٔ **کدِ ما** قضاوت کند.
 */
export const THIRD_PARTY_BLOCKLIST = [
  '**googletagmanager.com/**',
  '**clarity.ms/**',
  '**najva.com/**',
  '**google-analytics.com/**',
  '**doubleclick.net/**',
  '**yektanet.com/**',
];

export default defineConfig({
  testDir: './e2e/specs',
  // فلوهای بوکینگ چند مرحله‌ی شبکه‌ای دارند و روی محیطِ واقعی کند می‌شوند.
  timeout: 90_000,
  expect: {
    timeout: 15_000,
    toHaveScreenshot: {
      // آستانه‌ی تفاوت: کمی تلورانس برای anti-aliasing فونتِ فارسی روی OSهای مختلف،
      // ولی به‌قدری تنگ که جابه‌جاییِ واقعیِ layout (همان چیزی که CLS است) رد نشود.
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  // local-first، و مهم‌تر: این تست‌ها علیهِ **production زنده** اجرا می‌شوند. با ۳ worker × ۲
  // پروژه، درخواست‌های هم‌زمان باعثِ تایم‌اوتِ تصادفی می‌شد (هر تستِ شکست‌خورده به‌تنهایی سبز
  // بود) — یعنی نویزِ محیط، نه باگِ محصول. ۲ worker + یک retry این نویز را می‌گیرد بدونِ این‌که
  // شکستِ واقعی را پنهان کند (تستِ retry-شده در گزارش «flaky» علامت می‌خورد و باید بررسی شود).
  workers: 2,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: [['list'], ['html', { outputFolder: 'e2e/.report', open: 'never' }]],
  use: {
    baseURL,
    locale: 'fa-IR',
    timezoneId: 'Asia/Tehran',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
  },
  projects: [
    {
      // فقط با `npm run e2e:login` اجرا می‌شود؛ در اجرای عادی چون testDir جداست وارد نمی‌شود.
      name: 'login',
      testDir: './e2e/login',
      use: { ...devices['Desktop Chrome'], channel: CHANNEL, headless: false },
    },
    {
      name: 'mobile',
      // موبایل اولویتِ اولِ سنجش است: طبقِ CrUX، مشکلِ CWV تقریباً کاملاً موبایلی است
      // (ghane/docs/dev-requests/dr-08-listing-pagespeed.md §۲).
      use: { ...devices['Pixel 7'], channel: CHANNEL },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], channel: CHANNEL, viewport: { width: 1280, height: 900 } },
    },
  ],
});
