/** Normalize drprofile `/users/:id/centers` payloads. `null` = unknown/failed (do not wipe identity). */
export const parseDoctorCenters = (data: unknown): unknown[] | null => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  for (const key of ['data', 'result', 'centers', 'items'] as const) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return null;
};
