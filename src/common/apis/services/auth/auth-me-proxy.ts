type ForwardInput = {
  authorization?: string;
  cookie?: string;
  acceptTimezone?: string;
};

export function authMeUpstreamUrl(base?: string): string {
  const trimmed = (base || 'https://apigw.paziresh24.com').replace(/\/$/, '');
  return `${trimmed}/v1/auth/me`;
}

export function pickAuthMeForwardHeaders(input: ForwardInput): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (input.authorization) headers.Authorization = input.authorization;
  if (input.cookie) headers.Cookie = input.cookie;
  if (input.acceptTimezone) headers['accept-timezone'] = input.acceptTimezone;
  return headers;
}
