/**
 * داده‌ی مشترکِ تست‌ها — یک‌جا، تا وقتی کوئری/شهر/پزشکِ نمونه عوض شد فقط همین فایل تغییر کند.
 *
 * قاعده: هیچ تستی نباید به **یک پزشکِ خاص** گره بخورد (پزشک ممکن است غیرفعال شود و تست را
 * به‌دروغ قرمز کند). به‌جایش تست‌ها از نتایجِ جستجو، پزشکِ اولِ زنده را انتخاب می‌کنند.
 */

export const CITY = 'tehran';

/** کوئری‌های سرچ که هر کدام یک شاخه‌ی متفاوتِ pipeline را می‌زنند (ghane: search-traffic-flow). */
export const SEARCH_QUERIES = {
  /** تخصص — مسیرِ اصلیِ ترافیکِ گوگل */
  specialty: 'متخصص پوست',
  /** نامِ پزشک — مسیرِ name-search که profile/exact-index را درگیر می‌کند */
  doctorName: 'دکتر محمد',
};

/** لندینگ‌های پرترافیک (همان سه قالبِ DR-08 §۱). */
export const LISTING_TEMPLATES = {
  cityRoot: '/s/',
  specialtyInCity: `/s/${CITY}/dermatology/`,
  consultLanding: '/s/ir/psychology/?turn_type=consult',
};

/** حداقلِ تعدادِ کارت که «صفحه‌ی نتایج سالم است» را ثابت می‌کند. */
export const MIN_RESULTS = 5;
