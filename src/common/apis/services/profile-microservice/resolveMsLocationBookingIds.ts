const ONLINE_CONSULT_CENTER_ID = '5532';
const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isMsOnlineVisitLocation(loc: Pick<{ id?: unknown; name?: unknown }, 'id' | 'name'>): boolean {
  const id = loc?.id != null ? String(loc.id) : '';
  if (id === ONLINE_CONSULT_CENTER_ID) return true;
  return /ویزیت\s*آنلاین|online\s*visit|پذیرش\s*24/i.test(String(loc?.name ?? ''));
}

const pickId = (...candidates: unknown[]): string | null => {
  for (const value of candidates) {
    if (value == null || value === '') continue;
    return String(value);
  }
  return null;
};

/** MS internal location PK (e.g. 13) — not a drprofile center id. */
export function isInternalMsLocationPk(candidate: string | null, msLocationId: string | null): boolean {
  if (!candidate) return false;
  if (msLocationId && candidate === msLocationId) return true;
  return /^\d{1,8}$/.test(candidate);
}

export type MsLocationBookingIds = {
  /** drprofile / Saman center id when known */
  bookingCenterId: string | null;
  userCenterId: string | null;
  msLocationId: string | null;
};

/**
 * Resolve legacy booking ids from profiles-api location payload.
 * Backend should populate location.external_ids.center_id + user_center_id (UUID).
 */
export function resolveMsLocationBookingIds(loc: any): MsLocationBookingIds {
  const externalIds = (loc?.external_ids ?? {}) as Record<string, unknown>;
  const msLocationId = loc?.id != null ? String(loc.id) : null;
  const userCenterId = pickId(externalIds.user_center_id, loc?.user_center_id);

  if (isMsOnlineVisitLocation({ id: msLocationId, name: loc?.name })) {
    return {
      bookingCenterId: ONLINE_CONSULT_CENTER_ID,
      userCenterId,
      msLocationId,
    };
  }

  const bookingCenterId = pickId(
    externalIds.center_id,
    externalIds.paziresh_center_id,
    externalIds.center_uuid,
    externalIds.uuid,
    loc?.center_id,
    loc?.paziresh_center_id,
    loc?.uuid,
  );

  if (bookingCenterId && !isInternalMsLocationPk(bookingCenterId, msLocationId)) {
    return { bookingCenterId, userCenterId, msLocationId };
  }

  if (bookingCenterId && UUID_LIKE.test(bookingCenterId)) {
    return { bookingCenterId, userCenterId, msLocationId };
  }

  return { bookingCenterId: null, userCenterId, msLocationId };
}
