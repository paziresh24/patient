/**
 * Guards for the browser-side half of the stay-in-chat flow.
 *
 * The one that matters most is `resolveBooking`: it is the check that khesht
 * structurally cannot do, because a `book_id` inside a `client_action` is model
 * output. If this test is wrong, an invented id could reach a cancellation.
 */
jest.mock('@/common/apis/services/booking/getBooks', () => ({ getBooks: jest.fn() }));
jest.mock('@/common/apis/services/booking/removeBook', () => ({ removeBook: jest.fn() }));

import { getBooks } from '@/common/apis/services/booking/getBooks';
import { fetchMyBookings, planClientAction, resolveBooking, toChatContext, type BookingSummary } from './userDataBridge';

const booking = (over: Partial<BookingSummary> = {}): BookingSummary => ({
  bookId: 'B-1',
  kind: 'book',
  doctor: 'دکتر الف',
  expertise: 'قلب',
  centerId: 'C-1',
  centerName: 'مطب',
  bookTime: 'شنبه ۱۰:۰۰',
  timestamp: 100,
  status: 1,
  referenceCode: 'R-1',
  nationalCode: '0000000000',
  url: '/receipt/C-1/B-1',
  ...over,
});

describe('resolveBooking — a model-supplied reference is never trusted on its own', () => {
  const list = [booking({ bookId: 'B-1' }), booking({ bookId: 'B-2', timestamp: 50 })];

  it('accepts an id that exists in the list this browser fetched', () => {
    expect(resolveBooking({ book_id: 'B-2' }, list)?.bookId).toBe('B-2');
  });

  it('refuses an invented id instead of guessing the closest one', () => {
    // verify-the-verifier: replace the exact match with a "first booking" fallback
    // and this expectation goes red — which is the whole point of the test.
    expect(resolveBooking({ book_id: 'B-999' }, list)).toBeNull();
  });

  it('accepts a 1-based index, so «دومی را لغو کن» works, and rejects one out of range', () => {
    expect(resolveBooking({ idx: '2' }, list)?.bookId).toBe('B-2');
    expect(resolveBooking({ idx: '0' }, list)).toBeNull();
    expect(resolveBooking({ idx: '3' }, list)).toBeNull();
    expect(resolveBooking({ idx: 'abc' }, list)).toBeNull();
  });

  it('refuses when there are no params at all', () => {
    expect(resolveBooking(undefined, list)).toBeNull();
    expect(resolveBooking({}, list)).toBeNull();
  });
});

describe('toChatContext — what the provider is allowed to see', () => {
  it('carries only what disambiguates a booking, never patient identifiers', () => {
    const ctx = toChatContext([booking({ nationalCode: '1234567890' })]);
    expect(ctx[0]).toEqual({
      ref: 'B-1',
      doctor: 'دکتر الف',
      date: 'شنبه ۱۰:۰۰',
      type: 'حضوری',
      center: 'مطب',
    });
    expect(JSON.stringify(ctx)).not.toContain('1234567890');
  });

  it('is capped, so a long history cannot inflate the prompt', () => {
    const many = Array.from({ length: 25 }, (_, i) => booking({ bookId: `B-${i}` }));
    expect(toChatContext(many)).toHaveLength(10);
  });
});

describe('fetchMyBookings', () => {
  const mocked = getBooks as jest.MockedFunction<any>;
  beforeEach(() => mocked.mockReset());

  it('merges all three return types, de-duplicates, and sorts newest first', async () => {
    const row = (id: string, from: number) => ({
      book_id: id,
      from,
      book_status: 1,
      book_time_string: 't',
      ref_id: 'R',
      center: { id: 'C', name: 'مرکز' },
      doctor_info: { name: 'الف', family: 'ب', display_expertise: 'قلب' },
      patient_info: { national_code: '1' },
    });
    mocked
      .mockResolvedValueOnce({ data: [row('B-1', 10), row('B-2', 30)] })
      .mockResolvedValueOnce({ data: [row('B-2', 30)] }) // same booking in a second list
      .mockResolvedValueOnce({ data: [row('B-3', 20)] });
    const out = await fetchMyBookings();
    expect(out.map(b => b.bookId)).toEqual(['B-2', 'B-3', 'B-1']);
    expect(out[0].doctor).toBe('الف ب');
  });

  it('survives one failing list instead of blanking the whole thing', async () => {
    mocked
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({
        data: [
          {
            book_id: 'B-9',
            from: 1,
            book_status: 1,
            center: { id: 'C', name: 'م' },
            doctor_info: {},
            patient_info: {},
          },
        ],
      });
    const out = await fetchMyBookings();
    expect(out.map(b => b.bookId)).toEqual(['B-9']);
  });

  it('drops a row with no book_id rather than rendering a booking that cannot be acted on', async () => {
    mocked.mockResolvedValue({ data: [{ from: 1, center: {}, doctor_info: {}, patient_info: {} }] });
    expect(await fetchMyBookings()).toEqual([]);
  });
});

describe('planClientAction — the confirmation flag is load-bearing', () => {
  const list = [booking({ bookId: 'B-1' })];

  it('proposes a confirmation for a resolvable cancellation, never performs it', () => {
    const plan = planClientAction({ kind: 'cancel_booking', requires_confirmation: true, params: { book_id: 'B-1' } }, list);
    expect(plan).toEqual({ kind: 'confirm_cancel', booking: list[0] });
  });

  it('falls back to showing the list when the id cannot be resolved', () => {
    const plan = planClientAction({ kind: 'cancel_booking', requires_confirmation: true, params: { book_id: 'nope' } }, list);
    expect(plan).toEqual({ kind: 'show_list' });
  });

  it('just shows the list for a read-only action', () => {
    expect(planClientAction({ kind: 'fetch_my_bookings', requires_confirmation: false }, list)).toEqual({
      kind: 'show_list',
    });
  });

  it('REFUSES an unknown action that demands confirmation, instead of performing it', () => {
    // The gap this catches, found by inspecting the shipped bundle: confirmation
    // used to be implied by `kind === 'cancel_booking'`, so a future action marked
    // requires_confirmation would have run with no dialog at all.
    // verify-the-verifier: drop the flag check and this expectation goes red.
    expect(planClientAction({ kind: 'some_future_mutation', requires_confirmation: true }, list)).toEqual({
      kind: 'refuse',
      reason: 'no_confirmation_ui',
    });
  });
});
