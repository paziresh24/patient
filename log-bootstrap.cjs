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
  if (typeof value === 'string') return JSON.stringify(value.length > 200 ? value.slice(0, 200) + '…' : value);
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
  const meta = LEVEL[level];
  const time = paint(ANSI.dim, '[' + ts() + ']');
  const label = paint(meta.color + ANSI.bold, meta.label.padEnd(7, ' '));
  const src = paint(ANSI.cyan, '[' + source + ']');
  const msg = paint(meta.color, message);
  let line = time + ' ' + label + ' ' + src + ' ' + msg;
  if (fields && Object.keys(fields).length) {
    const rest = Object.assign({}, fields);
    if (rest.message === message) delete rest.message;
    const formatted = formatFields(rest);
    if (formatted) line += '  ' + paint(ANSI.dim, formatted);
  }
  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  stream.write(line + '\n');
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
  success: function (s, m, f) {
    writeLine('success', s, m, f);
  },
};

// Patch noisy Axios console.error dumps early.
const originals = {
  error: console.error.bind(console),
  warn: console.warn.bind(console),
};
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
function wrap(method, level) {
  return function () {
    const args = Array.prototype.slice.call(arguments);
    if (!args.some(isErrorLike)) {
      originals[method].apply(console, args);
      return;
    }
    const messageParts = [];
    let err;
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (isErrorLike(arg)) err = arg;
      else if (typeof arg === 'string') messageParts.push(arg);
    }
    writeLine(
      level,
      'Console',
      messageParts.join(' ').trim() || (err && err.message) || 'Unhandled error',
      err ? serializeError(err) : undefined,
    );
  };
}
console.error = wrap('error', 'error');
console.warn = wrap('warn', 'warn');

// SSR digest every 30m
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
