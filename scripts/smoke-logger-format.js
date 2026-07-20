/* Exact format mirror of src/common/utils/logger.ts (single line) */
const LEVEL = {
  error: { emoji: '🔴', label: 'ERROR' },
  warn: { emoji: '🟠', label: 'WARN' },
  info: { emoji: '🔵', label: 'INFO' },
  debug: { emoji: '⚪', label: 'DEBUG' },
  success: { emoji: '🟢', label: 'SUCCESS' },
};

function ts() {
  const d = new Date();
  return (
    [d.getHours(), d.getMinutes(), d.getSeconds()].map(n => String(n).padStart(2, '0')).join(':') +
    '.' +
    String(d.getMilliseconds()).padStart(3, '0')
  );
}

function formatValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

function line(level, source, message, fields) {
  const m = LEVEL[level];
  let out = `[${ts()}] ${m.emoji} ${m.label.padEnd(7, ' ')} [${source}] ${message}`;
  if (fields) {
    const rest = { ...fields };
    if (rest.message === message) delete rest.message;
    const kv = Object.entries(rest)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${formatValue(v)}`)
      .join(' ');
    if (kv) out += `  ${kv}`;
  }
  console.log(out);
}

line('error', 'API_Gateway', 'Upstream API request failed', {
  type: 'AxiosError',
  statusCode: 504,
  method: 'GET',
  endpoint: 'https://apigw.paziresh24.com/api/v1/sync',
  retryCount: 3,
});
line('warn', 'SSR_Digest', 'Top SSR errors in last 30m', {
  total: 42,
  unique: 5,
  top: [
    { count: 15, source: 'SamanAPI', status: '504', endpoint: 'https://saman.paziresh24.com/v1/doctors/.../availability-status' },
    { count: 8, source: 'DrProfileAPI', status: '500', endpoint: 'https://drprofile.paziresh24.com/api/full-profile' },
  ],
  reason: 'interval',
});
line('success', 'Boot', 'Patient server logging ready', {
  nodeEnv: 'production',
  sentryEnv: 'mobin',
  pod: 'patient-next-abc',
});
