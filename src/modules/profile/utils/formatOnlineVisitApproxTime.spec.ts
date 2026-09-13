import { applyOnlineVisitPatientDisplayBufferMs } from '@/modules/booking/utils/onlineVisitPatientDisplayTime';
import {
  buildOnlineVisitCtaText,
  formatJalaliDayMonthFa,
  formatRoundedOnlineVisitClock,
  onlineVisitCtaButtonProps,
  roundUpToQuarterHourTehran,
} from './formatOnlineVisitApproxTime';

const tehranMs = (hour: number, minute: number, second = 0) =>
  Date.parse(`2099-08-29T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+03:30`);

describe('roundUpToQuarterHourTehran (compat → +15 then ceil-to-5)', () => {
  it('applies +15m then ceil to 5 minutes', () => {
    expect(roundUpToQuarterHourTehran(tehranMs(20, 0))).toEqual({ hour: 20, minute: 15 });
    expect(roundUpToQuarterHourTehran(tehranMs(20, 14))).toEqual({ hour: 20, minute: 30 });
    expect(roundUpToQuarterHourTehran(tehranMs(20, 27))).toEqual({ hour: 20, minute: 45 });
    expect(roundUpToQuarterHourTehran(tehranMs(20, 55))).toEqual({ hour: 21, minute: 10 });
  });
});

describe('formatRoundedOnlineVisitClock', () => {
  it('formats buffered clock with period of day', () => {
    expect(formatRoundedOnlineVisitClock(tehranMs(20, 0))).toBe('حدود ساعت 20:15 شب');
    expect(formatRoundedOnlineVisitClock(tehranMs(20, 14))).toBe('حدود ساعت 20:30 شب');
    expect(formatRoundedOnlineVisitClock(tehranMs(20, 27))).toBe('حدود ساعت 20:45 شب');
    expect(formatRoundedOnlineVisitClock(tehranMs(20, 55))).toBe('حدود ساعت 21:10 شب');
    expect(formatRoundedOnlineVisitClock(tehranMs(14, 50))).toBe('حدود ساعت 15:05 ظهر');
    expect(formatRoundedOnlineVisitClock(tehranMs(17, 0))).toBe('حدود ساعت 17:15 عصر');
    expect(formatRoundedOnlineVisitClock(tehranMs(9, 10))).toBe('حدود ساعت 9:25 صبح');
  });
});

describe('formatJalaliDayMonthFa', () => {
  it('formats day and month with ماه suffix and latin digits', () => {
    expect(formatJalaliDayMonthFa(Date.parse('2026-09-26T17:30:00+03:30'))).toBe('4 مهرماه');
  });
});

describe('onlineVisitCtaButtonProps', () => {
  it('leaves the original Plasmic CTA until first-available time exists', () => {
    expect(onlineVisitCtaButtonProps(null)).toBeUndefined();
  });

  it('overrides the CTA only after a slot time exists', () => {
    expect(onlineVisitCtaButtonProps(tehranMs(15, 30), tehranMs(14, 0))).toEqual({
      children2: 'شروع ویزیت آنلاین حدود ساعت 15:45 ظهر امروز',
    });
  });
});

describe('buildOnlineVisitCtaText', () => {
  it('uses شروع ویزیت آنلاین without doctor name', () => {
    expect(buildOnlineVisitCtaText(null)).toBe('شروع ویزیت آنلاین');
  });

  it('appends امروز or امشب when the buffered slot is today', () => {
    expect(buildOnlineVisitCtaText(tehranMs(15, 30), tehranMs(14, 0))).toBe(
      'شروع ویزیت آنلاین حدود ساعت 15:45 ظهر امروز',
    );
    expect(buildOnlineVisitCtaText(tehranMs(21, 40), tehranMs(16, 0))).toBe(
      'شروع ویزیت آنلاین حدود ساعت 21:55 شب امشب',
    );
  });

  it('appends jalali date when the buffered slot is not today', () => {
    expect(
      buildOnlineVisitCtaText(
        Date.parse('2026-09-26T17:10:00+03:30'),
        Date.parse('2026-08-29T16:00:00+03:30'),
      ),
    ).toBe('شروع ویزیت آنلاین حدود ساعت 17:25 عصر 4 مهرماه');
  });
});

describe('applyOnlineVisitPatientDisplayBufferMs via profile CTA', () => {
  it('matches the shared buffer helper', () => {
    const ms = tehranMs(20, 14);
    expect(formatRoundedOnlineVisitClock(ms)).toContain('20:30');
    expect(applyOnlineVisitPatientDisplayBufferMs(ms)).toBeGreaterThan(ms);
  });
});
