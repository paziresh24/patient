type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'success';

type LogFields = Record<string, unknown>;

const LEVEL_META: Record<LogLevel, { emoji: string; label: string }> = {
  error: { emoji: '🔴', label: 'ERROR' },
  warn: { emoji: '🟠', label: 'WARN' },
  info: { emoji: '🔵', label: 'INFO' },
  debug: { emoji: '⚪', label: 'DEBUG' },
  success: { emoji: '🟢', label: 'SUCCESS' },
};

const isServer = typeof window === 'undefined';

function timeStamp(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${hh}:${mm}:${ss}.${ms}`;
}

function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    const truncated = value.length > 200 ? `${value.slice(0, 200)}…` : value;
    return JSON.stringify(truncated);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  try {
    const s = JSON.stringify(value);
    return s.length > 300 ? `${s.slice(0, 300)}…` : s;
  } catch {
    return '"[unserializable]"';
  }
}

/** Compact `key=value key=value` — no repeated "Object" wrapper. */
function formatFields(fields: LogFields): string {
  return Object.entries(fields)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${formatValue(v)}`)
    .join(' ');
}

export function serializeError(err: unknown): LogFields {
  if (err == null) return { message: String(err) };
  if (typeof err === 'string') return { message: err };

  const e = err as {
    isAxiosError?: boolean;
    name?: string;
    message?: string;
    code?: string;
    stack?: string;
    config?: { method?: string; url?: string; baseURL?: string };
    response?: { status?: number; data?: unknown };
    cause?: unknown;
  };

  if (e.isAxiosError || e.name === 'AxiosError') {
    const base = e.config?.baseURL ?? '';
    const path = e.config?.url ?? '';
    const url =
      base && path && !String(path).startsWith('http')
        ? `${String(base).replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`
        : path || base;
    return {
      type: 'AxiosError',
      message: e.message,
      code: e.code,
      statusCode: e.response?.status,
      method: e.config?.method?.toUpperCase(),
      endpoint: url,
      responseData: summarizeValue(e.response?.data),
    };
  }

  if (err instanceof Error || (e.message && e.name)) {
    const out: LogFields = {
      type: e.name || 'Error',
      message: e.message,
    };
    if (e.code) out.code = e.code;
    if (e.cause) out.cause = serializeError(e.cause);
    if (process.env.LOG_STACK === 'true' && e.stack) {
      out.stack = String(e.stack).split('\n').slice(0, 4).join(' | ');
    }
    return out;
  }

  if (typeof err === 'object') return err as LogFields;
  return { message: String(err) };
}

function summarizeValue(value: unknown): unknown {
  if (value == null) return value;
  if (typeof value === 'string') return value.length > 160 ? `${value.slice(0, 160)}…` : value;
  if (typeof value !== 'object') return value;
  try {
    const s = JSON.stringify(value);
    if (s.length > 240) return `${s.slice(0, 240)}…`;
    return value;
  } catch {
    return '[unserializable]';
  }
}

/**
 * Single-line format:
 * [14:22:05.123] 🔴 ERROR [SamanAPI] Upstream failed  statusCode=504 endpoint="..."
 */
function writeLine(level: LogLevel, source: string, message: string, fields?: LogFields): void {
  const meta = LEVEL_META[level];
  const label = meta.label.padEnd(7, ' ');
  let line = `[${timeStamp()}] ${meta.emoji} ${label} [${source}] ${message}`;
  if (fields && Object.keys(fields).length > 0) {
    // Avoid duplicating message key when it matches the human message.
    const rest = { ...fields };
    if (typeof rest.message === 'string' && rest.message === message) {
      delete rest.message;
    }
    const formatted = formatFields(rest);
    if (formatted) line += `  ${formatted}`;
  }
  line += '\n';

  const stream = level === 'error' || level === 'warn' ? process.stderr : process.stdout;
  if (isServer && stream?.write) {
    stream.write(line);
    return;
  }

  // eslint-disable-next-line no-console
  if (level === 'error') console.error(line.trimEnd());
  // eslint-disable-next-line no-console
  else if (level === 'warn') console.warn(line.trimEnd());
  // eslint-disable-next-line no-console
  else console.log(line.trimEnd());
}

export const logger = {
  error(source: string, message: string, fields?: LogFields) {
    writeLine('error', source, message, fields);
  },
  warn(source: string, message: string, fields?: LogFields) {
    writeLine('warn', source, message, fields);
  },
  info(source: string, message: string, fields?: LogFields) {
    writeLine('info', source, message, fields);
  },
  debug(source: string, message: string, fields?: LogFields) {
    if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV !== 'production') {
      writeLine('debug', source, message, fields);
    }
  },
  success(source: string, message: string, fields?: LogFields) {
    writeLine('success', source, message, fields);
  },
  exception(source: string, message: string, err: unknown, extra?: LogFields) {
    writeLine('error', source, message, { ...serializeError(err), ...extra });
  },
};

type ConsoleMethod = 'error' | 'warn' | 'log' | 'info' | 'debug';

let consolePatched = false;

export function patchConsoleForReadableLogs(): void {
  if (!isServer || consolePatched) return;
  consolePatched = true;

  const originals: Record<ConsoleMethod, (...args: unknown[]) => void> = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    log: console.log.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
  };

  const isErrorLike = (a: unknown): boolean =>
    a instanceof Error ||
    (!!a &&
      typeof a === 'object' &&
      ((a as { isAxiosError?: boolean }).isAxiosError === true ||
        (a as { name?: string }).name === 'AxiosError'));

  const wrap =
    (method: ConsoleMethod, level: LogLevel) =>
    (...args: unknown[]) => {
      const hasErrorObject = args.some(isErrorLike);
      if (!hasErrorObject) {
        originals[method](...args);
        return;
      }

      const messageParts: string[] = [];
      let err: unknown;
      const extra: LogFields = {};

      for (const arg of args) {
        if (isErrorLike(arg)) err = arg;
        else if (typeof arg === 'string') messageParts.push(arg);
        else if (arg && typeof arg === 'object') Object.assign(extra, arg as LogFields);
        else if (arg != null) messageParts.push(String(arg));
      }

      writeLine(
        level,
        'Console',
        messageParts.join(' ').trim() || (err instanceof Error ? err.message : 'Unhandled error'),
        err ? { ...serializeError(err), ...extra } : extra,
      );
    };

  console.error = wrap('error', 'error') as typeof console.error;
  console.warn = wrap('warn', 'warn') as typeof console.warn;
}

export default logger;
