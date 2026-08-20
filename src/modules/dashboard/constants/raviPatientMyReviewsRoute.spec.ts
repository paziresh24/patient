import { isRaviPatientMyReviewsMenu } from './raviPatientMyReviewsRoute';

describe('isRaviPatientMyReviewsMenu', () => {
  it('matches the hamdast ravi my_feedbacks menu', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', 'my_feedbacks')).toBe(true);
  });

  it('does not match doctor profile reviews or other apps', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', 'my_prifile_feedbacks')).toBe(false);
    expect(isRaviPatientMyReviewsMenu('drapp', 'my_feedbacks')).toBe(false);
  });

  it('does not rewrite the parent نظرات branch itself', () => {
    // Parent menu stays on hamdast; only the my_feedbacks child is remapped.
    expect(isRaviPatientMyReviewsMenu('ravi', undefined)).toBe(false);
    expect(isRaviPatientMyReviewsMenu('ravi', '')).toBe(false);
  });
});
