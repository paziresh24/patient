/**
 * Predicate for the `search_top_suggested_card_view` impression event (DR-07).
 *
 * The card is rendered from `promoted_online_visit`, which the backend now
 * returns inside the primary search response. The impression event must fire
 * only when a promoted doctor is actually on screen, which means:
 *
 *   1. there is a promoted result with a usable title, and
 *   2. it is not the same doctor already sitting at the top of the normal
 *      result list — the backend dedups, but a stale/partial client payload
 *      can still line them up, and double-counting an impression against a
 *      doctor the user was going to see anyway makes the CTR denominator lie.
 *
 * This lives in `src/` rather than inline in the generated Plasmic component
 * so it can be unit-tested and reviewed. The previous inline version was
 * gated on `document.querySelector('.top-suggested-card')`, which could never
 * match: CSS Modules hashes that class name at build time, so the selector
 * silently returned null and the event never fired at all.
 */

const MIN_TITLE_LENGTH = 3;

export type SearchLikeResponse =
  | {
      search?: {
        result?: Array<{ title?: string } | null | undefined> | null;
      } | null;
    }
  | null
  | undefined;

const topTitle = (response: SearchLikeResponse): string | undefined => {
  const title = response?.search?.result?.[0]?.title;

  return typeof title === 'string' ? title : undefined;
};

export const shouldSendTopSuggestedCardView = (
  consultResponse: SearchLikeResponse,
  resultResponse: SearchLikeResponse,
): boolean => {
  const promotedTitle = topTitle(consultResponse);

  if (!promotedTitle || promotedTitle.length < MIN_TITLE_LENGTH) {
    return false;
  }

  return promotedTitle !== topTitle(resultResponse);
};

type LocationLike = { city_name?: string; city_id?: string | number; lat?: number; lon?: number } | null | undefined;

type ResultResponseLike = SearchLikeResponse & { selected_filters?: unknown };

/**
 * Payload for the `search_top_suggested_card_view` event.
 *
 * `result_count` deliberately reads `search.result.length`. The first version of
 * this event read `searchResultResponse.length` — the length of the *response
 * object*, which is always `undefined` — so the field would have been dead on
 * arrival even once delivery was fixed.
 */
export const buildTopSuggestedCardViewEvent = (resultResponse: ResultResponseLike, location: LocationLike) => ({
  group: 'search_metrics',
  type: 'search_top_suggested_card_view',
  data: {
    filters: resultResponse?.selected_filters,
    result_count: resultResponse?.search?.result?.length,
    location: location?.city_name,
    city_id: location?.city_id,
    lat: location?.lat,
    lon: location?.lon,
  },
});

export default shouldSendTopSuggestedCardView;
