import {
  displayNameFromCenterName,
  joinProfileNameParts,
  resolveProfileDisplayName,
} from './resolveProfileDisplayName';

describe('joinProfileNameParts', () => {
  it('joins non-empty parts', () => {
    expect(joinProfileNameParts({ name: 'سیدرضا', family: 'حجازیان' })).toBe('سیدرضا حجازیان');
  });

  it('ignores blank parts', () => {
    expect(joinProfileNameParts({ name: ' ', family: null })).toBe('');
  });
});

describe('displayNameFromCenterName', () => {
  it('strips مطب prefix', () => {
    expect(displayNameFromCenterName('مطب سیدرضا حجازیان')).toBe('سیدرضا حجازیان');
  });
});

describe('resolveProfileDisplayName', () => {
  it('prefers joined name parts', () => {
    expect(resolveProfileDisplayName({ name: 'سیدرضا', family: 'حجازیان' })).toBe('سیدرضا حجازیان');
  });

  it('falls back to center name', () => {
    expect(
      resolveProfileDisplayName({ name: '', family: '' }, { centerName: 'مطب سیدرضا حجازیان' }),
    ).toBe('سیدرضا حجازیان');
  });

  it('falls back to slug', () => {
    expect(resolveProfileDisplayName({}, { slug: 'کارشناس-سیدرضا-حجازیان' })).toBe('کارشناس سیدرضا حجازیان');
  });
});
