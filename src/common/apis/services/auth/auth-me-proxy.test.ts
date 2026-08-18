import { authMeUpstreamUrl, pickAuthMeForwardHeaders } from './auth-me-proxy';

describe('auth/me same-origin proxy helpers', () => {
  it('points at the public gateway identity path', () => {
    expect(authMeUpstreamUrl('https://apigw.paziresh24.com/')).toBe('https://apigw.paziresh24.com/v1/auth/me');
    expect(authMeUpstreamUrl()).toBe('https://apigw.paziresh24.com/v1/auth/me');
  });

  it('forwards credential headers and drops empties', () => {
    expect(
      pickAuthMeForwardHeaders({
        authorization: 'Bearer abc',
        cookie: 'token=abc',
        acceptTimezone: 'Asia/Tehran',
      }),
    ).toEqual({
      Accept: 'application/json',
      Authorization: 'Bearer abc',
      Cookie: 'token=abc',
      'accept-timezone': 'Asia/Tehran',
    });
    expect(pickAuthMeForwardHeaders({})).toEqual({ Accept: 'application/json' });
  });
});
