import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES } from '../fixtures/test-data';

/**
 * گاردِ **ابزارسنجی** کارتِ نتیجه (DR-08 §۲۷.۳).
 *
 * چرا این تست از همه‌ی گاردهای دیگرِ کارت مهم‌تر است: اگر بازنویسیِ کارت رویدادِ
 * `search_click_position` را بشکند، **هیچ نشانه‌ی بصری یا فانکشنالی وجود ندارد** — صفحه درست
 * دیده می‌شود، کلیک درست کار می‌کند، کاربر چیزی حس نمی‌کند، و تنها اثرش این است که قیفِ
 * «سرچ → نوبت» و کلِ سنجشِ رتبه‌بندی بی‌صدا کور می‌شود. این کلاسِ عیب هفته‌ها بعد و از روی افتِ
 * نمودار کشف می‌شود، نه از روی کد یا screenshot.
 *
 * مکانیزم: رویدادها از `src/common/services/splunk.ts` با POST به مسیرِ `services/collector`
 * (تکی) یا همان مسیر + `/event` (batch) می‌روند. اندازه‌گیری‌شده روی production: **هر دو** مسیر
 * واقعاً استفاده می‌شوند، پس الگوی route باید در هر دو طرف wildcard داشته باشد.
 *
 * ⚠️ درخواست را جلو نمی‌فرستیم و خودمان `fulfill` می‌کنیم: رویدادِ تستی نباید واردِ ایندکسِ
 * واقعیِ Splunk شود — وگرنه همان KPIای را آلوده می‌کنیم که می‌خواهیم از آن محافظت کنیم.
 *
 * 🔎 نکته‌ای که با probe روی production کشف شد و بدونِ آن این تست قرمزِ کاذب می‌دهد: رویداد فقط
 * با کلیک روی **دکمه‌ی اقدام** («نوبت‌دهی») فرستاده می‌شود. کلیک روی خودِ کارت، عکسِ پزشک، یا
 * لینکِ نام **هیچ رویدادی نمی‌فرستد** (هر چهار حالت probe شد؛ نمونه‌ی واقعیِ Splunk هم
 * `elementName: "action-button"` دارد). پس معیارِ این گارد همان دکمه است.
 */

/** حداقلِ فیلدهای سطحِ اولِ رویداد — از نمونه‌ی واقعیِ ایندکسِ `p24_search_events_b` استخراج شد. */
const REQUIRED_TOP_FIELDS = ['event_group', 'event_type', 'url', 'query_id', 'terminal_id', 'card_data'];
/** فیلدهای داخلِ `card_data` — بدونِ این‌ها رویداد برای تحلیلِ رتبه/CTR بی‌ارزش است. */
const REQUIRED_CARD_FIELDS = ['_id', 'position', 'title', 'type'];

type Captured = { event_type?: string; card_data?: Record<string, unknown>; [k: string]: unknown };

test('کلیک روی دکمه‌ی نوبت‌دهیِ کارت باید رویدادِ search_click_position را با فیلدهای لازم بفرستد', async ({ page }) => {
  const captured: Captured[] = [];

  await page.route('**/services/collector**', async route => {
    const raw = route.request().postData() ?? '';
    // بدنه می‌تواند یک آبجکت یا آرایه‌ای از رویدادها باشد؛ به‌جای parseِ شکننده‌ی کلِ بدنه، هر
    // بلوکِ `"event": {…}` جدا برداشته می‌شود.
    for (const m of raw.matchAll(/"event"\s*:\s*(\{[\s\S]*?\})\s*\}/g)) {
      try {
        captured.push(JSON.parse(m[1]) as Captured);
      } catch {
        /* بدنه‌ی غیرقابلِ parse نادیده گرفته می‌شود — قضاوت بر اساسِ رویدادهای معتبر است. */
      }
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"text":"Success","code":0}' });
  });

  await page.goto(LISTING_TEMPLATES.specialtyInCity, { waitUntil: 'domcontentloaded' });

  const actionButton = page.getByText(/نوبت‌دهی|نوبت دهی/).first();
  await expect(actionButton, 'دکمه‌ی «نوبت‌دهی» در هیچ کارتی پیدا نشد').toBeVisible({ timeout: 30_000 });
  await actionButton.click({ noWaitAfter: true });

  await expect
    .poll(() => captured.some(e => e.event_type === 'search_click_position'), {
      message: 'بعد از کلیک روی دکمه‌ی نوبت‌دهی، رویدادِ `search_click_position` فرستاده نشد — ابزارسنجیِ قیفِ سرچ کور شده است',
      timeout: 15_000,
    })
    .toBe(true);

  const click = captured.find(e => e.event_type === 'search_click_position')!;
  for (const field of REQUIRED_TOP_FIELDS) {
    expect(click[field], `فیلدِ «${field}» در رویدادِ search_click_position نیست ⇒ رویداد برای تحلیل بی‌ارزش است`).toBeDefined();
  }
  for (const field of REQUIRED_CARD_FIELDS) {
    expect(click.card_data?.[field], `فیلدِ «card_data.${field}» نیست ⇒ سنجشِ رتبه/CTR به آن بند است`).toBeDefined();
  }
  expect(Number(click.card_data?.position), '`card_data.position` عددی نیست — کلِ سنجشِ رتبه‌بندی به همین فیلد بند است').not.toBeNaN();
});
