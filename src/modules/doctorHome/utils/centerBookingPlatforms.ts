const str = (v: unknown) => (v != null && v !== '' ? String(v).trim() : undefined);

export type CenterBookingPlatform = {
  id: string;
  name: string;
  icon?: string;
};

const unwrapList = (raw: unknown): Record<string, unknown>[] => {
  if (Array.isArray(raw)) return raw.filter(item => item && typeof item === 'object') as Record<string, unknown>[];
  if (!raw || typeof raw !== 'object') return [];
  const root = raw as Record<string, unknown>;
  const nested = root.data;
  if (Array.isArray(nested)) return unwrapList(nested);
  if (nested && typeof nested === 'object') {
    const inner = nested as Record<string, unknown>;
    if (Array.isArray(inner.items)) return unwrapList(inner.items);
    if (Array.isArray(inner.data)) return unwrapList(inner.data);
    if (Array.isArray(inner.centers)) return unwrapList(inner.centers);
  }
  if (Array.isArray(root.items)) return unwrapList(root.items);
  if (Array.isArray(root.centers)) return unwrapList(root.centers);
  return [];
};

const parseMeta = (raw: unknown): Record<string, unknown> => {
  if (!raw) return {};
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
};

const parsePlatformItem = (raw: unknown): CenterBookingPlatform | null => {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    const name = str(raw);
    return name ? { id: name, name } : null;
  }
  if (typeof raw !== 'object' || Array.isArray(raw)) return null;
  const item = raw as Record<string, unknown>;
  const name =
    str(item.p_name) ??
    str(item.display_name) ??
    str(item.fa_name) ??
    str(item.title) ??
    str(item.name) ??
    str(item.key_name);
  if (!name) return null;
  const id = str(item.id) ?? str(item.name) ?? str(item.key_name) ?? name;
  const icon = str(item.icon) ?? str(item.logo) ?? str(item.logo_url) ?? str(item.image);
  return icon ? { id, name, icon } : { id, name };
};

const readCenterPlatforms = (center: Record<string, unknown>): CenterBookingPlatform[] => {
  const meta = parseMeta(center.meta_data);
  const buckets = [center.platforms, center.other_platforms, meta.platforms, meta.platform, meta.other_platforms];
  const items: CenterBookingPlatform[] = [];
  for (const bucket of buckets) {
    if (Array.isArray(bucket)) {
      for (const entry of bucket) {
        const parsed = parsePlatformItem(entry);
        if (parsed) items.push(parsed);
      }
    } else {
      const parsed = parsePlatformItem(bucket);
      if (parsed) items.push(parsed);
    }
  }
  return items;
};

const normalizePlatformKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[آأإ]/g, 'ا')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\s_\-‌]/g, '');

const isPaziresh24Platform = (platform: CenterBookingPlatform) => {
  const key = normalizePlatformKey(`${platform.id} ${platform.name}`);
  return key.includes('paziresh24') || key.includes('پذیرش24');
};

const centerMatchesSelection = (center: Record<string, unknown>, selectedCenterId: string) => {
  const ids = [center.id, center.center_id, center.user_center_id, center.external_id];
  return ids.some(id => id != null && String(id) === selectedCenterId);
};

export const collectCenterBookingPlatforms = (
  payload: unknown,
  selectedCenterId?: string | null,
): CenterBookingPlatform[] => {
  const centers = unwrapList(payload);
  const scoped = selectedCenterId
    ? centers.filter(center => centerMatchesSelection(center, selectedCenterId))
    : centers;

  const seen = new Set<string>();
  const platforms: CenterBookingPlatform[] = [];
  for (const center of scoped) {
    for (const platform of readCenterPlatforms(center)) {
      const key = platform.id.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      platforms.push(platform);
    }
  }
  return [
    ...platforms.filter(isPaziresh24Platform),
    ...platforms.filter(platform => !isPaziresh24Platform(platform)),
  ];
};
