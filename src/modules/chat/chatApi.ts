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
}

/** Never throws: a null return means "act as if chat does not exist". */
export async function postTurn(req: TurnRequest): Promise<TurnResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/khesht/chat/turn`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: req.text,
        explicit: req.explicit,
        ...(req.conversationId ? { conversation_id: req.conversationId } : {}),
        context: { city: req.city ?? 'ir', terminal_id: req.terminalId ?? '' },
      }),
    });
    if (!res.ok) return null;
    return (await res.json()) as TurnResponse;
  } catch {
    return null;
  }
}

function send(type: string, event: Record<string, unknown>): void {
  try {
    splunkInstance('search').sendEvent({ group: 'search_metrics', type, event });
  } catch {
    /* analytics must never block the UI or navigation */
  }
}

/** `entry_point` separates the in-search-box surface from the standalone route. */
export function sendChatView(res: TurnResponse, entryPoint: 'search_box' | 'chat_route'): void {
  send('search_view', {
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
  entryPoint: 'search_box' | 'chat_route'
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
export function sendChatExit(conversationId: string, reason: string, entryPoint: 'search_box' | 'chat_route'): void {
  send('conversational_exit', { conversation_id: conversationId, exit_reason: reason, entry_point: entryPoint });
}
