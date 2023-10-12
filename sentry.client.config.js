import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const SENTRY_DSN = publicRuntimeConfig.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.01,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
