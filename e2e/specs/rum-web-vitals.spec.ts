import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { SearchPage } from '../pages/search.page';

/**
 * گاردِ RUM (DR-08 §۱۷) — آیا متریک‌های CWV واقعاً از مرورگر به Splunk **فرستاده می‌شوند**؟
 *
 * این تست به Splunk کوئری نمی‌زند (آن را دستی/در سند انجام می‌دهیم)؛ کارِ ارزشمندترش این است که
 * **درخواستِ خروجی** را در مرورگر رصد می‌کند. سه چیز را تضمین می‌کند:
 *   ۱. روی صفحه‌ی جستجو حداقل یک متریک ارسال می‌شود،
 *   ۲. روی صفحه‌ی پروفایلِ پزشک **هیچ‌چیز** ارسال نمی‌شود (شرطِ owner)،
 *   ۳. payload هیچ query string / URL کاملی ندارد (گاردِ حریمِ خصوصی — متنِ جستجو دادهٔ سلامت است).
 *
 * ⚠️ `reportWebVitals` فقط وقتی فعال است که `IS_PRODUCTION` باشد ⇒ این تست فقط علیهِ buildِ
 * production معنا دارد (لوکالِ `NODE_ENV=production next start` یا خودِ production).
 */
const HEC_PATH = /\/services\/collector/;

test.describe('RUM — ارسالِ Core Web Vitals', () => {
  test('صفحه‌ی جستجو متریک می‌فرستد و payload تمیز است', async ({ page }) => {
    test.setTimeout(120_000);
    const posted: any[] = [];
    page.on('request', req => {
      if (req.method() === 'POST' && HEC_PATH.test(req.url())) {
        try {
          posted.push(JSON.parse(req.postData() ?? '{}'));
        } catch {
          /* ignore */
        }
      }
    });

    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    // متریک‌ها تدریجی می‌آیند؛ CLS/INP تا لحظه‌ی hidden شدن هم ادامه دارند.
    await page.waitForTimeout(8000);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(4000);

    // LCP/CLS/INP را کتابخانه‌ی web-vitals هنگامِ **مخفی‌شدنِ صفحه** گزارش می‌کند، نه در وسطِ
    // بازدید. پس برای دیدنشان باید صفحه را مخفی/ترک کنیم — وگرنه تست به‌غلط نتیجه می‌گیرد که
    // «فقط FCP و TTFB می‌آید» و مهم‌ترین متریک‌ها بی‌سروصدا جا می‌مانند.
    await page.evaluate(() => document.body.click());
    await page.waitForTimeout(500);
    await page.goto('about:blank');
    await page.waitForTimeout(2500);

    const vitals = posted.filter(p => p?.event?.event_type === 'web_vital');
    expect(vitals.length, 'هیچ متریکِ CWVای ارسال نشد').toBeGreaterThan(0);

    const names = [...new Set(vitals.map(v => v.event.metric))];
    // حداقل یکی از متریک‌های «کیفیتِ تجربه» باید برسد، نه فقط متریک‌های شبکه/رنگِ اول.
    expect(names.some(n => ['LCP', 'CLS', 'INP'].includes(n)), `فقط ${names.join(',')} رسید`).toBe(true);
    // eslint-disable-next-line no-console
    console.log(`RUM sent ${vitals.length} metric(s): ${names.join(', ')}`);

    for (const v of vitals) {
      expect(v.event.event_group).toBe('web_vitals_search');
      expect(v.event.page_template).toBe('listing_specialty_city');
      const serialized = JSON.stringify(v.event);
      expect(serialized, 'payload نباید URL/کوئری داشته باشد').not.toContain('http');
      expect(serialized).not.toContain('text=');
    }
  });

  test('صفحه‌ی پروفایلِ پزشک هیچ متریکی نمی‌فرستد', async ({ page }) => {
    test.setTimeout(120_000);
    const posted: any[] = [];
    page.on('request', req => {
      if (req.method() === 'POST' && HEC_PATH.test(req.url())) {
        try {
          posted.push(JSON.parse(req.postData() ?? '{}'));
        } catch {
          /* ignore */
        }
      }
    });

    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();
    const href = await search.firstDoctorHref();

    posted.length = 0; // فقط آنچه بعد از ورود به پروفایل فرستاده می‌شود مهم است
    await page.goto(href, { waitUntil: 'load' });
    await page.waitForTimeout(9000);

    const vitals = posted.filter(p => p?.event?.event_type === 'web_vital');
    expect(vitals, `پروفایل نباید متریک بفرستد ولی ${vitals.length} مورد فرستاد`).toHaveLength(0);
  });
});
