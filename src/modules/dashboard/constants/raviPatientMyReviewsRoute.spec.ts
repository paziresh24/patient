import {
  isRaviDoctorProfileReviewsMenu,
  isRaviPatientMyReviewsMenu,
  raviAppParentLink,
} from './raviPatientMyReviewsRoute';

describe('isRaviPatientMyReviewsMenu', () => {
  it('matches the hamdast ravi my_feedbacks menu', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', 'my_feedbacks')).toBe(true);
  });

  it('does not match doctor profile reviews or other apps', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', 'my_prifile_feedbacks')).toBe(false);
    expect(isRaviPatientMyReviewsMenu('drapp', 'my_feedbacks')).toBe(false);
  });

  it('does not rewrite the parent نظرات branch itself', () => {
    expect(isRaviPatientMyReviewsMenu('ravi', undefined)).toBe(false);
    expect(isRaviPatientMyReviewsMenu('ravi', '')).toBe(false);
  });
});

describe('isRaviDoctorProfileReviewsMenu', () => {
  it('matches the hamdast doctor profile reviews menu', () => {
    expect(isRaviDoctorProfileReviewsMenu('ravi', 'my_prifile_feedbacks')).toBe(true);
  });

  it('does not match patient my-reviews or other apps', () => {
    expect(isRaviDoctorProfileReviewsMenu('ravi', 'my_feedbacks')).toBe(false);
    expect(isRaviDoctorProfileReviewsMenu('drapp', 'my_prifile_feedbacks')).toBe(false);
  });
});

describe('raviAppParentLink', () => {
  it('omits the parent link for ravi when submenu exists so نظرات only expands', () => {
    expect(raviAppParentLink('ravi', 'my_feedbacks', true)).toBeUndefined();
  });

  it('keeps other apps parent links unchanged', () => {
    expect(raviAppParentLink('drapp', 'appointments', true)).toBe('/dashboard/apps/drapp/appointments/');
  });

  it('keeps ravi parent link when there is no submenu', () => {
    expect(raviAppParentLink('ravi', 'my_feedbacks', false)).toBe('/dashboard/apps/ravi/my_feedbacks/');
  });
});
