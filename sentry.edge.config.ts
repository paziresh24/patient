import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 1% of errors sent to Sentry
  sampleRate: 0.01,

  // 1% of performance transactions
  tracesSampleRate: 0.01,

  environment: process.env.NODE_ENV,
});
