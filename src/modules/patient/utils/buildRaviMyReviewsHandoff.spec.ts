import {
  buildRaviMyReviewsHandoffSrc,
  readRequestSessionToken,
  RAVI_MY_REVIEWS_HANDOFF_PATH,
} from './buildRaviMyReviewsHandoff';

describe('ravi my-reviews handoff', () => {
  it('keeps the iframe on the same origin so the httpOnly token cookie is sent', () => {
    expect(buildRaviMyReviewsHandoffSrc()).toBe(RAVI_MY_REVIEWS_HANDOFF_PATH);
    expect(buildRaviMyReviewsHandoffSrc().startsWith('http')).toBe(false);
  });

  it('reads the session token from the request cookie, not from client JS', () => {
    expect(readRequestSessionToken({ token: ' abc.def ' })).toBe('abc.def');
    expect(readRequestSessionToken({})).toBeUndefined();
    expect(readRequestSessionToken({ token: '' })).toBeUndefined();
  });
});
