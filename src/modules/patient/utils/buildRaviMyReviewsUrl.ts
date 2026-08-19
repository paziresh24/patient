const DEFAULT_RAVI_FRONT_BASE_URL = 'https://ravi-front-ravi.p24cloud.ir';

export const RAVI_MY_REVIEWS_PATH = '/ravi/v2/my-reviews';

export const buildRaviMyReviewsUrl = (token?: string): string => {
  const baseUrl = (process.env.NEXT_PUBLIC_RAVI_FRONT_BASE_URL || DEFAULT_RAVI_FRONT_BASE_URL).replace(
    /\/$/,
    '',
  );
  const url = new URL(RAVI_MY_REVIEWS_PATH, `${baseUrl}/`);
  const trimmed = String(token ?? '').trim();
  if (trimmed) {
    url.searchParams.set('token', trimmed);
  }
  return url.toString();
};
