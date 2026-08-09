import { expect, test } from '@playwright/test';
import { LISTING_TEMPLATES } from '../fixtures/test-data';

/**
 * گاردِ «این markup باید از سرور بیاید» (DR-08 §۱۸).
 *
 * چرا این تست وجود دارد: `dynamic(..., { ssr: false })` بی‌صدا یک عنصر را از HTMLِ سرور حذف می‌کند.
 * صفحه همچنان درست کار می‌کند و هیچ تستِ فانکشنالی قرمز نمی‌شود — فقط آن عنصر چند ثانیه دیرتر
 * پینت می‌شود. RUM نشان داد همین اتفاق برای بنرِ مشاوره افتاده بود و **خودِ آن عنصر** روی ۲۰٪ از
 * بازدیدهای موبایلِ `listing_specialty_city` عنصرِ LCP بود، با p75 `elementRenderDelay` = ۳.۸ ثانیه.
 * پس این کلاسِ عیب فقط با نگاه‌کردن به **HTMLِ خامِ سرور** دیده می‌شود، نه با DOMِ بعد از hydration.
 *
 * قاعده‌ی افزودن ردیف: هر عنصری که می‌تواند نامزدِ LCP باشد (متن/تصویرِ بزرگ در بالای صفحه) باید
 * این‌جا ردیف داشته باشد. اگر ردیفی قرمز شد یعنی کسی آن را به `ssr: false` (یا رندرِ client-only)
 * برگردانده — قبل از merge باید توجیه شود.
 *
 * ⚠️ عمداً `request` می‌گیرد نه `page`: هیچ JSای اجرا نمی‌شود، پس چیزی که این‌جا دیده می‌شود
 * دقیقاً همان چیزی است که مرورگرِ کاربر در اولین پینت دارد.
 */
const SSR_REQUIRED = [
  {
    name: 'بنرِ مشاوره (نامزدِ LCP روی لندینگِ تخصص+شهر)',
    path: LISTING_TEMPLATES.specialtyInCity,
    // کلاسِ ظرفِ بنر — به متنِ فارسی گره نمی‌زنیم چون متنِ بازاریابی ممکن است عوض شود.
    marker: 'space-s-2 px-3',
  },
  {
    name: 'کارت‌های نتیجه',
    path: LISTING_TEMPLATES.specialtyInCity,
    marker: 'PlasmicProductCard',
  },
];

test.describe('SSR — markupهایی که باید در HTMLِ سرور باشند', () => {
  for (const item of SSR_REQUIRED) {
    test(item.name, async ({ request, baseURL }) => {
      const res = await request.get(new URL(item.path, baseURL).toString(), {
        headers: {
          // موبایل، چون بنر `md:hidden` است و فقط سناریوی موبایل اهمیت دارد.
          'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        },
      });
      expect(res.status()).toBe(200);
      const html = await res.text();
      // فقط بدنه — نه `__NEXT_DATA__`، وگرنه صرفِ وجودِ داده در JSON تست را سبز می‌کند.
      const body = html.split('<script id="__NEXT_DATA__"')[0];
      expect(body, `«${item.marker}» در HTMLِ سرور نیست ⇒ این عنصر client-only شده است`).toContain(item.marker);
    });
  }

  /**
   * گاردِ «assetهایِ same-originِ ارجاع‌شده در SSR باید واقعاً 200 بدهند» (DR-08).
   *
   * چرا: markup می‌تواند سرِ جایش باشد ولی خودِ فایل 404 بدهد و هیچ تستی قرمز نشود — دقیقاً همان
   * اتفاقی که برای تصویرِ بنرِ مشاوره افتاد: `/images/search/doctor-group.webp` در public/ بود ولی
   * مسیرِ `/images/*` روی www اصلاً به این اپ نمی‌رسد (یک originِ قدیمی 404یِ ۱.۳MB می‌دهد) و
   * تصویر یک روزِ کامل روی production شکسته بود. این تست کلاسِ عیب را می‌بندد: هر `<img src="/…">`ِ
   * نسبی در HTMLِ سرور باید همین‌جا fetch شود و 200 + content-type تصویری بدهد.
   * (فقط same-origin — هاست‌های دیگر مثل cdn مسئولیتِ این repo نیستند.)
   */
  test('همه‌ی <img>هایِ same-originِ HTMLِ سرور باید 200 بدهند', async ({ request, baseURL }) => {
    const res = await request.get(new URL(LISTING_TEMPLATES.specialtyInCity, baseURL).toString(), {
      headers: {
        'user-agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      },
    });
    expect(res.status()).toBe(200);
    const body = (await res.text()).split('<script id="__NEXT_DATA__"')[0];
    const srcs = [...body.matchAll(/<img[^>]+src="(\/[^"]+)"/g)].map(m => m[1]);
    const unique = [...new Set(srcs)];
    expect(unique.length, 'هیچ imgِ same-originی در SSR پیدا نشد — خودِ تست مشکوک است').toBeGreaterThan(0);

    for (const src of unique) {
      const asset = await request.get(new URL(src, baseURL).toString());
      expect(asset.status(), `assetِ ارجاع‌شده در SSR شکسته است: ${src}`).toBe(200);
      const type = asset.headers()['content-type'] ?? '';
      expect(type.startsWith('image/'), `content-typeِ غیرتصویری برای ${src}: «${type}»`).toBe(true);
    }
  });
});
