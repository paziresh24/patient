import * as Sentry from '@sentry/nextjs';
import { patchConsoleForReadableLogs, logger } from './src/common/utils/logger';
import { startSsrErrorDigest } from './src/common/utils/ssrErrorTracker';

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // 1% of errors sent to Sentry
  sampleRate: 0.01,

  // 1% of performance transactions
  tracesSampleRate: 0.01,

  environment: process.env.NODE_ENV,
});

// Readable single-line server logs (ANSI).
// Bootstrapped here because @sentry/nextjs injects this file on the Node server
// (Next production build was not emitting instrumentation.js).
patchConsoleForReadableLogs();
startSsrErrorDigest();
logger.success('Boot', 'Patient server logging ready', {
  nodeEnv: process.env.NODE_ENV,
  sentryEnv: process.env.SENTRY_ENVIRONMENT,
  pod: process.env.HOSTNAME,
  via: 'sentry.server.config',
});
