export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { patchConsoleForReadableLogs, logger } = await import('./src/common/utils/logger');
  const { startSsrErrorDigest } = await import('./src/common/utils/ssrErrorTracker');

  patchConsoleForReadableLogs();
  startSsrErrorDigest();

  logger.success('Boot', 'Patient server logging ready', {
    nodeEnv: process.env.NODE_ENV,
    sentryEnv: process.env.SENTRY_ENVIRONMENT,
    pod: process.env.HOSTNAME,
  });
}
