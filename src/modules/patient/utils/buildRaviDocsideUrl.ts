const DEFAULT_RAVI_FRONT_BASE_URL = 'https://ravi-front-ravi.p24cloud.ir';

export const RAVI_DOCSIDE_PATH = '/ravi/v1/docside/';

export const buildRaviDocsideUrl = (token?: string): string => {
  const baseUrl = (process.env.NEXT_PUBLIC_RAVI_FRONT_BASE_URL || DEFAULT_RAVI_FRONT_BASE_URL).replace(
    /\/$/,
    '',
  );
  const url = new URL(RAVI_DOCSIDE_PATH, `${baseUrl}/`);
  const trimmed = String(token ?? '').trim();
  if (trimmed) {
    url.searchParams.set('token', trimmed);
  }
  return url.toString();
};
