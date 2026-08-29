import {
  extractNewOnlineVisitBoxSlugs,
  isNewOnlineVisitBoxEnabled,
  slugsFromGrowthBookOnlineVisitBoxFeature,
} from './isNewOnlineVisitBoxEnabled';

describe('isNewOnlineVisitBoxEnabled', () => {
  it('matches slugs from { slugs } payload', () => {
    expect(isNewOnlineVisitBoxEnabled({ slugs: ['dr-a', 'dr-b'] }, 'dr-a')).toBe(true);
    expect(isNewOnlineVisitBoxEnabled({ slugs: ['dr-a'] }, 'dr-other')).toBe(false);
  });

  it('matches a raw slug array and wildcard', () => {
    expect(isNewOnlineVisitBoxEnabled(['dr-a'], 'dr-a')).toBe(true);
    expect(isNewOnlineVisitBoxEnabled(['*'], 'anyone')).toBe(true);
  });

  it('falls back to boolean isOn when no slugs are listed', () => {
    expect(isNewOnlineVisitBoxEnabled({ slugs: [] }, 'dr-a', true)).toBe(true);
    expect(isNewOnlineVisitBoxEnabled(true, 'dr-a', true)).toBe(true);
    expect(isNewOnlineVisitBoxEnabled(false, 'dr-a', false)).toBe(false);
  });
});

describe('extractNewOnlineVisitBoxSlugs', () => {
  it('ignores empty and non-string entries', () => {
    expect(extractNewOnlineVisitBoxSlugs({ slugs: ['dr-a', '', 1] })).toEqual(['dr-a']);
  });
});

describe('slugsFromGrowthBookOnlineVisitBoxFeature', () => {
  it('reads equality and $in slug rules that force true', () => {
    expect(
      slugsFromGrowthBookOnlineVisitBoxFeature({
        defaultValue: false,
        rules: [
          { condition: { slug: 'dr-a' }, force: true },
          { condition: { slug: { $in: ['dr-b', 'dr-c'] } }, force: true },
          { condition: { slug: 'dr-off' }, force: false },
        ],
      }).sort(),
    ).toEqual(['dr-a', 'dr-b', 'dr-c']);
  });
});
