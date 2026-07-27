/**
 * DR-11 — conversational search MVP (UI).
 *
 * Three deliberate constraints shaped this component:
 *
 * 1. **Zero blast radius on classic search.** It imports nothing from
 *    `modules/search`, changes no existing file, and lives on its own route. If
 *    this whole folder were deleted, `/s` would be byte-identical. That is the
 *    proof the DR asks for, and it is why the entry point *into* `/s` is a
 *    separate, reviewable change rather than part of this one.
 * 2. **No decision logic here.** The orchestrator in khesht decides everything
 *    (trigger, budget, safety, which tool to call). This component renders what
 *    it is told and, when told `mode: "classic"`, gets out of the way by handing
 *    the user's own text to normal search — so an LLM outage or an exhausted
 *    budget looks like "search worked", not "the site is broken".
 * 3. **Analytics identical in shape to the rest of the funnel** (DR-10): the
 *    same `search_view` / `search_click_position` events, on the same index, via
 *    the same `splunkInstance('search')` — plus `conversation_id`, `turn_index`
 *    and `is_conversational` so the conversational path can be compared with,
 *    not bolted onto, the existing funnel.
 *
 * ⚠ Privacy: `filters.text` carries the **extracted query** (e.g. «ارتوپدی»),
 * never the user's narrative. The sentence a user writes here can be health
 * data; analytics never needs it and therefore never receives it.
 */
import { useCallback, useMemo, useRef, useState } from 'react';
import { getCookie } from 'cookies-next';
import { splunkInstance } from '@/common/services/splunk';

const API_BASE = process.env.NEXT_PUBLIC_CHAT_API_BASE || 'https://j-n-khesht.p24cloud.ir';

export interface ChatCard {
  id: string;
  title: string;
  expertise: string;
  url: string;
  type: string;
  position: number;
}

interface TurnResponse {
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
}

type Bubble =
  | { role: 'user'; text: string }
  | {
      role: 'assistant';
      text: string;
      emergency?: string;
      disclaimer?: string;
      results?: ChatCard[];
      queryId?: string;
      turnIndex?: number;
      resultCount?: number;
      searchQuery?: string;
    };

/** The always-available exit. Its usage rate is KPI M-3. */
function goToClassicSearch(text: string, reason: string, conversationId: string) {
  try {
    splunkInstance('search').sendEvent({
      group: 'search_metrics',
      type: 'conversational_exit',
      event: { conversation_id: conversationId, exit_reason: reason },
    });
  } catch {
    /* analytics must never block navigation */
  }
  window.location.assign(`/s/?text=${encodeURIComponent(text)}`);
}

export const ConversationalSearch = () => {
  const [input, setInput] = useState('');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [busy, setBusy] = useState(false);
  const conversationId = useRef<string>('');
  const lastUserText = useRef<string>('');

  const terminalId = useMemo(() => String(getCookie('terminal_id') ?? ''), []);

  const sendView = useCallback((res: TurnResponse) => {
    try {
      splunkInstance('search').sendEvent({
        group: 'search_metrics',
        type: 'search_view',
        event: {
          // Same field names and meaning as the classic funnel (DR-10 M-5).
          filters: { text: res.search_query ?? '' },
          result_count: res.result_count ?? 0,
          query_id: res.query_id,
          location: 'ir',
          // Conversational-only additions.
          conversation_id: res.conversation_id,
          turn_index: res.turn_index,
          is_conversational: true,
        },
      });
    } catch {
      /* never break the UI for a metric */
    }
  }, []);

  const sendClick = useCallback((card: ChatCard, bubble: Bubble & { role: 'assistant' }) => {
    try {
      splunkInstance('search').sendEvent({
        group: 'search_metrics',
        type: 'search_click_position',
        event: {
          card_data: {
            _id: card.id,
            position: card.position,
            title: card.title,
            type: card.type,
            url: card.url,
          },
          query_id: bubble.queryId,
          // The known funnel bug is that result_count is 0/wrong on the click
          // event. It is carried correctly here on purpose (DR-10 M-5).
          result_count: bubble.resultCount ?? 0,
          filters: { text: bubble.searchQuery ?? '' },
          conversation_id: conversationId.current,
          turn_index: bubble.turnIndex,
          is_conversational: true,
        },
      });
    } catch {
      /* never break navigation for a metric */
    }
  }, []);

  const submit = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      lastUserText.current = text;
      setBubbles((b) => [...b, { role: 'user', text }]);
      setInput('');
      setBusy(true);

      let res: TurnResponse | null = null;
      try {
        const httpRes = await fetch(`${API_BASE}/api/khesht/chat/turn`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            text,
            explicit: true,
            ...(conversationId.current ? { conversation_id: conversationId.current } : {}),
            context: { city: 'ir', terminal_id: terminalId },
          }),
        });
        res = (await httpRes.json()) as TurnResponse;
      } catch {
        res = null;
      } finally {
        setBusy(false);
      }

      // Network died, backend down, anything at all ⇒ the user still gets a
      // working search instead of an error screen.
      if (!res) {
        goToClassicSearch(text, 'network_error', conversationId.current);
        return;
      }
      conversationId.current = res.conversation_id;

      if (res.mode === 'classic') {
        goToClassicSearch(res.fallback_query ?? text, res.fallback_reason ?? 'unknown', res.conversation_id);
        return;
      }

      sendView(res);
      setBubbles((b) => [
        ...b,
        {
          role: 'assistant',
          text: res!.message ?? res!.clarifying_question ?? '',
          emergency: res!.emergency,
          disclaimer: res!.disclaimer,
          results: res!.results,
          queryId: res!.query_id,
          turnIndex: res!.turn_index,
          resultCount: res!.result_count,
          searchQuery: res!.search_query,
        },
      ]);
    },
    [busy, sendView, terminalId]
  );

  return (
    <div dir="rtl" className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-bold">راهنمای انتخاب پزشک</h1>
          <p className="text-xs text-slate-500">مشکل‌تان را به زبان خودتان بنویسید (نسخهٔ آزمایشی)</p>
        </div>
        <button
          type="button"
          className="rounded-lg border px-3 py-2 text-sm"
          onClick={() => goToClassicSearch(lastUserText.current || '', 'user_choice', conversationId.current)}
        >
          جستجوی معمولی
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        {bubbles.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
            مثلاً: «چند روزه که سرم را که می‌چرخانم گردن و شانه‌ام تیر می‌کشد و دستم بی‌حس می‌شود، به چه دکتری
            مراجعه کنم؟»
          </p>
        )}

        {bubbles.map((bubble, i) =>
          bubble.role === 'user' ? (
            <p key={i} className="self-end rounded-2xl bg-primary/10 px-4 py-2 text-sm">
              {bubble.text}
            </p>
          ) : (
            <div key={i} className="flex flex-col gap-2">
              {bubble.emergency && (
                <p className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold leading-7 text-red-700">
                  {bubble.emergency}
                </p>
              )}
              {bubble.text && <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-7">{bubble.text}</p>}

              {bubble.results?.map((card) => (
                <a
                  key={card.id}
                  href={card.url}
                  onClick={() => sendClick(card, bubble)}
                  className="flex flex-col gap-1 rounded-xl border p-3 text-sm hover:bg-slate-50"
                >
                  <span className="font-bold">{card.title}</span>
                  {card.expertise && <span className="text-xs text-slate-500">{card.expertise}</span>}
                </a>
              ))}

              {bubble.disclaimer && <p className="text-xs leading-6 text-slate-400">{bubble.disclaimer}</p>}
            </div>
          )
        )}

        {busy && <p className="text-sm text-slate-400">در حال بررسی…</p>}
      </div>

      <form
        className="sticky bottom-0 flex gap-2 bg-white py-3"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(input);
        }}
      >
        <input
          className="flex-1 rounded-xl border px-4 py-3 text-sm"
          placeholder="مشکل‌تان را بنویسید…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={600}
          disabled={busy}
        />
        <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm text-white" disabled={busy || !input.trim()}>
          ارسال
        </button>
      </form>
    </div>
  );
};

export default ConversationalSearch;
