/**
 * The browser-side half of "the user should not have to leave the chat".
 *
 * ### The division of labour, and why it is this way round
 *
 * khesht decides *what* should happen and returns a `client_action` — a key from a
 * closed enum. **This file is the only thing that turns a key into an actual call**,
 * and it does so with the user's own session, through the very same services the
 * appointments page uses (`getBooks`, `removeBook`). Consequences:
 *
 *  - the user's auth token never leaves the browser for data access;
 *  - khesht has no ability to read or cancel anybody's appointment, because it
 *    never receives a session and never supplies a URL;
 *  - reusing the existing services means we inherit their GrowthBook endpoint
 *    overrides, their moshir/clinic branching and their auth interceptors, instead
 *    of maintaining a second, quietly diverging copy of "how to cancel a booking".
 *
 * ### The check khesht cannot do
 *
 * A `book_id` inside a `client_action` is **model output**. `resolveBooking` is the
 * guard: an id is only ever accepted if it appears in the list this file itself
 * fetched. An invented id resolves to `null`, and the panel then shows the list and
 * asks the user to pick — never "cancelled something". This is the front-end half of
 * the boundary documented in khesht's `tools/my-bookings.ts`.
 */
import { getBooks } from '@/common/apis/services/booking/getBooks';
import { removeBook } from '@/common/apis/services/booking/removeBook';

export type BookingKind = 'book' | 'book_request' | 'online_visit';

export interface BookingSummary {
  /** Stable id — also what a `client_action` must reference to be honoured. */
  bookId: string;
  kind: BookingKind;
  doctor: string;
  expertise: string;
  centerId: string;
  centerName: string;
  bookTime: string;
  timestamp: number;
  status: number;
  referenceCode: string;
  nationalCode: string;
  /** Deep link to the receipt/detail page, for users who do want the full page. */
  url: string;
}

const KINDS: BookingKind[] = ['book', 'book_request', 'online_visit'];

function str(v: unknown): string {
  return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '';
}

function toSummary(raw: any, kind: BookingKind): BookingSummary | null {
  const bookId = str(raw?.book_id);
  if (!bookId) return null;
  const centerId = str(raw?.center?.id);
  const doctor = [str(raw?.doctor_info?.name), str(raw?.doctor_info?.family)].filter(Boolean).join(' ').trim();
  return {
    bookId,
    kind,
    doctor: doctor || 'پزشک',
    expertise: str(raw?.doctor_info?.display_expertise),
    centerId,
    centerName: str(raw?.center?.name),
    bookTime: str(raw?.book_time_string),
    timestamp: Number(raw?.from ?? 0) || 0,
    status: Number(raw?.book_status ?? 0) || 0,
    referenceCode: str(raw?.ref_id),
    nationalCode: str(raw?.patient_info?.national_code),
    url: centerId && bookId ? `/receipt/${centerId}/${bookId}` : '/patient/appointments',
  };
}

/**
 * The user's current appointments, newest first.
 *
 * All three `return_type`s are fetched because a patient does not think in terms of
 * them: «نوبت‌هایم» means everything, and showing only `book` would have made the
 * chat quietly *less* complete than the page it is replacing. Failures are
 * per-kind, so one broken list does not blank the others.
 */
export async function fetchMyBookings(university?: string): Promise<BookingSummary[]> {
  const results = await Promise.all(
    KINDS.map(async kind => {
      try {
        const res: any = await getBooks({ return_type: kind, page: 1, ...(university ? { university } : {}) });
        const rows: any[] = Array.isArray(res?.data) ? res.data : [];
        return rows.map(r => toSummary(r, kind)).filter((b): b is BookingSummary => Boolean(b));
      } catch {
        return [];
      }
    })
  );
  const all = results.flat();
  // De-duplicate: a book can legitimately appear in more than one return_type.
  const seen = new Set<string>();
  return all
    .filter(b => (seen.has(b.bookId) ? false : (seen.add(b.bookId), true)))
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Turn a model-supplied reference into a real appointment, or refuse.
 *
 * Accepts an exact `book_id`, or a 1-based `idx` into the list the user is looking
 * at (which is how «دومی را لغو کن» works). Anything else is `null` — deliberately
 * not "the closest match", because a fuzzy match on a cancellation is how the wrong
 * appointment gets cancelled.
 */
export function resolveBooking(
  params: Record<string, string> | undefined,
  bookings: BookingSummary[]
): BookingSummary | null {
  if (!params) return null;
  const byId = params.book_id && bookings.find(b => b.bookId === params.book_id);
  if (byId) return byId;
  const idx = Number(params.idx ?? params.index ?? NaN);
  if (Number.isInteger(idx) && idx >= 1 && idx <= bookings.length) return bookings[idx - 1];
  return null;
}

export type ClientActionPlan =
  /** Show the appointment list; nothing else happens. */
  | { kind: 'show_list' }
  /** Ask the user to confirm cancelling this exact appointment. */
  | { kind: 'confirm_cancel'; booking: BookingSummary }
  /** The action asks for confirmation and we have no dialog for it ⇒ do nothing. */
  | { kind: 'refuse'; reason: 'no_confirmation_ui' };

/**
 * What should happen for a `client_action` — decided here, as a pure function, so
 * the rule is testable instead of living inside a component effect.
 *
 * 🔴 The `requires_confirmation` branch exists because of a real gap found by
 * inspecting the shipped bundle (2026-07-30): the flag was not read anywhere on the
 * client, and confirmation was implied by `kind === 'cancel_booking'`. That is
 * correct for today's only mutating action and a trap for the next one. Now an
 * action that declares it needs confirmation, but has no confirmation UI here, is
 * **refused** — the unknown case fails closed rather than executing silently.
 */
export function planClientAction(
  action: { kind: string; requires_confirmation?: boolean; params?: Record<string, string> },
  bookings: BookingSummary[]
): ClientActionPlan {
  if (action.kind === 'cancel_booking') {
    const booking = resolveBooking(action.params, bookings);
    // No confident match ⇒ show the list and let the user point at one.
    return booking ? { kind: 'confirm_cancel', booking } : { kind: 'show_list' };
  }
  if (action.requires_confirmation) return { kind: 'refuse', reason: 'no_confirmation_ui' };
  return { kind: 'show_list' };
}

/**
 * Cancel one appointment — only ever called after the user has tapped confirm on a
 * dialog showing this exact appointment (owner: «حتماً دبل‌چک بگیریم ازش»).
 */
export async function cancelBooking(booking: BookingSummary): Promise<{ ok: boolean; message: string }> {
  try {
    const res: any = await removeBook(
      {
        center_id: booking.centerId,
        reference_code: booking.referenceCode,
        national_code: booking.nationalCode,
        book_id: booking.bookId,
        isBookRequest: booking.kind === 'book_request',
      },
      // The moshir path is a GrowthBook flag on the appointments page; from here we
      // take the default (clinic) path rather than guessing at a flag we cannot
      // evaluate in this component's tree. Stated because it is a real difference.
      false
    );
    const message = str(res?.data?.message);
    // The clinic API answers 200 with a status field; 1 is success there.
    const ok = res?.data?.status === 1 || res?.status === 200;
    return { ok, message: message || (ok ? 'نوبت لغو شد.' : 'لغو نوبت انجام نشد.') };
  } catch (err: any) {
    return { ok: false, message: str(err?.response?.data?.message) || 'لغو نوبت انجام نشد. دوباره تلاش کنید.' };
  }
}

/** The compact form sent back to khesht so a follow-up can reference a booking. */
export function toChatContext(bookings: BookingSummary[]) {
  return bookings.slice(0, 10).map(b => ({
    ref: b.bookId,
    doctor: b.doctor,
    date: b.bookTime,
    type: b.kind === 'online_visit' ? 'ویزیت آنلاین' : b.kind === 'book_request' ? 'درخواست نوبت' : 'حضوری',
    center: b.centerName,
  }));
}

