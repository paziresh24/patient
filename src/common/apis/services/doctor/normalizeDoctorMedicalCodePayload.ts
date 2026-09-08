/** Accept `{ medical_code }`, nested `{ data }`, or a raw string/number. */
export const normalizeDoctorMedicalCodePayload = (data: unknown): string => {
  if (typeof data === 'number' && Number.isFinite(data)) {
    return String(data);
  }
  if (typeof data === 'string') {
    return data.trim();
  }
  if (!data || typeof data !== 'object') {
    return '';
  }

  const record = data as Record<string, unknown>;
  const keys = ['medical_code', 'medicalCode', 'code'];
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value);
    }
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  const nested = record.data;
  if (nested && typeof nested === 'object') {
    return normalizeDoctorMedicalCodePayload(nested);
  }

  return '';
};
