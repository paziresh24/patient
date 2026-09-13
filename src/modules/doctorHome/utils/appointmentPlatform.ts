const str = (v: unknown) => (v != null && v !== '' ? String(v).trim() : undefined);

const readPlatformObject = (platform: Record<string, unknown>) => {
  const label =
    str(platform.p_name) ??
    str(platform.display_name) ??
    str(platform.fa_name) ??
    str(platform.title) ??
    str(platform.name) ??
    str(platform.key_name);
  const icon = str(platform.icon) ?? str(platform.logo) ?? str(platform.logo_url);
  return icon ? { label, icon } : { label };
};

/** پلتفرم ثبت نوبت از خروجی allbooks (مثل نلسون) */
export const readAppointmentPlatform = (
  raw: Record<string, unknown>,
): { label?: string; icon?: string } => {
  const nested = raw.platform;
  if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
    return readPlatformObject(nested as Record<string, unknown>);
  }
  if (typeof nested === 'string' && nested.trim()) {
    const trimmed = nested.trim();
    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>;
        if (parsed && typeof parsed === 'object') return readPlatformObject(parsed);
      } catch {
        /* plain name */
      }
    }
    return { label: trimmed };
  }

  const label =
    str(raw.platform_name) ??
    str(raw.source_site) ??
    str(raw.site_name) ??
    str(raw.booking_channel);
  return { label };
};
