/** Shared React Query defaults for doctor-home sections (stale-while-revalidate). */
export const DOCTOR_HOME_CACHE_TIME = 60 * 60 * 1000;

/**
 * Always refetch in the background when a section mounts / window focuses.
 * Cached (or persisted) data still renders immediately — only `isLoading` without data shows skeletons.
 */
export const doctorHomeQueryDefaults = {
  staleTime: 0,
  cacheTime: DOCTOR_HOME_CACHE_TIME,
  refetchOnMount: 'always' as const,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
} as const;

/** For queries keyed by date/center — keep showing previous slice while refetching. */
export const doctorHomeListQueryDefaults = {
  ...doctorHomeQueryDefaults,
  keepPreviousData: true,
} as const;

/** Skeleton only when there is nothing to show yet (never during background refetch). */
export const isQueryInitialLoading = (query: { isLoading: boolean; data?: unknown }) =>
  query.isLoading && query.data == null;
