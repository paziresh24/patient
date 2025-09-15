/*
 * New Relic agent configuration.
 * See lib/config/default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
const enabled = process.env.NEW_RELIC_ENABLED === 'true';

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'patient'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || '',
  distributed_tracing: {
    enabled: process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED !== 'false',
  },
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
  },
  agent_enabled: enabled,
  allow_all_headers: true,
  attributes: {
    enabled: true,
    include: ['request.*', 'http.*'],
  },
  application_logging: {
    enabled: true,
    forwarding: { enabled: true },
    metrics: { enabled: true },
  },
  transaction_tracer: { enabled: true },
  error_collector: { enabled: true },
  slow_sql: { enabled: true },
  // EU region collector host
  // Optional proxy, e.g. http://newrelic.paziresh24.com:10811
  proxy: process.env.NEW_RELIC_PROXY_URL || undefined,
};


