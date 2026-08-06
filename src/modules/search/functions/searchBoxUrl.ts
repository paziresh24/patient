/**
 * ساختِ URLِ ناوبریِ **کادرِ جستجو** — تک‌منبعِ حقیقت.
 *
 * چرا این فایل وجود دارد: همین URL تا قبل از DR-30 در **پنج جای مختلف** به‌صورتِ template string
 * داخلِ کامپوننت‌های تولیدشده‌ی Plasmic تکرار شده بود. نتیجه‌اش این شد که یک query paramِ مرده
 * (`semantic_search`) سال‌ها در URLِ همه‌ی بیماران ماند و هیچ تستی جلویش را نگرفت، چون منطقی که
 * بشود تست کرد اصلاً وجود نداشت.
 *
 * حالا منطق این‌جاست و تست دارد؛ کامپوننت‌ها فقط صدایش می‌زنند.
 *
 * ⚠️ چیزی که عمداً **تغییر نکرد:** متنِ کوئری مثلِ قبل خام درج می‌شود (encode نمی‌شود). این رفتار
 * از قبل همین بوده و رویدادهای آنالیتیکس (`url.qurey.text`) روی همین شکل تنظیم شده‌اند؛ عوض‌کردنش
 * یک تغییرِ رفتاریِ جدا است، نه بخشی از DR-30.
 */

/** مقدارِ `ref` برای کادرِ جستجوی معمولی. */
export const SEARCH_BOX_REF = 'search_suggestion_box';

/** مقدارِ `ref` برای مسیرِ ساجستشنِ QS. */
export const SEARCH_BOX_QS_REF = 'search_suggestion_box_qs';

/**
 * پارامترهایی که دیگر معنایی ندارند و نباید در URLِ سرچ بمانند.
 *
 * `semantic_search` (حذف در DR-30): روتینگِ APISIX به سمتِ semantic-search با `ref` + طولِ `text`
 * تصمیم گرفته می‌شود و این پارامتر در شرط‌هایش نیست؛ مقدارش هم از یک فلگِ GrowthBookِ خاموش
 * می‌آمد. اگر روزی پارامترِ مرده‌ی دیگری پیدا شد، فقط همین آرایه را زیاد کن.
 */
export const LEGACY_SEARCH_PARAMS = ['semantic_search'] as const;

export interface SearchBoxUrlInput {
  /** متنی که کاربر تایپ کرده. */
  text: string;
  /** `SEARCH_BOX_REF` یا `SEARCH_BOX_QS_REF`. */
  ref: string;
  /** اسلاگِ شهر؛ اگر ندهی، URLِ بدونِ شهر ساخته می‌شود (`/s/?…`). */
  citySlug?: string;
}

/** `/s/{city}/?text=…&ref=…` — بدونِ هیچ paramِ مرده. */
export const buildSearchBoxUrl = ({ text, ref, citySlug }: SearchBoxUrlInput): string =>
  `/s/${citySlug ? `${citySlug}/` : ''}?text=${text}&ref=${ref}`;

/**
 * پارامترهای مرده را از یک `URLSearchParams`ِ موجود پاک می‌کند.
 *
 * این برای URLهایی لازم است که کاربر از قبل بوکمارک کرده یا در تاریخچه‌ی مرورگر دارد: صفحه‌ی
 * نتایج وقتی کوئری را به‌روز می‌کند نباید پارامترِ مرده را دوباره حمل کند.
 * ورودی **در جا** تغییر می‌کند و خودش هم برگردانده می‌شود تا زنجیره‌کردن ساده باشد.
 */
export const stripLegacySearchParams = (params: URLSearchParams): URLSearchParams => {
  LEGACY_SEARCH_PARAMS.forEach(name => params.delete(name));
  return params;
};
