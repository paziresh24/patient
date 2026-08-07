/**
 * Where a booking button on a Yara card actually goes.
 *
 * owner (2026-08-07): «روی دکمه نوبت یا ویزیت آنلاینش کلیک می‌کنم به اون مرحله
 * نمی‌ره و من رو می‌فرسته به پروفایلش. این خوب نیست.» — and then chose the
 * deep-link option, with the instruction to copy what the product already does:
 * the classic search's online-visit button, and the doctor profile's in-person
 * flow.
 *
 * So neither URL here is invented. Both are the shapes already shipped in this
 * repo, which is the point: a fourth hand-rolled booking URL is a fourth thing
 * to keep in sync with a booking flow that changes without telling us.
 */

/**
 * The online-visit centre. A constant in `consultBanner.tsx`,
 * `SubstituteDoctorButton.tsx` and `booking/views` already — named here so the
 * next reader knows it is *the* online-visit centre, not a magic number.
 */
export const ONLINE_VISIT_CENTER_ID = '5532';

/** `/dr/<slug>/` → `/booking/<slug>/`. The repo's own transformation. */
function toBookingPath(profileUrl: string): string | null {
  const url = String(profileUrl ?? '').trim();
  if (!url.includes('/dr/')) return null;
  return url.replace('/dr/', '/booking/');
}

/**
 * Straight to time-selection for an online visit — the same URL the classic
 * search's «ویزیت آنلاین» button builds, `skipTimeSelectStep` included.
 */
export function onlineVisitUrl(profileUrl: string): string | null {
  const path = toBookingPath(profileUrl);
  if (!path) return null;
  return `${path}?centerId=${ONLINE_VISIT_CENTER_ID}&skipTimeSelectStep=true`;
}

/**
 * In-person booking at the centre with the earliest free turn — the profile's
 * shape (`/booking/<slug>?centerId=…`).
 *
 * ⛔ Returns `null` without a centre id rather than dropping the patient on a
 * booking page that cannot resolve a centre. A button that opens a broken step
 * is worse than a button that stays a profile link, so the caller falls back.
 */
export function inPersonBookingUrl(profileUrl: string, centerId?: string): string | null {
  const path = toBookingPath(profileUrl);
  const center = String(centerId ?? '').trim();
  if (!path || !center) return null;
  return `${path}?centerId=${encodeURIComponent(center)}`;
}
