import { expect, test } from '../support/fixtures';
import { LISTING_TEMPLATES } from '../fixtures/test-data';
import { SearchPage } from '../pages/search.page';

/**
 * گاردِ محتوایِ کارتِ نتیجه — قبل از جایگزینیِ `PlasmicProductCard` (۱۰۷ نودِ DOM، ۸۷٪ از DOMِ
 * صفحه) با یک کامپوننتِ سبکِ دستی.
 *
 * چرا این فایل: تستِ `search.spec.ts` فقط «حداقل ۵ کارتِ یکتا رندر شد» را چک می‌کند — کافی نیست،
 * چون کامپوننتِ جدید می‌تواند همان تعداد کارت را رندر کند در حالی که آواتار/نام/لینکِ داخلِ هر
 * کارت بی‌صدا حذف شده باشد (مثلاً `alt` یا `href` خالی، یا imgِ بدونِ اندازه). این‌جا **شکلِ**
 * محتوایِ هر کارت را چک می‌کنیم، نه محتوایِ دقیقش.
 *
 * ⛔ قیدِ طراحیِ حیاتی: این تست علیهِ **دیتای زنده‌ی production** اجرا می‌شود که هر روز عوض می‌شود
 * (پزشکِ فعال/غیرفعال، قیمت، امتیاز). پس هرگز روی نامِ پزشکِ خاص/قیمتِ خاص/متنِ خاص assert
 * نمی‌کنیم — فقط روی «شکل» (لینک هست، src غیرخالی است، ابعاد غیرصفر است، متنِ نام خالی نیست).
 *
 * ⛔ سلکتور عمداً بدونِ کلاسِ Plasmic: چون خودِ همین class name (`PlasmicProductCard_*`) قرار است
 * با رفکتور از بین برود، اگر تست به آن گره بخورد، بعد از رفکتور بی‌معنی می‌شود (نه سبز از رگرسیون،
 * فقط چون سلکتور دیگر مچ نمی‌شود). به‌جایش «کارت» را در runtime کشف می‌کنیم: هر گروه از
 * `<a href*="/dr/">` که href یکسان دارند (آواتار/نام/دکمه هرکدام لینکِ خودشان را دارند —
 * ر.ک. `search.page.ts`) یک کارت است؛ نزدیک‌ترین اجدادِ مشترکِ آن گروه = مرزِ کارت. این روش قبل
 * و بعدِ رفکتور یکسان کار می‌کند چون فقط به وجودِ «چند لینکِ هم‌href» متکی است، نه به کلاسِ CSS.
 */
const CARD_COUNT_TO_CHECK = 5;
const MIN_TOTAL_CARDS = 10;

/** هر گروهِ لینکِ هم-href را با یک attributeِ موقتِ تست تگ می‌کند تا با Locator قابلِ آدرس‌دهی شود. */
async function tagCards(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const anchors = [...document.querySelectorAll<HTMLAnchorElement>('a[href*="/dr/"]')];
    const byHref = new Map<string, HTMLAnchorElement[]>();
    for (const a of anchors) {
      const href = a.getAttribute('href') ?? '';
      if (!href) continue;
      if (!byHref.has(href)) byHref.set(href, []);
      byHref.get(href)!.push(a);
    }
    let index = 0;
    for (const list of byHref.values()) {
      // نزدیک‌ترین اجدادِ مشترکِ همه‌ی anchorهای یک doctor href = مرزِ کارت.
      let ancestor: Element | null = list[0];
      while (ancestor && !list.every(a => ancestor!.contains(a))) {
        ancestor = ancestor.parentElement;
      }
      if (ancestor) ancestor.setAttribute('data-e2e-card', String(index));
      index += 1;
    }
    return index;
  });
}

test.describe('محتوایِ کارتِ نتیجه (گاردِ قبل از رفکتورِ PlasmicProductCard)', () => {
  test('هر کارت لینکِ پروفایل، آواتارِ سالم، و نامِ غیرخالی دارد', async ({ page }) => {
    const search = new SearchPage(page);
    await search.gotoListing(LISTING_TEMPLATES.specialtyInCity);
    await search.expectHealthyResults();

    const totalCards = await tagCards(page);
    // با MIN_RESULTS=۵ در search.spec.ts هم‌پوشانی دارد؛ این‌جا آستانه‌ی سخت‌گیرانه‌تر (۱۰) برای
    // اطمینان از این‌که «صفحه‌ی نتایجِ واقعی» است، نه یک حالتِ لبه با نتایجِ کم.
    expect(totalCards, `تعدادِ کارت‌های تگ‌شده کمتر از ${MIN_TOTAL_CARDS} است`).toBeGreaterThanOrEqual(
      MIN_TOTAL_CARDS,
    );

    const cards = page.locator('[data-e2e-card]');
    const n = Math.min(CARD_COUNT_TO_CHECK, totalCards);

    let priceCount = 0;
    let ratingCount = 0;

    for (let i = 0; i < n; i++) {
      const card = cards.nth(i);

      // ۱) لینکِ پروفایل با href غیرخالی — اگر رفکتور لینک را حذف کند یا href را خالی بگذارد،
      //    کاربر دیگر نمی‌تواند از نتایج به پروفایل برود.
      const link = card.locator('a[href*="/dr/"]').first();
      await expect(link, `کارتِ #${i}: لینکِ پروفایل پیدا نشد`).toHaveCount(1, { timeout: 15_000 }).catch(() => {});
      const href = await link.getAttribute('href');
      expect(href, `کارتِ #${i}: href لینکِ پروفایل خالی/نامعتبر است`).toBeTruthy();

      // ۲) آواتارِ سالم — src غیرخالی و ابعادِ واقعیِ بارگذاری‌شده (نه ۰x۰ که یعنی تصویر نشکسته
      //    ولی اصلاً decode نشده / منبعش 404 است).
      const avatar = card.locator('img').first();
      await expect(avatar, `کارتِ #${i}: تگِ <img> آواتار پیدا نشد`).toBeVisible({ timeout: 15_000 });
      const src = await avatar.getAttribute('src');
      expect(src, `کارتِ #${i}: src آواتار خالی است`).toBeTruthy();
      const dims = await avatar.evaluate((img: HTMLImageElement) => ({
        w: img.naturalWidth,
        h: img.naturalHeight,
      }));
      expect(dims.w, `کارتِ #${i}: آواتار عرضِ واقعیِ صفر دارد (احتمالاً تصویر لود نشده/۴۰۴)`).toBeGreaterThan(0);
      expect(dims.h, `کارتِ #${i}: آواتار ارتفاعِ واقعیِ صفر دارد (احتمالاً تصویر لود نشده/۴۰۴)`).toBeGreaterThan(0);

      // ۳) نامِ پزشک — یک عنصرِ heading با متنِ غیرخالی. به متنِ دقیق گره نمی‌زنیم چون هر روز عوض
      //    می‌شود؛ فقط «هست و خالی نیست» را چک می‌کنیم.
      const heading = card.locator('h1, h2, h3, h4, h5, h6').first();
      await expect(heading, `کارتِ #${i}: هیچ headingِ نامی پیدا نشد`).toBeVisible({ timeout: 15_000 });
      const nameText = (await heading.textContent())?.trim() ?? '';
      expect(nameText.length, `کارتِ #${i}: متنِ نام خالی است`).toBeGreaterThan(0);

      // فیلدهایِ اختیاری — طبقِ دیتای واقعی، همه‌ی پزشکان قیمتِ ویزیتِ آنلاین یا امتیاز/نظر ندارند
      // (پزشکِ تازه‌ثبت‌شده بدونِ نظر، یا کسی که ویزیتِ آنلاین ندارد). پس روی «همه‌ی ۵ کارت» شرط
      // نمی‌بندیم؛ فقط «حداقل بخشی از ۵ کارت» را چک می‌کنیم — این‌طوری اگر رفکتور این فیلد را از
      // *همه‌ی* کارت‌ها حذف کند قرمز می‌شویم، ولی غیابِ گاه‌به‌گاهِ طبیعی تست را خراب نمی‌کند.
      const cardText = (await card.textContent()) ?? '';
      if (/تومان/.test(cardText)) priceCount += 1;
      if (/\d(\.\d)?\s*\(\s*\d+\s*نظر\)/.test(cardText)) ratingCount += 1;
    }

    expect(
      priceCount,
      `از ${n} کارتِ بررسی‌شده، هیچ‌کدام قیمتِ ویزیت نداشت — اگر این فیلد در همه جا حذف شده باشد رگرسیون است`,
    ).toBeGreaterThan(0);
    expect(
      ratingCount,
      `از ${n} کارتِ بررسی‌شده، هیچ‌کدام امتیاز/نظر نداشت — اگر این فیلد در همه جا حذف شده باشد رگرسیون است`,
    ).toBeGreaterThan(0);
  });
});
