import { buildRaviMyReviewsUrl, RAVI_MY_REVIEWS_PATH } from './buildRaviMyReviewsUrl';

describe('buildRaviMyReviewsUrl', () => {
  it('points at the live ravi-front my-reviews page', () => {
    expect(buildRaviMyReviewsUrl()).toBe(`https://ravi-front-ravi.p24cloud.ir${RAVI_MY_REVIEWS_PATH}`);
  });

  it('passes the session token so p24cloud can identify the logged-in patient', () => {
    expect(buildRaviMyReviewsUrl('abc.def')).toBe(
      `https://ravi-front-ravi.p24cloud.ir${RAVI_MY_REVIEWS_PATH}?token=abc.def`,
    );
  });
});
