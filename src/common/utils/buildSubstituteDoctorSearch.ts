export type SubstituteExpertise = {
  expertise_id?: number | null;
  expertise_name?: string | null;
  alias_title?: string | null;
};

/**
 * Search request behind the "most similar online doctor" card shown when a doctor has no turn.
 *
 * Why the route is always nationwide:
 * the card offers an ONLINE visit, and online-visit supply is nationwide — but the request used to
 * carry the profile doctor's own city, which the search engine applies as a *ranking boost*
 * (`optionalFilters=city_id,province_id`) on top of an uncoded query. Membership never changed
 * (same `total` with and without the city), so the only effect was ordering: in a low-supply city
 * the boost outranks text relevance and the top-3 fill up with locals from unrelated fields.
 *
 * Measured on production 2026-08-09 (ghane finding #68, promise K3):
 *   text="متخصص چشم پزشکی" + turn_type=consult
 *     route=ir       → top-3 all ophthalmologists
 *     route=bojnurd  → top-3 = general surgery / obstetrics / physical medicine, and the card
 *                      picked the physical-medicine doctor for an ophthalmologist's profile
 *   ES check: online-visit ophthalmologists nationwide = 109, in that province = 0
 *
 * So the city cannot be "fixed" by ranking here — for this card there is often no local doctor at
 * all. Dropping it is what matches the product promise; nothing else about the request changes.
 */
export const SUBSTITUTE_DOCTOR_ROUTE = 'ir';

/** Generic "دکترای پزشکی" row — never a useful search text on its own. */
const GENERIC_EXPERTISE_ID = 325;

export const buildSubstituteDoctorSearchText = (expertises?: SubstituteExpertise[] | null): string => {
  const list = expertises ?? [];
  const withAlias = list.find(item => item?.alias_title);
  if (withAlias?.alias_title) return withAlias.alias_title;
  const named = list.find(item => item?.expertise_id !== GENERIC_EXPERTISE_ID && item?.expertise_name);
  return named?.expertise_name ?? '';
};

export const buildSubstituteDoctorSearch = (expertises?: SubstituteExpertise[] | null) => ({
  route: SUBSTITUTE_DOCTOR_ROUTE,
  query: {
    turn_type: 'consult',
    text: buildSubstituteDoctorSearchText(expertises),
  },
});

export default buildSubstituteDoctorSearch;
