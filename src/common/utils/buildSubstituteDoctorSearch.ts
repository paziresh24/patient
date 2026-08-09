export type SubstituteExpertise = {
  expertise_id?: number | null;
  expertise_name?: string | null;
  alias_title?: string | null;
};

/**
 * Search request behind the "most similar online doctor" card shown when a doctor has no turn.
 *
 * Why `ref` matters here (ghane finding #68):
 * APISIX only diverts a search request to the semantic-search service when it carries
 * `ref=search_suggestion_box_qs` (or `search_suggestion_box`). Without it the request goes straight
 * to raw SEAPI/PHP, where the query is never understood — no specialty signal is derived, so the
 * only ranking signal left is the doctor-city boost. In a low-supply city that made "being local"
 * outrank everything: an ophthalmologist's profile recommended a physical-medicine doctor.
 *
 * Measured on production 2026-08-09, same text + same city, one parameter apart:
 *   «متخصص چشم پزشکی» @bojnurd  no ref → 12,830 hits, top-3 = general surgery / obstetrics /
 *                                        physical medicine
 *                                with ref → 182 hits, top-3 = three ophthalmologists
 *   «متخصص پوست…» @yasuj        no ref → top-3 = surgery / neurosurgery / midwifery
 *                                with ref → top-3 = three dermatologists
 *
 * The doctor's city is deliberately KEPT: on the understood path the city is a scored boost
 * (0.8x the relevance sum), so local doctors still come first when the city has any — it just no
 * longer beats relevance. Same class as the یارا fix (khesht !70) on the same day.
 */
export const SUBSTITUTE_DOCTOR_SEARCH_REF = 'search_suggestion_box_qs';

/** Generic "دکترای پزشکی" row — never a useful search text on its own. */
const GENERIC_EXPERTISE_ID = 325;

export const buildSubstituteDoctorSearchText = (expertises?: SubstituteExpertise[] | null): string => {
  const list = expertises ?? [];
  const withAlias = list.find(item => item?.alias_title);
  if (withAlias?.alias_title) return withAlias.alias_title;
  const named = list.find(item => item?.expertise_id !== GENERIC_EXPERTISE_ID && item?.expertise_name);
  return named?.expertise_name ?? '';
};

export const buildSubstituteDoctorSearch = (expertises?: SubstituteExpertise[] | null, doctorCity?: string | null) => ({
  route: decodeURIComponent(doctorCity || 'ir'),
  query: {
    turn_type: 'consult',
    ref: SUBSTITUTE_DOCTOR_SEARCH_REF,
    text: buildSubstituteDoctorSearchText(expertises),
  },
});

export default buildSubstituteDoctorSearch;
