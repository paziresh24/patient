/* Exact format mirror of src/common/utils/logger.ts (ANSI colors, no emoji) */
const ANSI = {
  reset: '\u001b[0m',
  bold: '\u001b[1m',
  dim: '\u001b[2m',
  red: '\u001b[31m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  cyan: '\u001b[36m',
  green: '\u001b[32m',
  gray: '\u001b[90m',
};
const LEVEL = {
  error: { label: 'ERROR', color: ANSI.red },
  warn: { label: 'WARN', color: ANSI.yellow },
  info: { label: 'INFO', color: ANSI.blue },
  debug: { label: 'DEBUG', color: ANSI.gray },
  success: { label: 'SUCCESS', color: ANSI.green },
};

function paint(color, text) {
  return `${color}${text}${ANSI.reset}`;
}
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
  let out =
    paint(ANSI.dim, `[${ts()}]`) +
    ' ' +
    paint(m.color + ANSI.bold, m.label.padEnd(7, ' ')) +
    ' ' +
    paint(ANSI.cyan, `[${source}]`) +
    ' ' +
    paint(m.color, message);
  if (fields) {
    const rest = { ...fields };
    if (rest.message === message) delete rest.message;
    const kv = Object.entries(rest)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${formatValue(v)}`)
      .join(' ');
    if (kv) out += `  ${paint(ANSI.dim, kv)}`;
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
    { count: 15, source: 'SamanAPI', status: '504' },
    { count: 8, source: 'DrProfileAPI', status: '500' },
  ],
  reason: 'interval',
});
line('info', 'ThemeEngine', 'Applying dark mode layout configuration', { mode: 'dark' });
line('debug', 'MediaFetcher', 'Retrieving categorized media lists', { category: 'audio_mixes', cached: false });
line('success', 'Boot', 'Patient server logging ready', { nodeEnv: 'production' });
