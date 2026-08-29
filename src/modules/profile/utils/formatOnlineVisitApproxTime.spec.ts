import {
  buildOnlineVisitCtaText,
  formatJalaliDayMonthFa,
  formatRoundedOnlineVisitClock,
  roundUpToHalfHourTehran,
} from './formatOnlineVisitApproxTime';

const tehranMs = (hour: number, minute: number, second = 0) =>
  Date.parse(`2099-08-29T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+03:30`);

describe('roundUpToHalfHourTehran', () => {
  it('rounds 16:25 up to 16:30', () => {
    expect(roundUpToHalfHourTehran(tehranMs(16, 25))).toEqual({ hour: 16, minute: 30 });
  });

  it('rounds 15:05 up to 15:30', () => {
    expect(roundUpToHalfHourTehran(tehranMs(15, 5))).toEqual({ hour: 15, minute: 30 });
  });

  it('rounds 14:50 up to 15:00', () => {
    expect(roundUpToHalfHourTehran(tehranMs(14, 50))).toEqual({ hour: 15, minute: 0 });
  });

  it('keeps exact hour and half-hour', () => {
    expect(roundUpToHalfHourTehran(tehranMs(16, 0))).toEqual({ hour: 16, minute: 0 });
    expect(roundUpToHalfHourTehran(tehranMs(16, 30))).toEqual({ hour: 16, minute: 30 });
  });
});

describe('formatRoundedOnlineVisitClock', () => {
  it('drops :00 and appends period of day', () => {
    expect(formatRoundedOnlineVisitClock(tehranMs(14, 50))).toBe('حدود ساعت 15 ظهر');
    expect(formatRoundedOnlineVisitClock(tehranMs(16, 25))).toBe('حدود ساعت 16:30 عصر');
    expect(formatRoundedOnlineVisitClock(tehranMs(15, 5))).toBe('حدود ساعت 15:30 ظهر');
    expect(formatRoundedOnlineVisitClock(tehranMs(17, 0))).toBe('حدود ساعت 17 عصر');
    expect(formatRoundedOnlineVisitClock(tehranMs(9, 10))).toBe('حدود ساعت 9:30 صبح');
    expect(formatRoundedOnlineVisitClock(tehranMs(21, 40))).toBe('حدود ساعت 22 شب');
  });
});

describe('formatJalaliDayMonthFa', () => {
  it('formats day and month with ماه suffix and latin digits', () => {
    expect(formatJalaliDayMonthFa(Date.parse('2026-09-26T17:30:00+03:30'))).toBe('4 مهرماه');
  });
});

describe('buildOnlineVisitCtaText', () => {
  it('keeps the name-only CTA when time is missing', () => {
    expect(buildOnlineVisitCtaText('زهرا رجبلی', null)).toBe('شروع ویزیت با زهرا رجبلی');
  });

  it('appends امروز or امشب when the slot is today', () => {
    expect(buildOnlineVisitCtaText('زهرا رجبلی', tehranMs(17, 0), tehranMs(16, 0))).toBe(
      'شروع ویزیت با زهرا رجبلی حدود ساعت 17 عصر امروز',
    );
    expect(buildOnlineVisitCtaText('زهرا رجبلی', tehranMs(21, 40), tehranMs(16, 0))).toBe(
      'شروع ویزیت با زهرا رجبلی حدود ساعت 22 شب امشب',
    );
  });

  it('appends jalali date when the slot is not today', () => {
    expect(
      buildOnlineVisitCtaText(
        'زهرا رجبلی',
        Date.parse('2026-09-26T17:10:00+03:30'),
        Date.parse('2026-08-29T16:00:00+03:30'),
      ),
    ).toBe('شروع ویزیت با زهرا رجبلی حدود ساعت 17:30 عصر 4 مهرماه');
  });
});
