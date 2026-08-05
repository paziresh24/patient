/** Accept flat `{ biography }` or wrapped `{ data: { biography } }` payloads. */
export const normalizeDoctorBiographyPayload = (data: unknown): string => {
  if (typeof data === 'string') {
    return data.trim() ? data : '';
  }
  if (!data || typeof data !== 'object') {
    return '';
  }
  const record = data as Record<string, unknown>;
  const direct = record.biography;
  if (typeof direct === 'string' && direct.trim()) {
    return direct;
  }
  const nested = record.data;
  if (nested && typeof nested === 'object') {
    const nestedBio = (nested as Record<string, unknown>).biography;
    if (typeof nestedBio === 'string' && nestedBio.trim()) {
      return nestedBio;
    }
  }
  return '';
};
