import { addCalendarDays, buildReviewWeekDeltaPercent } from './reviewWeekDelta';

describe('buildReviewWeekDeltaPercent', () => {
  const today = '2026-09-13';
  const review = (day: string) => ({ created_at: `${day}T12:00:00+03:30` });

  it('returns null without last-week reviews', () => {
    expect(buildReviewWeekDeltaPercent([], today)).toBeNull();
    expect(buildReviewWeekDeltaPercent([review('2026-09-13')], today)).toBeNull();
  });

  it('returns count percent vs previous week', () => {
    expect(addCalendarDays('2026-09-13', -7)).toBe('2026-09-06');
    expect(
      buildReviewWeekDeltaPercent(
        [review('2026-09-12'), review('2026-09-12'), review('2026-09-05')],
        today,
      ),
    ).toBe(100);
  });
});
