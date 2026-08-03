import axios from 'axios';
import getConfig from 'next/config';
import { normalizeProfileApiBearerToken } from './normalizeProfileApiBearerToken';

const isServer = typeof window === 'undefined';

export { normalizeProfileApiBearerToken } from './normalizeProfileApiBearerToken';

export function getProfileMicroserviceConfig() {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() ?? {};
  const baseURL = String(
    serverRuntimeConfig?.PROFILE_API_BASE_URL ??
      publicRuntimeConfig?.PROFILE_API_BASE_URL ??
      process.env.PROFILE_API_BASE_URL ??
      '',
  )
    .trim()
    .replace(/\/$/, '');
  const token = normalizeProfileApiBearerToken(
    String(
      serverRuntimeConfig?.PROFILE_API_TOKEN ??
        publicRuntimeConfig?.PROFILE_API_TOKEN ??
        process.env.PROFILE_API_TOKEN ??
        '',
    ),
  );

  // Local/dev allowlist override (comma-separated). Prefer GrowthBook in prod.
  const envSlugs = String(
    serverRuntimeConfig?.PROFILE_API_SOURCE_SLUGS ??
      publicRuntimeConfig?.PROFILE_API_SOURCE_SLUGS ??
      process.env.PROFILE_API_SOURCE_SLUGS ??
      '',
  )
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return { baseURL, token, envSlugs };
}

export function createProfileMicroserviceClient() {
  const { baseURL, token } = getProfileMicroserviceConfig();
  if (!baseURL) {
    throw new Error('PROFILE_API_BASE_URL is not configured');
  }
  if (!token) {
    throw new Error(
      'PROFILE_API_TOKEN is not configured. For API_AUTH_DRIVER=static use test|write|admin; for db mode use a key from php artisan apikey:create.',
    );
  }

  // Avoid top-level `http`/`https` imports — this module is reachable from the client graph.
  const agents =
    isServer
      ? {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          httpAgent: new (require('http').Agent)({ keepAlive: true, timeout: 15_000 }),
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          httpsAgent: new (require('https').Agent)({ keepAlive: true, timeout: 15_000 }),
        }
      : {};

  return axios.create({
    baseURL,
    timeout: 8000,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(isServer ? { 'Accept-Encoding': 'gzip, deflate', Connection: 'keep-alive' } : {}),
    },
    ...agents,
    validateStatus: status => status >= 200 && status < 300,
  });
}
