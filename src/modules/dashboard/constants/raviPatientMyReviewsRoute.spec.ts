import { isRaviPatientMyReviewsMenu } from './raviPatientMyReviewsRoute';

describe('isRaviPatientMyReviewsMenu', () => {
  it('matches the hamdast ravi my_feedbacks menu', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', 'my_feedbacks')).toBe(true);
  });

  it('does not match doctor profile reviews or other apps', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', 'my_prifile_feedbacks')).toBe(false);
    expect(isRaviPatientMyReviewsMenu('drapp', 'my_feedbacks')).toBe(false);
  });
});
