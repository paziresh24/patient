import { getAverageRate, getSatisfactionPercent } from './getAverageRate';

describe('getAverageRate', () => {
  it('averages only present dimensions and rounds to one decimal', () => {
    expect(
      getAverageRate({
        average_quality_of_treatment: 4.974,
        average_doctor_encounter: 4.956,
        average_explanation_of_issue: 4.958,
      }),
    ).toBe(5);
  });
});

describe('getSatisfactionPercent', () => {
  it('scales the profile average to a percent the same way SEO does (avg × 20)', () => {
    expect(
      getSatisfactionPercent({
        average_quality_of_treatment: '4.9',
        average_doctor_encounter: '4.9',
        average_explanation_of_issue: '4.9',
      }),
    ).toBe(98);
  });

  it('returns null when no rate dimensions are present', () => {
    expect(getSatisfactionPercent({})).toBeNull();
  });
});
