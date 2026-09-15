import { logger, serializeError } from './logger';

type SsrBucket = {
  count: number;
  sampleMessage: string;
  sampleEndpoint?: string;
  sampleStatus?: number;
  samplePath?: string;
};

const buckets = new Map<string, SsrBucket>();
let total = 0;
let digestTimer: ReturnType<typeof setInterval> | null = null;
let startedAt = Date.now();

const DIGEST_MS = Number(process.env.SSR_ERROR_DIGEST_MS || 30 * 60 * 1000);
const TOP_N = Number(process.env.SSR_ERROR_DIGEST_TOP || 10);

function bucketKey(err: unknown, context?: { path?: string; source?: string }): string {
  const s = serializeError(err);
  const status = s.statusCode ?? s.code ?? 'unknown';
  const endpoint = (s.endpoint as string) || 'n/a';
  const type = (s.type as string) || 'Error';
  const path = context?.path || 'n/a';
  const source = context?.source || 'SSR';
  const endpointPath = typeof endpoint === 'string' ? endpoint.split('?')[0] : String(endpoint);
  return `${source}|${type}|${status}|${endpointPath}|${path}`;
}

export function trackSsrError(
  err: unknown,
  context?: { path?: string; source?: string; message?: string },
): void {
  if (typeof window !== 'undefined') return;

  // Prefer process-level bootstrap tracker (node -r log-bootstrap.cjs) so digest is shared.
  const g = globalThis as typeof globalThis & {
    __trackSsrError?: (err: unknown, context?: { path?: string; source?: string; message?: string }) => void;
  };
  if (typeof g.__trackSsrError === 'function') {
    g.__trackSsrError(err, context);
    return;
  }

  const source = context?.source || 'SSR';
  const message = context?.message || (err instanceof Error ? err.message : 'SSR request failed');
  const serialized = serializeError(err);

  logger.error(source, message, {
    ...serialized,
    page: context?.path,
  });

  const key = bucketKey(err, context);
  const existing = buckets.get(key);
  if (existing) {
    existing.count += 1;
  } else {
    buckets.set(key, {
      count: 1,
      sampleMessage: message,
      sampleEndpoint: serialized.endpoint as string | undefined,
      sampleStatus: serialized.statusCode as number | undefined,
      samplePath: context?.path,
    });
  }
  total += 1;
}

function flushDigest(reason: 'interval' | 'shutdown' = 'interval'): void {
  if (typeof window !== 'undefined') return;

  const windowMinutes = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

  if (total === 0) {
    logger.info('SSR_Digest', 'No SSR errors in the last window', {
      windowMinutes,
      reason,
    });
    startedAt = Date.now();
    return;
  }

  const top = Array.from(buckets.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, TOP_N)
    .map(([key, b]) => {
      const [source, type, status, endpoint, path] = key.split('|');
      return {
        count: b.count,
        source,
        type,
        status,
        endpoint: b.sampleEndpoint || endpoint,
        page: b.samplePath || path,
        message: b.sampleMessage,
      };
    });

  logger.warn('SSR_Digest', `Top SSR errors in last ${windowMinutes}m`, {
    total,
    unique: buckets.size,
    top,
    reason,
  });

  buckets.clear();
  total = 0;
  startedAt = Date.now();
}

export function startSsrErrorDigest(): void {
  if (typeof window !== 'undefined') return;
  if (digestTimer) return;

  logger.info('SSR_Digest', 'SSR error digest started', {
    intervalMs: DIGEST_MS,
    topN: TOP_N,
  });

  digestTimer = setInterval(() => flushDigest('interval'), DIGEST_MS);
  if (typeof digestTimer === 'object' && digestTimer && 'unref' in digestTimer) {
    (digestTimer as NodeJS.Timeout).unref();
  }

  const shutdown = () => {
    flushDigest('shutdown');
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

export function getSsrErrorStatsForTests() {
  return { total, unique: buckets.size };
}
