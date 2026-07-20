/* eslint-disable */
'use strict';

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

function colorEnabled() {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR && process.env.FORCE_COLOR !== '0') return true;
  return true;
}

function paint(color, text) {
  if (!colorEnabled()) return text;
  return color + text + ANSI.reset;
}

function ts() {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, '0') +
    ':' +
    String(d.getMinutes()).padStart(2, '0') +
    ':' +
    String(d.getSeconds()).padStart(2, '0') +
    '.' +
    String(d.getMilliseconds()).padStart(3, '0')
  );
}

function formatValue(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    const truncated = value.length > 200 ? value.slice(0, 200) + '…' : value;
    return JSON.stringify(truncated);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    const s = JSON.stringify(value);
    return s.length > 300 ? s.slice(0, 300) + '…' : s;
  } catch (_) {
    return '"[unserializable]"';
  }
}

function formatFields(fields) {
  return Object.keys(fields)
    .filter(function (k) {
      return fields[k] !== undefined;
    })
    .map(function (k) {
      return k + '=' + formatValue(fields[k]);
    })
    .join(' ');
}

function writeLine(level, source, message, fields) {
  const meta = LEVEL[level] || LEVEL.info;
  const time = paint(ANSI.dim, '[' + ts() + ']');
  const label = paint(meta.color + ANSI.bold, meta.label.padEnd(7, ' '));
  const src = paint(ANSI.cyan, '[' + source + ']');
  const msg = paint(meta.color, message || '');
  let line = time + ' ' + label + ' ' + src + ' ' + msg;
  if (fields && Object.keys(fields).length) {
    const rest = Object.assign({}, fields);
    if (rest.message === message) delete rest.message;
    const formatted = formatFields(rest);
    if (formatted) line += '  ' + paint(ANSI.dim, formatted);
  }
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  stream.write(line.trimEnd() + '\n');
}

function isErrorLike(a) {
  return (
    a instanceof Error ||
    (a && typeof a === 'object' && (a.isAxiosError === true || a.name === 'AxiosError'))
  );
}

function serializeError(err) {
  if (!err || typeof err !== 'object') return { message: String(err) };
  if (err.isAxiosError || err.name === 'AxiosError') {
    const base = (err.config && err.config.baseURL) || '';
    const path = (err.config && err.config.url) || '';
    const url =
      base && path && String(path).indexOf('http') !== 0
        ? String(base).replace(/\/$/, '') + '/' + String(path).replace(/^\//, '')
        : path || base;
    return {
      type: 'AxiosError',
      message: err.message,
      code: err.code,
      statusCode: err.response && err.response.status,
      method: err.config && err.config.method && String(err.config.method).toUpperCase(),
      endpoint: url,
    };
  }
  return { type: err.name || 'Error', message: err.message };
}

function stripNoise(text) {
  return String(text)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
    .replace(/[🔍⚠️❌✅]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseConsoleArgs(args) {
  const strings = [];
  const fields = {};
  let dataIndex = 0;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg == null) continue;
    if (typeof arg === 'string') {
      const cleaned = stripNoise(arg);
      if (cleaned) strings.push(cleaned);
    } else if (typeof arg === 'number' || typeof arg === 'boolean') {
      if (strings.length === 0 && fields.value === undefined) fields.value = arg;
      else fields['v' + dataIndex++] = arg;
    } else if (isErrorLike(arg)) {
      Object.assign(fields, serializeError(arg));
    } else {
      const key = dataIndex === 0 ? 'data' : 'data' + dataIndex;
      fields[key] = arg;
      dataIndex++;
    }
  }
  let message = strings.join(' ').trim();
  // Drop trailing colon leftovers like "slug:"
  message = message.replace(/:\s*$/, '').trim();
  if (!message) {
    if (fields.message) message = String(fields.message);
    else if (fields.type === 'AxiosError') message = 'Upstream API request failed';
    else if (fields.data !== undefined) message = 'data';
    else message = 'log';
  }
  return { message: message, fields: fields };
}

global.__patientLogger = {
  error: function (s, m, f) {
    writeLine('error', s, m, f);
  },
  warn: function (s, m, f) {
    writeLine('warn', s, m, f);
  },
  info: function (s, m, f) {
    writeLine('info', s, m, f);
  },
  debug: function (s, m, f) {
    writeLine('debug', s, m, f);
  },
  success: function (s, m, f) {
    writeLine('success', s, m, f);
  },
};

const originals = {
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  log: console.log.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
};

let reentrancy = false;
function wrap(method, level) {
  return function () {
    if (reentrancy) {
      originals[method].apply(console, arguments);
      return;
    }
    reentrancy = true;
    try {
      const args = Array.prototype.slice.call(arguments);
      // Ignore empty noise
      if (args.length === 0) return;
      const parsed = parseConsoleArgs(args);
      // Skip blank Next.js console.log() noise
      if (
        parsed.message === 'log' &&
        (!parsed.fields || Object.keys(parsed.fields).length === 0)
      ) {
        return;
      }
      if (!parsed.message && (!parsed.fields || !Object.keys(parsed.fields).length)) {
        return;
      }
      writeLine(level, 'App', parsed.message, parsed.fields);
    } finally {
      reentrancy = false;
    }
  };
}

console.error = wrap('error', 'error');
console.warn = wrap('warn', 'warn');
console.log = wrap('log', 'info');
console.info = wrap('info', 'info');
console.debug = wrap('debug', 'debug');

const buckets = new Map();
let total = 0;
let startedAt = Date.now();
const DIGEST_MS = Number(process.env.SSR_ERROR_DIGEST_MS || 30 * 60 * 1000);
const TOP_N = Number(process.env.SSR_ERROR_DIGEST_TOP || 10);

global.__trackSsrError = function (err, context) {
  context = context || {};
  const source = context.source || 'SSR';
  const message = context.message || (err && err.message) || 'SSR request failed';
  const serialized = serializeError(err);
  writeLine('error', source, message, Object.assign({}, serialized, { page: context.path }));
  const endpoint = serialized.endpoint || 'n/a';
  const key = [
    source,
    serialized.type || 'Error',
    serialized.statusCode || serialized.code || 'unknown',
    String(endpoint).split('?')[0],
    context.path || 'n/a',
  ].join('|');
  const existing = buckets.get(key);
  if (existing) existing.count += 1;
  else
    buckets.set(key, {
      count: 1,
      sampleMessage: message,
      sampleEndpoint: serialized.endpoint,
      samplePath: context.path,
    });
  total += 1;
};

function flushDigest(reason) {
  const windowMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  if (total === 0) {
    writeLine('info', 'SSR_Digest', 'No SSR errors in the last window', {
      windowMinutes: windowMinutes,
      reason: reason,
    });
    startedAt = Date.now();
    return;
  }
  const top = Array.from(buckets.entries())
    .sort(function (a, b) {
      return b[1].count - a[1].count;
    })
    .slice(0, TOP_N)
    .map(function (entry) {
      const key = entry[0];
      const b = entry[1];
      const parts = key.split('|');
      return {
        count: b.count,
        source: parts[0],
        type: parts[1],
        status: parts[2],
        endpoint: b.sampleEndpoint || parts[3],
        page: b.samplePath || parts[4],
        message: b.sampleMessage,
      };
    });
  writeLine('warn', 'SSR_Digest', 'Top SSR errors in last ' + windowMinutes + 'm', {
    total: total,
    unique: buckets.size,
    top: top,
    reason: reason,
  });
  buckets.clear();
  total = 0;
  startedAt = Date.now();
}

const timer = setInterval(function () {
  flushDigest('interval');
}, DIGEST_MS);
if (timer && typeof timer.unref === 'function') timer.unref();
process.once('SIGTERM', function () {
  flushDigest('shutdown');
});
process.once('SIGINT', function () {
  flushDigest('shutdown');
});

writeLine('success', 'Boot', 'Patient server logging ready', {
  nodeEnv: process.env.NODE_ENV,
  sentryEnv: process.env.SENTRY_ENVIRONMENT,
  pod: process.env.HOSTNAME,
  via: 'log-bootstrap.cjs',
});
writeLine('info', 'SSR_Digest', 'SSR error digest started', {
  intervalMs: DIGEST_MS,
  topN: TOP_N,
});
