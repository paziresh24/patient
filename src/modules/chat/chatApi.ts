/**
 * The one place the front end talks to the chat orchestrator, and the one place
 * it emits conversational analytics.
 *
 * Extracted from `conversationalSearch.tsx` when the second surface arrived (the
 * in-search-box panel, DR-11 2026-07-29). Two surfaces sending *almost* the same
 * events is how a funnel silently stops being comparable — DR-10's whole reason
 * for existing — so the event shape lives here once.
 *
 * ⚠ Privacy: `filters.text` carries the **extracted query** (e.g. «ارتوپدی»),
 * never the user's narrative. The sentence a user writes can be health data;
 * analytics never needs it and therefore never receives it.
 */
import getConfig from 'next/config';
import { getCookie } from 'cookies-next';
import { splunkInstance } from '@/common/services/splunk';

// publicRuntimeConfig, not NEXT_PUBLIC_*: the image is built without build args,
// so a NEXT_PUBLIC_* value would be `undefined` in the production bundle and this
// would silently fall back to the hard-coded host. See useChatGate.ts.
const API_BASE =
  String(getConfig()?.publicRuntimeConfig?.CHAT_API_BASE ?? '') || 'https://j-n-khesht.p24cloud.ir';

export interface ChatCard {
  id: string;
  title: string;
  expertise: string;
  url: string;
  type: string;
  position: number;
  /**
   * Trust fields (khesht ≥ 2026-08-06) — the same public catalog data the /s
   * listing shows. All optional: an older khesht build must degrade to the
   * minimal card, never break the turn.
   */
  image?: string;
  satisfaction?: number;
  rates_count?: number;
  address?: string;
  waiting_time?: string;
  online_visit?: boolean;
  /** قیمتِ ویزیتِ آنلاین به تومان (khesht ≥ 2026-08-07). */
  online_visit_price?: number;
  is_bulk?: boolean;
}

export interface TurnResponse {
  mode: 'chat' | 'classic';
  conversation_id: string;
  query_id: string;
  turn_index: number;
  fallback_query?: string;
  fallback_reason?: string;
  message?: string;
  clarifying_question?: string;
  disclaimer?: string;
  emergency?: string;
  search_query?: string;
  results?: ChatCard[];
  result_count?: number;
  /**
   * Present when the answer is a destination rather than a list — "how do I cancel
   * my booking" (DR-11 §۱۲.۴). `url` always comes from the orchestrator's closed
   * table, never from the model, so it is safe to render as a link.
   */
  guide?: { topic: string; url: string; cta: string };
  /**
   * "Do this here, with the user's own session." A key from a closed enum plus
   * scalar params — never a URL. `requires_confirmation` is a property of the
   * action itself, so a cancellation can never arrive as a one-tap operation.
   * Executed by `userDataBridge.ts`, which is also where the model-supplied
   * `book_id` is validated against the list the browser actually fetched.
   */
  client_action?: {
    kind: 'fetch_my_bookings' | 'cancel_booking' | 'open_booking';
    title: string;
    requires_confirmation: boolean;
    params: Record<string, string>;
  };
  /**
   * Next things the patient can tap instead of typing — added by the orchestrator
   * for the full-page surface (Yara). Optional and unstable on purpose: a surface
   * that renders it must treat "absent", "empty" and "malformed" as the same
   * thing — nothing — so an orchestrator change can never break the page.
   */
  suggestions?: Array<{ key: string; label: string }>;
  /** Read-only detail card for one named provider — address / phone / availability. */
  provider?: {
    matched: boolean;
    focus: string;
    name: string;
    expertise: string;
    url: string;
    image: string;
    satisfaction: number | null;
    rates_count: number | null;
    waiting_time: string;
    insurances: string[];
    online_visit: boolean;
    in_person_booking: boolean;
    centers: Array<{ name: string; address: string; phones: string[]; city: string }>;
    actions: Array<{ title: string; url: string }>;
  };
}

/** One appointment, as summarised by the browser for a follow-up turn. */
export interface BookingContextItem {
  ref: string;
  doctor: string;
  date: string;
  type: string;
  center?: string;
}

export interface ConversationSummary {
  conversation_id: string;
  title: string;
  created_at: string;
  last_message_at: string;
  turn_count: number;
}

export interface ArchivedMessage {
  conversation_id: string;
  turn_index: number;
  role: 'user' | 'assistant';
  text: string;
  created_at: string;
  /**
   * The structured answer as it was rendered live (khesht ≥ 2026-08-06).
   * Restoring from `payload` is what keeps an old conversation looking like a
   * conversation — `text` is the flat audit transcript, and rendering it in one
   * bubble was the launch-day bug the owner screenshotted. Absent on messages
   * archived before the field existed.
   */
  payload?: Partial<TurnResponse>;
}

export interface TurnRequest {
  text: string;
  conversationId?: string;
  terminalId?: string;
  city?: string;
  /**
   * false = "I am guessing, you decide" (the search-box path). The orchestrator's
   * gate is authoritative either way; the front end never decides to trigger.
   */
  explicit: boolean;
  /**
   * Sent only when the panel has already loaded the user's appointments AND the
   * message is about them — see the gate in khesht's orchestrator. It is what lets
   * «دومی را لغو کن» resolve to a specific booking.
   */
  bookings?: BookingContextItem[];
}

/**
 * The user's own bearer token, exactly as every other authenticated call in this app
 * sends it (`client.ts` interceptors). khesht uses it for **one** thing: asking the
 * platform who the caller is, so a stored conversation can belong to them. It is
 * never used to fetch or change the user's data — that stays in this browser.
 */
function authHeaders(): Record<string, string> {
  const token = getCookie('token');
  return typeof token === 'string' && token ? { authorization: `Bearer ${token}` } : {};
}

/**
 * 🔴 `credentials: 'include'` is not belt-and-braces here — it is the primary path.
 *
 * Measured on production 2026-07-30: every turn from a logged-in user reached the
 * orchestrator **anonymous**, and its counters said exactly why — `verified: 0,
 * rejected: 0, errors: 0` means no credential arrived at all, not that one was
 * refused. `getCookie('token')` returns nothing in the live session, so
 * `authHeaders()` was contributing an empty object on every call.
 *
 * So instead of depending on the cookie being readable from JavaScript, we let the
 * browser attach it. khesht now echoes the paziresh24 origin and sets
 * `Allow-Credentials` (a wildcard origin is forbidden with credentials), and reads
 * the `token` cookie server-side. The explicit header stays as the first choice for
 * callers where it *is* readable.
 */
const CREDENTIALS: RequestCredentials = 'include';

/** Never throws: a null return means "act as if chat does not exist". */
export async function postTurn(req: TurnRequest): Promise<TurnResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/khesht/chat/turn`, {
      method: 'POST',
      credentials: CREDENTIALS,
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({
        text: req.text,
        explicit: req.explicit,
        ...(req.conversationId ? { conversation_id: req.conversationId } : {}),
        context: {
          city: req.city ?? 'ir',
          terminal_id: req.terminalId ?? '',
          ...(req.bookings?.length ? { bookings: req.bookings } : {}),
        },
      }),
    });
    if (!res.ok) return null;
    return (await res.json()) as TurnResponse;
  } catch {
    return null;
  }
}

/* ------------------------------------------------- conversation history
 *
 * The patient's own transcript. Every one of these is authenticated with the
 * caller's token and scoped server-side to that user; there is no parameter for
 * "whose". Deletion here is **logical** — the API has no physical delete at all
 * (owner decision 2026-07-30), so «حذف کردم» is always reversible from
 * `restoreConversation`.
 */

export async function listConversations(): Promise<ConversationSummary[]> {
  try {
    const res = await fetch(`${API_BASE}/api/khesht/chat/conversations?limit=30`, { headers: authHeaders(), credentials: CREDENTIALS });
    if (!res.ok) return [];
    return ((await res.json())?.conversations ?? []) as ConversationSummary[];
  } catch {
    return [];
  }
}

export async function getConversation(
  id: string
): Promise<{ conversation: ConversationSummary; messages: ArchivedMessage[] } | null> {
  try {
    const res = await fetch(`${API_BASE}/api/khesht/chat/conversations/${encodeURIComponent(id)}`, {
      headers: authHeaders(),
      credentials: CREDENTIALS,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function deleteConversation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/khesht/chat/conversations/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders(),
      credentials: CREDENTIALS,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function restoreConversation(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/khesht/chat/conversations/${encodeURIComponent(id)}/restore`, {
      method: 'POST',
      headers: authHeaders(),
      credentials: CREDENTIALS,
    });
    return res.ok;
  } catch {
    return false;
  }
}

function send(type: string, event: Record<string, unknown>): void {
  try {
    splunkInstance('search').sendEvent({ group: 'search_metrics', type, event });
  } catch {
    /* analytics must never block the UI or navigation */
  }
}

/**
 * `entry_point` separates the surfaces from each other in the same funnel:
 * `search_box` (panel inside `/s`), `chat_route` (the old `/chat`), and `yara`
 * (the standalone full-page assistant at `/yara`). One union, one place, so a new
 * surface cannot quietly emit a fourth spelling of the same idea.
 */
export type ChatEntryPoint = 'search_box' | 'chat_route' | 'yara';

/**
 * دعوتِ کم‌صدای هوم‌پیج (DR-11 §۱۳-۴). CTRِ همین دو رویداد، عددِ کلیدیِ M-8 است —
 * بدونِ view، click قابلِ تفسیر نیست (نمی‌دانیم چند نفر دعوت را دیدند).
 */
export function sendYaraInvite(action: 'view' | 'click'): void {
  send('conversational_invite', {
    action,
    entry_point: 'homepage',
    is_conversational: true,
    has_token: Boolean(getCookie('token')),
  });
}

export function sendChatView(res: TurnResponse, entryPoint: ChatEntryPoint): void {
  send('search_view', {
    /**
     * Could this browser read the `token` cookie when it made the call?
     *
     * A **boolean**, never the token. It exists because on 2026-07-30 every
     * logged-in turn reached the orchestrator with no credential, and the reason
     * lived entirely on the client — invisible from the server, which can only
     * report "nothing arrived". One field turns that into a measurable fact.
     */
    has_token: Boolean(getCookie('token')),
    // Same field names and meaning as the classic funnel (DR-10 M-5).
    filters: { text: res.search_query ?? '' },
    result_count: res.result_count ?? 0,
    query_id: res.query_id,
    location: 'ir',
    // Conversational-only additions.
    conversation_id: res.conversation_id,
    turn_index: res.turn_index,
    is_conversational: true,
    entry_point: entryPoint,
  });
}

export function sendChatClick(
  card: ChatCard,
  ctx: { queryId?: string; turnIndex?: number; resultCount?: number; searchQuery?: string; conversationId: string },
  entryPoint: ChatEntryPoint
): void {
  send('search_click_position', {
    card_data: { _id: card.id, position: card.position, title: card.title, type: card.type, url: card.url },
    query_id: ctx.queryId,
    // The known funnel bug is that result_count is 0/wrong on the click event.
    // It is carried correctly here on purpose (DR-10 M-5).
    result_count: ctx.resultCount ?? 0,
    filters: { text: ctx.searchQuery ?? '' },
    conversation_id: ctx.conversationId,
    turn_index: ctx.turnIndex,
    is_conversational: true,
    entry_point: entryPoint,
  });
}

/** The escape hatch's usage rate is KPI M-3. */
export function sendChatExit(conversationId: string, reason: string, entryPoint: ChatEntryPoint): void {
  send('conversational_exit', { conversation_id: conversationId, exit_reason: reason, entry_point: entryPoint });
}


/**
 * Generic client-event ingest (khesht `POST …/chat/events`, 2026-08-07).
 *
 * Splunk-from-the-browser already exists for the *search* funnel; this is the
 * conversational half of it, and it is deliberately **one** function rather
 * than one per signal: 👍/👎, "opened a doctor card", "reached the booking
 * step" and whatever we need to ask next all travel through the same door, so
 * measuring a new thing never again waits on a back-end deploy.
 *
 * ⛔ `props` must stay scalar and free of the patient's own words. The server
 * drops prose/identity keys anyway (`client-events.ts`), but sending them and
 * relying on the server to refuse them would put health data on the wire.
 *
 * Never throws and never awaited: analytics that can break a turn is worse than
 * no analytics. `keepalive` so an event fired while navigating away survives.
 */
export function sendYaraEvent(action: string, props: Record<string, string | number | boolean> = {}): void {
  try {
    void fetch(`${API_BASE}/api/khesht/chat/events`, {
      method: 'POST',
      credentials: CREDENTIALS,
      keepalive: true,
      headers: { 'content-type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ events: [{ group: 'yara', action, props }] }),
    }).catch(() => undefined);
  } catch {
    /* fail-open */
  }
}
