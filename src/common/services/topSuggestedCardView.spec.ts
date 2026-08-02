import {
  buildTopSuggestedCardViewEvent,
  SearchLikeResponse,
  shouldSendTopSuggestedCardView,
} from './topSuggestedCardView';

// `title` is intentionally `unknown`: the runtime payload is untyped JSON from
// SEAPI, so a non-string title is a case the predicate must survive.
const res = (title?: unknown) =>
  ({ search: { result: [title === undefined ? {} : { title }] } }) as SearchLikeResponse;

describe('shouldSendTopSuggestedCardView', () => {
  it('fires when a promoted doctor differs from the top organic result', () => {
    expect(shouldSendTopSuggestedCardView(res('علیرضا مؤثر'), res('مهدی شمس'))).toBe(true);
  });

  it('does not fire when the promoted doctor IS the top organic result', () => {
    // Double-counting the same doctor would inflate the impression denominator.
    expect(shouldSendTopSuggestedCardView(res('حسن چراغی'), res('حسن چراغی'))).toBe(false);
  });

  it('does not fire when there is no promoted card', () => {
    expect(shouldSendTopSuggestedCardView(undefined, res('مهدی شمس'))).toBe(false);
    expect(shouldSendTopSuggestedCardView(null, res('مهدی شمس'))).toBe(false);
    expect(shouldSendTopSuggestedCardView({}, res('مهدی شمس'))).toBe(false);
    expect(shouldSendTopSuggestedCardView({ search: { result: [] } }, res('مهدی شمس'))).toBe(false);
  });

  it('does not fire on a too-short or non-string title', () => {
    expect(shouldSendTopSuggestedCardView(res('اب'), res('مهدی شمس'))).toBe(false);
    expect(shouldSendTopSuggestedCardView(res(''), res('مهدی شمس'))).toBe(false);
    expect(shouldSendTopSuggestedCardView(res(123), res('مهدی شمس'))).toBe(false);
  });

  it('still fires when the organic side is missing entirely', () => {
    // Empty main results with a promoted card present is exactly the case the
    // old inline guard crashed on (it read .title without optional chaining).
    expect(shouldSendTopSuggestedCardView(res('علیرضا مؤثر'), undefined)).toBe(true);
    expect(shouldSendTopSuggestedCardView(res('علیرضا مؤثر'), { search: { result: [] } })).toBe(true);
  });

  it('never throws on malformed payloads', () => {
    expect(() => shouldSendTopSuggestedCardView({ search: null }, { search: { result: null } })).not.toThrow();
    expect(shouldSendTopSuggestedCardView({ search: null }, { search: { result: null } })).toBe(false);
  });
});

describe('buildTopSuggestedCardViewEvent', () => {
  const location = { city_name: 'yazd', city_id: 12, lat: 31.9, lon: 54.3 };

  it('builds the event with group/type matching the click event', () => {
    const e = buildTopSuggestedCardViewEvent({ search: { result: [{}, {}, {}] } }, location);
    expect(e.group).toBe('search_metrics');
    expect(e.type).toBe('search_top_suggested_card_view');
  });

  it('counts the results, not the response object', () => {
    // The original payload read `searchResultResponse.length`, which is always
    // undefined — the field would have been dead even after delivery was fixed.
    const e = buildTopSuggestedCardViewEvent({ search: { result: [{}, {}, {}] } }, location);
    expect(e.data.result_count).toBe(3);
  });

  it('carries the location fields through', () => {
    const e = buildTopSuggestedCardViewEvent({ search: { result: [] } }, location);
    expect(e.data).toMatchObject({ location: 'yazd', city_id: 12, lat: 31.9, lon: 54.3 });
  });

  it('never throws on missing response or location', () => {
    expect(() => buildTopSuggestedCardViewEvent(undefined, undefined)).not.toThrow();
    const e = buildTopSuggestedCardViewEvent(undefined, undefined);
    expect(e.type).toBe('search_top_suggested_card_view');
    expect(e.data.result_count).toBeUndefined();
  });
});
