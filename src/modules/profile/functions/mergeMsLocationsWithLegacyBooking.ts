type CenterLike = {
  id?: string | number | null;
  name?: string | null;
  address?: string | null;
  display_number?: string | string[] | null;
  tell?: string | string[] | null;
  city?: any;
  city_en_slug?: string | null;
  province?: any;
  map?: { lat?: number; lon?: number } | null;
  location?: { lat?: number; lon?: number } | null;
  center_type?: number | null;
  type_id?: number | null;
  status?: number | null;
  server_id?: number | string | null;
  user_center_id?: string | null;
  services?: any[];
  freeturn?: any;
  freeturn_text?: any;
  freeturns_info?: any;
  settings?: any;
  [key: string]: any;
};

function asPhoneArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value
      .split('|')
      .map(part => part.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeName(name?: string | null): string {
  return (name ?? '')
    .replace(/\s+/g, ' ')
    .replace(/^مطب\s+/u, '')
    .trim()
    .toLowerCase();
}

function cityName(center: CenterLike): string | null {
  if (typeof center.city === 'string') return center.city;
  if (center.city && typeof center.city === 'object') return center.city.name ?? null;
  return null;
}

export function isOnlineLocation(center: CenterLike): boolean {
  const id = center?.id != null ? String(center.id) : '';
  if (id === '5532') return true;
  return /ویزیت\s*آنلاین|online\s*visit|پذیرش\s*24/i.test(String(center?.name ?? ''));
}

export function isLikelyOfficeCenter(center: CenterLike): boolean {
  if (isOnlineLocation(center)) return false;
  const id = center?.id != null ? String(center.id) : '';
  if (!id) return false;
  const type = center.center_type ?? center.type_id;
  if (type != null) return Number(type) === 1;
  const name = String(center.name ?? '');
  return /مطب|کلینیک|دفتر/u.test(name);
}

/**
 * Match MS location → legacy center for booking hydrate (services/freeturn).
 * Prefer id / user_center_id, then online→5532, then name, then single-office pair.
 */
export function findLegacyCenterForMsLocation(
  msCenter: CenterLike,
  legacyCenters: CenterLike[],
  options?: { allowSingleOfficePair?: boolean },
): CenterLike | null {
  if (!Array.isArray(legacyCenters) || legacyCenters.length === 0) return null;

  const msId = msCenter?.id != null ? String(msCenter.id) : '';
  if (msId) {
    const byId = legacyCenters.find(center => String(center?.id) === msId);
    if (byId) return byId;
  }

  const msUserCenterId = msCenter?.user_center_id != null ? String(msCenter.user_center_id) : '';
  if (msUserCenterId) {
    const byUserCenter = legacyCenters.find(center => String(center?.user_center_id) === msUserCenterId);
    if (byUserCenter) return byUserCenter;
  }

  if (isOnlineLocation(msCenter)) {
    const consult = legacyCenters.find(center => String(center?.id) === '5532');
    if (consult) return consult;
  }

  const msName = normalizeName(msCenter?.name);
  if (msName) {
    const byName = legacyCenters.find(center => normalizeName(center?.name) === msName);
    if (byName) return byName;
  }

  if (options?.allowSingleOfficePair && isLikelyOfficeCenter(msCenter)) {
    const offices = legacyCenters.filter(isLikelyOfficeCenter);
    if (offices.length === 1) return offices[0];
  }

  return null;
}

/**
 * Address/phone/name/map from microservice locations; booking fields from legacy full-profile.
 * Only MS locations are shown (new backend is source of truth for address UI).
 */
export function mergeMsLocationsWithLegacyBooking(
  msCenters: CenterLike[],
  legacyCenters: CenterLike[] | null | undefined,
): CenterLike[] {
  const legacy = Array.isArray(legacyCenters) ? legacyCenters : [];
  if (!Array.isArray(msCenters) || msCenters.length === 0) {
    // No MS locations yet — keep legacy so booking does not disappear entirely.
    return legacy;
  }

  const msOffices = msCenters.filter(isLikelyOfficeCenter);
  const legacyOffices = legacy.filter(isLikelyOfficeCenter);
  const allowSingleOfficePair = msOffices.length === 1 && legacyOffices.length === 1;

  return msCenters.map(ms => {
    const phones = asPhoneArray(ms.display_number?.length ? ms.display_number : ms.tell);
    const legacyMatch = findLegacyCenterForMsLocation(ms, legacy, { allowSingleOfficePair });
    const city = cityName(ms) ?? (legacyMatch ? cityName(legacyMatch) : null);
    const map =
      ms.map ??
      (ms.location ? { lat: ms.location.lat, lon: ms.location.lon } : null) ??
      legacyMatch?.map ??
      null;

    if (!legacyMatch) {
      return {
        ...ms,
        display_number: phones,
        display_number_array: phones,
        tell: phones,
        tell_array: phones,
        city,
        city_en_slug: ms.city_en_slug ?? (typeof ms.city === 'object' ? ms.city?.slug : null),
        province: ms.province ?? (typeof ms.city === 'object' ? ms.city?.province?.name : null),
        map,
        center_type: isOnlineLocation(ms) ? 1 : ms.center_type ?? ms.type_id ?? 1,
        type_id: isOnlineLocation(ms) ? 1 : ms.type_id ?? ms.center_type ?? 1,
        id: isOnlineLocation(ms) ? '5532' : ms.id,
        services: Array.isArray(ms.services) ? ms.services : [],
      };
    }

    // Keep legacy id for booking APIs; surface MS address/phone.
    return {
      ...legacyMatch,
      name: ms.name || legacyMatch.name,
      address: ms.address ?? legacyMatch.address,
      display_number: phones.length ? phones : asPhoneArray(legacyMatch.display_number ?? legacyMatch.tell),
      display_number_array: phones.length ? phones : asPhoneArray(legacyMatch.display_number_array ?? legacyMatch.tell_array),
      tell: phones.length ? phones : asPhoneArray(legacyMatch.tell ?? legacyMatch.display_number),
      tell_array: phones.length ? phones : asPhoneArray(legacyMatch.tell_array ?? legacyMatch.display_number_array),
      city: city ?? legacyMatch.city,
      city_en_slug: ms.city_en_slug ?? legacyMatch.city_en_slug,
      province: ms.province ?? legacyMatch.province,
      map,
      center_type: ms.center_type ?? ms.type_id ?? legacyMatch.center_type ?? legacyMatch.type_id,
      type_id: ms.type_id ?? ms.center_type ?? legacyMatch.type_id ?? legacyMatch.center_type,
      status: ms.status ?? legacyMatch.status,
      // booking hydrate from legacy
      id: legacyMatch.id,
      user_center_id: legacyMatch.user_center_id,
      services: legacyMatch.services ?? [],
      freeturn: legacyMatch.freeturn,
      freeturn_text: legacyMatch.freeturn_text,
      freeturns_info: legacyMatch.freeturns_info,
      settings: legacyMatch.settings,
      server_id: legacyMatch.server_id ?? ms.server_id,
      ms_location_id: ms.id,
    };
  });
}
