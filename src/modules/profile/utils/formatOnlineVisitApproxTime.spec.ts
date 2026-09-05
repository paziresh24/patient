import {
  buildOnlineVisitCtaText,
  formatJalaliDayMonthFa,
  formatRoundedOnlineVisitClock,
  onlineVisitCtaButtonProps,
  roundUpToQuarterHourTehran,
} from './formatOnlineVisitApproxTime';

const tehranMs = (hour: number, minute: number, second = 0) =>
  Date.parse(`2099-08-29T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+03:30`);

describe('roundUpToQuarterHourTehran', () => {
  it('rounds up to the next 15-minute step', () => {
    expect(roundUpToQuarterHourTehran(tehranMs(16, 1))).toEqual({ hour: 16, minute: 15 });
    expect(roundUpToQuarterHourTehran(tehranMs(16, 25))).toEqual({ hour: 16, minute: 30 });
    expect(roundUpToQuarterHourTehran(tehranMs(15, 5))).toEqual({ hour: 15, minute: 15 });
    expect(roundUpToQuarterHourTehran(tehranMs(16, 40))).toEqual({ hour: 16, minute: 45 });
  });

  it('rounds 14:50 up to 15:00', () => {
    expect(roundUpToQuarterHourTehran(tehranMs(14, 50))).toEqual({ hour: 15, minute: 0 });
  });

  it('keeps exact quarter hours', () => {
    expect(roundUpToQuarterHourTehran(tehranMs(16, 0))).toEqual({ hour: 16, minute: 0 });
    expect(roundUpToQuarterHourTehran(tehranMs(16, 15))).toEqual({ hour: 16, minute: 15 });
    expect(roundUpToQuarterHourTehran(tehranMs(16, 30))).toEqual({ hour: 16, minute: 30 });
    expect(roundUpToQuarterHourTehran(tehranMs(16, 45))).toEqual({ hour: 16, minute: 45 });
  });
});

describe('formatRoundedOnlineVisitClock', () => {
  it('drops :00 and appends period of day', () => {
    expect(formatRoundedOnlineVisitClock(tehranMs(14, 50))).toBe('حدود ساعت 15 ظهر');
    expect(formatRoundedOnlineVisitClock(tehranMs(16, 25))).toBe('حدود ساعت 16:30 عصر');
    expect(formatRoundedOnlineVisitClock(tehranMs(15, 5))).toBe('حدود ساعت 15:15 ظهر');
    expect(formatRoundedOnlineVisitClock(tehranMs(17, 0))).toBe('حدود ساعت 17 عصر');
    expect(formatRoundedOnlineVisitClock(tehranMs(9, 10))).toBe('حدود ساعت 9:15 صبح');
    expect(formatRoundedOnlineVisitClock(tehranMs(21, 40))).toBe('حدود ساعت 21:45 شب');
  });
});

describe('formatJalaliDayMonthFa', () => {
  it('formats day and month with ماه suffix and latin digits', () => {
    expect(formatJalaliDayMonthFa(Date.parse('2026-09-26T17:30:00+03:30'))).toBe('4 مهرماه');
  });
});

describe('onlineVisitCtaButtonProps', () => {
  it('uses شروع ویزیت آنلاین on desktop and mobile until first-available returns', () => {
    expect(onlineVisitCtaButtonProps(null)).toEqual({
      children2: 'شروع ویزیت آنلاین',
    });
  });

  it('appends rounded time after a slot exists', () => {
    expect(onlineVisitCtaButtonProps(tehranMs(15, 30), tehranMs(14, 0))).toEqual({
      children2: 'شروع ویزیت آنلاین حدود ساعت 15:30 ظهر امروز',
    });
  });
});

describe('buildOnlineVisitCtaText', () => {
  it('uses شروع ویزیت آنلاین without doctor name', () => {
    expect(buildOnlineVisitCtaText(null)).toBe('شروع ویزیت آنلاین');
  });

  it('appends امروز or امشب when the slot is today', () => {
    expect(buildOnlineVisitCtaText(tehranMs(15, 30), tehranMs(14, 0))).toBe(
      'شروع ویزیت آنلاین حدود ساعت 15:30 ظهر امروز',
    );
    expect(buildOnlineVisitCtaText(tehranMs(21, 40), tehranMs(16, 0))).toBe(
      'شروع ویزیت آنلاین حدود ساعت 21:45 شب امشب',
    );
  });

  it('appends jalali date when the slot is not today', () => {
    expect(
      buildOnlineVisitCtaText(
        Date.parse('2026-09-26T17:10:00+03:30'),
        Date.parse('2026-08-29T16:00:00+03:30'),
      ),
    ).toBe('شروع ویزیت آنلاین حدود ساعت 17:15 عصر 4 مهرماه');
  });
});
