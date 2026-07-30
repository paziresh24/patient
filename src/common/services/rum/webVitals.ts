import { getCookie } from 'cookies-next';
import type { NextWebVitalsMetric } from 'next/app';

/**
 * RUM — ارسالِ Core Web Vitalsِ **مرورگرِ کاربرانِ واقعی** به Splunk.
 * (DR-08، ghane/docs/dev-requests/dr-08-listing-pagespeed.md §۱۷)
 *
 * چرا: Next این متریک‌ها را همین حالا در مرورگرِ هر کاربر محاسبه می‌کند (`reportWebVitals` +
 * `webVitalsAttribution` در `next.config.js`) ولی تا امروز **دور ریخته می‌شد**. Clarity و CrUX
 * هم CWV دارند، ولی هیچ‌کدام دادهٔ خودمان را به‌تفکیکِ **قالبِ صفحه** و **نسخهٔ build** و
 * نزدیک-به-لحظه نمی‌دهند — که برای سنجشِ اثرِ هر deploy لازم است.
 *
 * ── طراحی: عمداً یک **رجیستریِ مقصد** ─────────────────────────────────────────────
 * هر مقصد می‌گوید «کدام صفحات» را «کجا» بفرست. امروز فقط صفحاتِ **جستجو** فعال است
 * (تصمیمِ owner). اگر بعداً تیمِ دیگری بخواهد متریکِ **پروفایلِ پزشک/مرکز** را به Splunkِ
 * **دیگری** بفرستد، فقط یک رکورد به این آرایه اضافه می‌کند — بدونِ دست‌زدن به منطقِ ارسال:
 *
 *   { name: 'doctor-profile', match: p => p.startsWith('/dr/'),
 *     baseUrl: 'https://profile-splunk-hec.paziresh24.com', token: '<token خودشان>' }
 *
 * ── حریمِ خصوصی (قاعده‌ی سختِ ghane/analytics-events-map) ────────────────────────
 * **query string هرگز ارسال نمی‌شود.** متنِ جستجوی کاربر می‌تواند دادهٔ سلامت باشد. فقط
 * `pathname`ِ نرمال‌شده و «قالبِ صفحه» می‌رود.
 */

export interface WebVitalsTarget {
  /** برای برچسبِ `event_group` و عیب‌یابی */
  name: string;
  /** کدام مسیرها به این مقصد می‌روند */
  match: (pathname: string) => boolean;
  /** HEC baseUrl (بدونِ `/services/collector`) */
  baseUrl: string;
  /**
   * توکنِ HEC. مثلِ ۱۰ توکنِ دیگرِ همین repo (`src/common/services/splunk.ts`) این‌جا نوشته
   * می‌شود: توکنِ HEC در مرورگر ذاتاً قابلِ دیدن است و «راز» نیست — write-only است و به
   * **یک ایندکسِ مشخص** bind شده، پس دامنه‌ی آسیبش محدود است.
   */
  token: string;
}

/** فقط صفحاتِ جستجو — پروفایلِ پزشک/مرکز عمداً این‌جا نیست (تصمیمِ owner، 2026-07-30). */
export const WEB_VITALS_TARGETS: WebVitalsTarget[] = [
  {
    name: 'search',
    match: pathname => pathname === '/s' || pathname.startsWith('/s/'),
    // همان هاستی که رویدادهای `search_view` امروز از مرورگر به آن می‌روند ⇒ دسترسی/CORS اثبات‌شده.
    baseUrl: 'https://rokhdad-splunk-hec.paziresh24.com',
    // ایندکسِ اختصاصی `p24_web_vitals` (retention ۹۰ روز)، توکنِ اختصاصی و جدا از بقیه.
    token: 'd1611ad4-bd3a-44f7-840c-dbf3d8eddcde',
  },
];

/** قالبِ صفحه — همان سه قالبِ DR-08 §۱ تا برش‌ها با تحلیل‌های قبلی هم‌راستا بماند. */
export function pageTemplate(pathname: string, isConsult: boolean): string {
  if (isConsult) return 'consult_landing';
  const parts = pathname.split('/').filter(Boolean); // ['s','tehran','dermatology']
  if (parts[0] !== 's') return 'other';
  if (parts.length <= 2) return 'listing_city_root';
  return 'listing_specialty_city';
}

export function findTarget(pathname: string): WebVitalsTarget | undefined {
  return WEB_VITALS_TARGETS.find(target => target.match(pathname));
}

export interface WebVitalPayload {
  event_group: string;
  event_type: string;
  metric: string;
  value: number;
  metric_id: string;
  page_template: string;
  pathname: string;
  terminal_id: unknown;
  build_id: string | null;
  device: 'mobile' | 'desktop';
  connection: string | null;
  is_application: boolean;
  attribution: string | null;
}

/**
 * پاک‌سازیِ `attribution` — **گاردِ حریمِ خصوصی**.
 *
 * چرا لازم است (با تستِ زنده کشف شد، نه حدس): Next داخلِ attribution آبجکت‌های خامِ
 * Performance API را می‌گذارد و `navigationEntry.name` **آدرسِ کاملِ صفحه با query string**
 * است — یعنی متنِ جستجوی کاربر. ارسالِ خامِ attribution همان چیزی را لو می‌داد که قاعده‌ی
 * ghane/analytics-events-map صریحاً ممنوع کرده (متنِ کاربر می‌تواند دادهٔ سلامت باشد).
 *
 * قاعده‌ی این تابع عمداً **allowlistِ شکلی** است، نه لیستِ اسمِ فیلدها: فقط مقادیرِ **مسطح** و
 * بی‌خطر می‌مانند (عدد/بولین، و رشته‌ای که نه `://` دارد و نه `?`). هر آبجکت/آرایه — یعنی
 * `navigationEntry`/`lcpEntry`/`eventEntry` — کامل حذف می‌شود. مزیتش: اگر Next فردا فیلدِ
 * جدیدی اضافه کند، پیش‌فرض **حذف** است نه ارسال.
 */
export function sanitizeAttribution(attr: unknown): string | null {
  if (!attr || typeof attr !== 'object') return null;
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(attr as Record<string, unknown>)) {
    if (typeof value === 'number' || typeof value === 'boolean') {
      safe[key] = typeof value === 'number' ? Math.round(value * 100) / 100 : value;
    } else if (typeof value === 'string' && !value.includes('://') && !value.includes('?')) {
      // سلکتورِ عنصر (مثلِ `element`/`largestShiftTarget`/`interactionTarget`) — همان چیزی که
      // برای عیب‌یابی لازم است و PII ندارد.
      safe[key] = value.slice(0, 200);
    }
  }
  return Object.keys(safe).length ? JSON.stringify(safe).slice(0, 400) : null;
}

/**
 * ساختِ payload — تابعِ خالص تا تست‌پذیر باشد.
 * ⛔ هیچ‌جای این آبجکت `search`/`href` نیست (حریمِ خصوصی).
 */
export function buildPayload(
  metric: NextWebVitalsMetric,
  ctx: {
    pathname: string;
    isConsult: boolean;
    targetName: string;
    terminalId?: unknown;
    buildId?: string | null;
    isMobile: boolean;
    connection?: string | null;
    isApplication: boolean;
  },
): WebVitalPayload {
  const attribution = (metric as unknown as { attribution?: Record<string, unknown> }).attribution;
  return {
    event_group: `web_vitals_${ctx.targetName}`,
    event_type: 'web_vital',
    metric: metric.name,
    value: Math.round(metric.value * 1000) / 1000,
    metric_id: metric.id,
    page_template: pageTemplate(ctx.pathname, ctx.isConsult),
    pathname: ctx.pathname,
    terminal_id: ctx.terminalId ?? null,
    build_id: ctx.buildId ?? null,
    device: ctx.isMobile ? 'mobile' : 'desktop',
    connection: ctx.connection ?? null,
    is_application: ctx.isApplication,
    // مفیدترین بخش برای عیب‌یابی: کدام عنصر مسببِ LCP/CLS بوده — ولی **پاک‌سازی‌شده**
    // (نگاه: sanitizeAttribution؛ خامش آدرسِ کامل با query string داشت).
    attribution: sanitizeAttribution(attribution),
  };
}

/**
 * ارسالِ یک متریک. عمداً «آتش کن و فراموش کن»:
 * `sendBeacon` نخِ اصلی را بلاک نمی‌کند و اگر کاربر صفحه را ببندد هم می‌رسد. اگر در دسترس
 * نبود، `fetch(keepalive)`. هر خطایی بی‌صدا نادیده گرفته می‌شود — **مانیتورینگ هرگز نباید
 * تجربه‌ی کاربر را خراب کند**.
 */
export function sendWebVital(metric: NextWebVitalsMetric): void {
  try {
    if (typeof window === 'undefined') return;
    const pathname = window.location.pathname;
    const target = findTarget(pathname);
    if (!target) return;

    const payload = buildPayload(metric, {
      pathname,
      isConsult: new URLSearchParams(window.location.search).get('turn_type') === 'consult',
      targetName: target.name,
      terminalId: getCookie('terminal_id'),
      buildId: (window as any).__NEXT_DATA__?.buildId ?? null,
      isMobile: window.matchMedia('(max-width: 768px)').matches,
      connection: (navigator as any)?.connection?.effectiveType ?? null,
      isApplication: window.matchMedia('(display-mode: standalone)').matches,
    });

    const url = `${target.baseUrl}/services/collector/event`;
    const body = JSON.stringify({ event: payload, sourcetype: 'web_vitals' });

    // HEC توکن را در هدر می‌خواهد، پس sendBeacon فقط با Blobِ حاوی هدر کار نمی‌کند ⇒ fetch.
    void fetch(url, {
      method: 'POST',
      headers: { Authorization: `Splunk ${target.token}`, 'Content-Type': 'application/json' },
      body,
      keepalive: true,
      mode: 'cors',
      credentials: 'omit',
    }).catch(() => undefined);
  } catch {
    // بی‌صدا
  }
}
