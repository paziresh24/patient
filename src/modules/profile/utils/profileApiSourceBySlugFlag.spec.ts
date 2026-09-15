import { isSlugInProfileApiSourceAllowlist } from './profileApiSourceBySlugFlag';

describe('isSlugInProfileApiSourceAllowlist', () => {
  it('matches exact slug in allowlist', () => {
    expect(isSlugInProfileApiSourceAllowlist(['دکتر-محدثه-بشارتی', 'دکتر-ابوالفضل-ساجدی-10'], 'دکتر-محدثه-بشارتی')).toBe(
      true,
    );
    expect(isSlugInProfileApiSourceAllowlist(['دکتر-محدثه-بشارتی'], 'دکتر-دیگر')).toBe(false);
  });

  it('supports wildcard', () => {
    expect(isSlugInProfileApiSourceAllowlist(['*'], 'any-slug')).toBe(true);
  });
});
