import { DOCTOR_HOME_CACHE_TIME } from './doctorHomeQuery';
import { dehydrate, hydrate, QueryClient, type Query } from '@tanstack/react-query';

const STORAGE_KEY = 'p24-doctor-home-rq-v1';
const PERSIST_VERSION = 1;

type PersistedBlob = {
  version: number;
  userId: string | null;
  savedAt: number;
  clientState: ReturnType<typeof dehydrate>;
};

const PERSISTABLE_ROOT_KEYS = [
  'doctorHome',
  'getNotifications',
  'hamdast-app-catalog',
  'getWidgets',
  'feedbacks',
  'appointmentsCount',
  'holidays',
  'vacations',
] as const;

const PERSISTABLE_ROOT_KEY_SET = new Set<string>(PERSISTABLE_ROOT_KEYS);

export const isDoctorHomePersistableQuery = (query: Query) => {
  if (query.state.status !== 'success') return false;
  const root = query.queryKey[0];
  return typeof root === 'string' && PERSISTABLE_ROOT_KEY_SET.has(root);
};

export const clearDoctorHomePersistedCache = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore quota / private mode
  }
};

export const removeDoctorHomeQueries = (queryClient: QueryClient) => {
  for (const root of PERSISTABLE_ROOT_KEYS) {
    queryClient.removeQueries({ queryKey: [root] });
  }
};

const readBlob = (): PersistedBlob | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedBlob;
    if (parsed?.version !== PERSIST_VERSION || !parsed.clientState) return null;
    if (Date.now() - parsed.savedAt > DOCTOR_HOME_CACHE_TIME) return null;
    return parsed;
  } catch {
    return null;
  }
};

/** Restore last doctor-home cache before first paint of sections. */
export const restoreDoctorHomeQueryCache = (queryClient: QueryClient) => {
  const blob = readBlob();
  if (!blob) return null;
  try {
    hydrate(queryClient, blob.clientState);
    // Keep showing restored data, but mark for background refresh as soon as observers mount.
    queryClient.invalidateQueries({
      predicate: isDoctorHomePersistableQuery,
      refetchType: 'none',
    });
    return blob.userId;
  } catch {
    clearDoctorHomePersistedCache();
    return null;
  }
};

/**
 * If a different user is now logged in, drop the previous user's cached doctor-home data.
 * Same user / first load: keep hydrated cache and show immediately.
 */
export const reconcileDoctorHomeCacheUser = (queryClient: QueryClient, userId: string) => {
  const blob = readBlob();
  if (blob?.userId && blob.userId !== userId) {
    removeDoctorHomeQueries(queryClient);
    clearDoctorHomePersistedCache();
  }
};

let persistTimer: ReturnType<typeof setTimeout> | null = null;

export const schedulePersistDoctorHomeQueryCache = (
  queryClient: QueryClient,
  userId?: string | number | null,
) => {
  if (typeof window === 'undefined') return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      const clientState = dehydrate(queryClient, {
        shouldDehydrateQuery: isDoctorHomePersistableQuery,
      });
      if (!clientState.queries?.length) return;

      const blob: PersistedBlob = {
        version: PERSIST_VERSION,
        userId: userId != null ? String(userId) : readBlob()?.userId ?? null,
        savedAt: Date.now(),
        clientState,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blob));
    } catch {
      // ignore quota / private mode
    }
  }, 400);
};
