import { withApproxTimePrefix } from './withApproxTimePrefix';

describe('withApproxTimePrefix', () => {
  it('prefixes حدود when missing', () => {
    expect(withApproxTimePrefix('ساعت ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷')).toBe('حدود ساعت ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷');
    expect(withApproxTimePrefix('1405/06/07 17:00')).toBe('حدود 1405/06/07 17:00');
  });

  it('does not double-prefix when حدود already present', () => {
    expect(withApproxTimePrefix('حدود ساعت ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷')).toBe('حدود ساعت ۱۷:۰۰ - ۱۴۰۵/۰۶/۰۷');
    expect(withApproxTimePrefix('حدود 1405/06/07 17:00')).toBe('حدود 1405/06/07 17:00');
  });

  it('returns empty for empty input', () => {
    expect(withApproxTimePrefix('')).toBe('');
    expect(withApproxTimePrefix(null)).toBe('');
    expect(withApproxTimePrefix(undefined)).toBe('');
    expect(withApproxTimePrefix('   ')).toBe('');
  });
});
