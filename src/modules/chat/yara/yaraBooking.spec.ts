/**
 * These URLs are the difference between «دکمه کار می‌کند» and «دکمه من را به
 * پروفایل پرت کرد» — the owner's actual complaint. Each test pins one shape the
 * product already ships elsewhere.
 */
import { inPersonBookingUrl, onlineVisitUrl, ONLINE_VISIT_CENTER_ID } from './yaraBooking';

it('ویزیت آنلاین دقیقاً همان URLِ دکمه‌ی جستجوی کلاسیک است', () => {
  expect(onlineVisitUrl('/dr/دکتر-علی-ویسی-1/')).toBe(
    `/booking/دکتر-علی-ویسی-1/?centerId=${ONLINE_VISIT_CENTER_ID}&skipTimeSelectStep=true`
  );
});

it('نوبت حضوری به مرکزِ زودترین نوبت می‌رود (الگوی پروفایلِ پزشک)', () => {
  expect(inPersonBookingUrl('/dr/x/', '5532')).toBe('/booking/x/?centerId=5532');
  expect(inPersonBookingUrl('/dr/x/', '03a723aa-fe47')).toBe('/booking/x/?centerId=03a723aa-fe47');
});

it('بدونِ مرکز، لینکِ حضوری ساخته نمی‌شود — صفحه‌ی رزروِ بی‌مرکز بدتر از پروفایل است', () => {
  expect(inPersonBookingUrl('/dr/x/', undefined)).toBeNull();
  expect(inPersonBookingUrl('/dr/x/', '  ')).toBeNull();
});

it('URLی که slugِ /dr/ ندارد هیچ لینکِ رزروی نمی‌سازد ⇒ caller به پروفایل برمی‌گردد', () => {
  expect(onlineVisitUrl('/center/y/')).toBeNull();
  expect(inPersonBookingUrl('', '5532')).toBeNull();
});
