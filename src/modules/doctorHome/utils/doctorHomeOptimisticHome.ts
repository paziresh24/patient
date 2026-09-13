/**
 * Optimistic **new** doctor home only when this user already resolved
 * `doctor-home:enable` as true (memory latch or persisted flag).
 * Device cache means "is a doctor", not "has the new-home flag".
 */
export function shouldOptimisticallyShowNewDoctorHome(
  userId: string | null | undefined,
  options?: { memoryEnabledTrue?: boolean; persistedEnabledTrue?: boolean; deviceCached?: boolean },
): boolean {
  if (options?.memoryEnabledTrue || options?.persistedEnabledTrue) return true;

  if (userId == null || userId === '') return false;

  return false;
}
