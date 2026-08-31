import { withApproxTimePrefix } from './withApproxTimePrefix';

describe('withApproxTimePrefix', () => {
  it('formats API date+time as حدود clock - date', () => {
    expect(withApproxTimePrefix('۱۴۰۵/۰۶/۰۵ ۱۷:۳۰')).toBe('حدود ۱۷:۳۰ - ۱۴۰۵/۰۶/۰۵');
    expect(withApproxTimePrefix('1405/06/07 17:00')).toBe('حدود 17:00 - 1405/06/07');
  });

  it('formats ساعت … - date copy as حدود clock - date', () => {
    expect(withApproxTimePrefix('ساعت ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷')).toBe('حدود ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷');
  });

  it('does not double-format when already correct', () => {
    expect(withApproxTimePrefix('حدود ۱۷:۳۰ - ۱۴۰۵/۰۶/۰۵')).toBe('حدود ۱۷:۳۰ - ۱۴۰۵/۰۶/۰۵');
  });

  it('normalizes legacy wrong حدود prefix placement', () => {
    expect(withApproxTimePrefix('حدود ۱۴۰۵/۰۶/۰۵ ۱۷:۳۰')).toBe('حدود ۱۷:۳۰ - ۱۴۰۵/۰۶/۰۵');
    expect(withApproxTimePrefix('حدود ساعت ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷')).toBe('حدود ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷');
    expect(withApproxTimePrefix('حدود ۱۷:۳۰-۱۴۰۵/۰۶/۰۵')).toBe('حدود ۱۷:۳۰ - ۱۴۰۵/۰۶/۰۵');
  });

  it('returns empty for empty input', () => {
    expect(withApproxTimePrefix('')).toBe('');
    expect(withApproxTimePrefix(null)).toBe('');
    expect(withApproxTimePrefix(undefined)).toBe('');
    expect(withApproxTimePrefix('   ')).toBe('');
  });
});
