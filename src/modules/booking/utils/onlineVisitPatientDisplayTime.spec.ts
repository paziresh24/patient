import {
  applyOnlineVisitPatientDisplayBufferMs,
  formatOnlineVisitPatientBookTime,
} from './onlineVisitPatientDisplayTime';

const tehranMs = (hour: number, minute: number, second = 0) =>
  Date.parse(
    `2099-08-29T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+03:30`,
  );

const tehranClock = (ms: number) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Tehran',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(ms));
  const read = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(part => part.type === type)?.value ?? 0);
  return { hour: read('hour'), minute: read('minute') };
};

describe('applyOnlineVisitPatientDisplayBufferMs', () => {
  it('adds 15 minutes then ceils to a 5-minute mark', () => {
    expect(tehranClock(applyOnlineVisitPatientDisplayBufferMs(tehranMs(20, 0)))).toEqual({ hour: 20, minute: 15 });
    expect(tehranClock(applyOnlineVisitPatientDisplayBufferMs(tehranMs(20, 14)))).toEqual({ hour: 20, minute: 30 });
    expect(tehranClock(applyOnlineVisitPatientDisplayBufferMs(tehranMs(20, 27)))).toEqual({ hour: 20, minute: 45 });
    expect(tehranClock(applyOnlineVisitPatientDisplayBufferMs(tehranMs(20, 55)))).toEqual({ hour: 21, minute: 10 });
  });

  it('keeps exact five-minute results after the +15 buffer', () => {
    expect(tehranClock(applyOnlineVisitPatientDisplayBufferMs(tehranMs(19, 55)))).toEqual({ hour: 20, minute: 10 });
    expect(tehranClock(applyOnlineVisitPatientDisplayBufferMs(tehranMs(15, 30)))).toEqual({ hour: 15, minute: 45 });
  });
});

describe('formatOnlineVisitPatientBookTime', () => {
  it('buffers jalali date+time strings when enabled', () => {
    expect(formatOnlineVisitPatientBookTime('۱۴۰۵/۰۶/۰۵ ۲۰:۰۰', { enabled: true })).toBe(
      'حدود 20:15 - 1405/06/05',
    );
    expect(formatOnlineVisitPatientBookTime('1405/06/05 20:14', { enabled: true })).toBe(
      'حدود 20:30 - 1405/06/05',
    );
    expect(formatOnlineVisitPatientBookTime('ساعت ۲۰:۲۷ - ۱۴۰۵/۰۶/۰۵', { enabled: true })).toBe(
      'حدود 20:45 - 1405/06/05',
    );
    expect(formatOnlineVisitPatientBookTime('حدود ۲۰:۵۵ - ۱۴۰۵/۰۶/۰۵', { enabled: true })).toBe(
      'حدود 21:10 - 1405/06/05',
    );
  });

  it('keeps legacy approx prefix without buffer when disabled', () => {
    expect(formatOnlineVisitPatientBookTime('۱۴۰۵/۰۶/۰۵ ۲۰:۰۰')).toBe('حدود ۲۰:۰۰ - ۱۴۰۵/۰۶/۰۵');
    expect(formatOnlineVisitPatientBookTime('1405/06/05 20:14', { enabled: false })).toBe(
      'حدود 20:14 - 1405/06/05',
    );
  });

  it('returns empty for empty input', () => {
    expect(formatOnlineVisitPatientBookTime('')).toBe('');
    expect(formatOnlineVisitPatientBookTime(null)).toBe('');
    expect(formatOnlineVisitPatientBookTime(undefined)).toBe('');
  });
});
