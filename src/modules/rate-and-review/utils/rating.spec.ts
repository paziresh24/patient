import { averageFromBreakdown, toFixedRating } from './rating';

describe('toFixedRating', () => {
  it('formats finite numbers', () => {
    expect(toFixedRating(4.26)).toBe('4.3');
    expect(toFixedRating(4)).toBe('4');
  });

  it('returns zero for non-finite values', () => {
    expect(toFixedRating(Number.NaN)).toBe('0');
    expect(toFixedRating(Number.POSITIVE_INFINITY)).toBe('0');
  });
});

describe('averageFromBreakdown', () => {
  it('averages item values', () => {
    expect(
      averageFromBreakdown([
        { label: 'a', value: 4 },
        { label: 'b', value: 5 },
        { label: 'c', value: 3 },
      ]),
    ).toBe(4);
  });

  it('returns zero for empty list', () => {
    expect(averageFromBreakdown([])).toBe(0);
  });
});
