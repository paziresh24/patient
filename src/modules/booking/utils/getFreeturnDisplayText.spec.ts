import { getFreeturnDisplayText } from '@/modules/booking/utils/getFreeturnDisplayText';

describe('getFreeturnDisplayText', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns asap text when freeturn is null', () => {
    expect(getFreeturnDisplayText(null)).toBe('در اسرع وقت');
  });

  it('returns within 15 minutes when freeturn is in the past', () => {
    expect(getFreeturnDisplayText(Date.now() - 60_000)).toBe('در کمتر از ۱۵ دقیقه آینده');
  });

  it('returns formatted time when freeturn is in the future', () => {
    const text = getFreeturnDisplayText(Date.now() + 2 * 60 * 60 * 1000);
    expect(text).toContain('حدود ساعت');
  });
});
