/** Public patient label must be first name only (never family). */
export const toPatientFirstName = (raw?: string | null): string | undefined => {
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  // user_display_name historically is "نام نام‌خانوادگی"
  return trimmed.split(/\s+/)[0];
};
