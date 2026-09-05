/**
 * After a prior doctor-home session on this device, show new home immediately.
 * Callers must pass `deviceCached` from `useDoctorDeviceCached()` (layout-effect) —
 * do not read localStorage during render (hydration mismatch).
 */
export function shouldOptimisticallyShowNewDoctorHome(
  userId: string | null | undefined,
  options?: { memoryEnabledTrue?: boolean; deviceCached?: boolean },
): boolean {
  if (options?.deviceCached) return true;

  if (options?.memoryEnabledTrue) return true;

  if (userId == null || userId === '') return false;

  return false;
}
