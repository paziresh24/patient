/**
 * The conversational layer **inside the existing search box** — DR-11, owner
 * 2026-07-29:
 *
 *   «ورودی چت در حال حاضر نباید ورودی متفاوتی باشه و صرفا همون کارت نتیجه جستجو
 *    … کافیه. منتها … در صورتی که تشخیص دادیم بیمار داره یک محاوره انجام میده،
 *    اون باکس جستجو رو یه مقدار بسطش بدیم.»
 *
 * So: no second input, no separate destination. The box the patient already uses
 * simply **grows** a conversation underneath it when what they typed looks like a
 * sentence.
 *
 * ### The property that makes this safe to roll out
 *
 * **It never intercepts the search.** Enter still navigates to `/s?text=…` exactly
 * as before, the classic results still load, and this panel expands *in addition*.
 * That is deliberate: the previous plan's "zero blast radius" came from living on
 * a separate route, and the moment we move into `/s` that argument is gone — so it
 * is replaced by a stronger one. Chat here can only **add** a panel. If the
 * orchestrator is down, the budget is spent, the gate says no, or this component
 * throws, the patient still gets the results page they asked for. There is no
 * failure mode in which the search box stops searching.
 *
 * ### Gates
 * Rollout is logged-in-only and never on a university/partner host — both live in
 * `chatEligibility.ts`, with the reasoning for why the host check is an allow-list.
 *
 * ### Where decisions live
 * Not here. This component pre-filters the obvious catalog lookups to avoid a
 * pointless round-trip, sends `explicit: false`, and renders whatever the
 * orchestrator returns. `mode: "classic"` ⇒ it renders nothing at all.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import {
  postTurn,
  sendChatClick,
  sendChatExit,
  sendChatView,
  type ChatCard,
  type TurnResponse,
} from './chatApi';
import { looksConversational } from './chatEligibility';
import { useChatGate } from './useChatGate';

const ENTRY_POINT = 'search_box' as const;

/** How many provider cards the expanded box shows. See the note at the render site. */
const MAX_CARDS = 3;

interface Turn {
  user: string;
  assistant?: TurnResponse;
}

export const ConversationalSearchPanel = () => {
  const router = useRouter();
  // Every rollout gate in one call — runtime master switch, GrowthBook rollout,
  // preview key, host allow-list, logged-in. See useChatGate for why the flag is
  // NOT a NEXT_PUBLIC_* env var.
  const gate = useChatGate();

  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const conversationId = useRef('');
  /** Guards against re-asking the same query on every re-render / route event. */
  const askedFor = useRef('');

  const queryText = typeof router.query.text === 'string' ? router.query.text : '';
  const terminalId = useMemo(() => String(getCookie('terminal_id') ?? ''), []);


  const ask = useCallback(
    async (text: string, explicit = false) => {
      setBusy(true);
      const res = await postTurn({
        text,
        // The first turn is a *guess* from the search box, so the orchestrator's
        // gate decides. A follow-up the user typed into this panel is a deliberate
        // act, so it is explicit — belt and braces alongside the server-side
        // follow-up rule (a fragment like «در تهران باشد» must not be re-gated).
        explicit,
        conversationId: conversationId.current || undefined,
        terminalId,
      });
      setBusy(false);
      // No answer, or the orchestrator declined: show nothing. The classic
      // results the patient is already looking at are the answer.
      if (!res || res.mode !== 'chat') {
        setTurns(current => current.filter(t => t.assistant));
        return;
      }
      conversationId.current = res.conversation_id;
      sendChatView(res, ENTRY_POINT);
      setTurns(current => {
        const next = [...current];
        const last = next[next.length - 1];
        if (last && !last.assistant) next[next.length - 1] = { ...last, assistant: res };
        else next.push({ user: text, assistant: res });
        return next;
      });
    },
    [terminalId]
  );

  // The trigger: the patient searched something sentence-shaped.
  useEffect(() => {
    if (!gate.allowed || dismissed) return;
    if (!queryText || queryText === askedFor.current) return;
    if (!looksConversational(queryText)) return;
    askedFor.current = queryText;
    conversationId.current = '';
    setTurns([{ user: queryText }]);
    void ask(queryText);
  }, [queryText, gate.allowed, dismissed, ask]);

  if (!gate.allowed || dismissed || turns.length === 0) return null;

  const submitFollowUp = () => {
    const text = followUp.trim();
    if (!text || busy) return;
    setFollowUp('');
    setTurns(current => [...current, { user: text }]);
    void ask(text, true);
  };

  return (
    <section
      dir="rtl"
      aria-label="راهنمای انتخاب پزشک"
      className="mt-2 flex w-full flex-col gap-3 rounded-2xl border border-solid border-slate-200 bg-white p-4 shadow-sm"
    >
      <header className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-slate-700">راهنمای انتخاب پزشک (آزمایشی)</span>
        <button
          type="button"
          className="text-xs text-slate-500 underline"
          onClick={() => {
            // The always-available exit. Its usage rate is KPI M-3.
            sendChatExit(conversationId.current, 'user_choice', ENTRY_POINT);
            setDismissed(true);
          }}
        >
          بستن و نتایج معمولی
        </button>
      </header>

      {turns.map((turn, i) => (
        <div key={i} className="flex flex-col gap-2">
          {i > 0 && <p className="self-end rounded-2xl bg-primary/10 px-3 py-2 text-xs">{turn.user}</p>}

          {turn.assistant?.emergency && (
            <p className="rounded-xl border border-solid border-red-300 bg-red-50 p-3 text-xs font-bold leading-6 text-red-700">
              {turn.assistant.emergency}
            </p>
          )}

          {(turn.assistant?.message || turn.assistant?.clarifying_question) && (
            <p className="rounded-2xl bg-slate-100 px-3 py-2 text-xs leading-6">
              {turn.assistant.message || turn.assistant.clarifying_question}
            </p>
          )}

          {turn.assistant?.guide && (
            <a
              href={turn.assistant.guide.url}
              className="self-start rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
              onClick={() => sendChatExit(conversationId.current, `guide_${turn.assistant?.guide?.topic}`, ENTRY_POINT)}
            >
              {turn.assistant.guide.cta}
            </a>
          )}

          {/* Only the top few. Measured on production: rendering all 10 pushed the
              classic results below the fold, and the owner asked for the box to
              expand «یه مقدار» — not to become the page. The full list is one click
              away in the classic results underneath. */}
          {turn.assistant?.results?.slice(0, MAX_CARDS).map((card: ChatCard) => (
            <a
              key={card.id}
              href={card.url}
              onClick={() =>
                sendChatClick(
                  card,
                  {
                    queryId: turn.assistant?.query_id,
                    turnIndex: turn.assistant?.turn_index,
                    resultCount: turn.assistant?.result_count,
                    searchQuery: turn.assistant?.search_query,
                    conversationId: conversationId.current,
                  },
                  ENTRY_POINT
                )
              }
              className="flex flex-col gap-1 rounded-xl border border-solid border-slate-200 p-3 text-xs hover:bg-slate-50"
            >
              <span className="font-bold">{card.title}</span>
              {card.expertise && <span className="text-slate-500">{card.expertise}</span>}
            </a>
          ))}

          {turn.assistant?.disclaimer && (
            <p className="text-[0.625rem] leading-5 text-slate-400">{turn.assistant.disclaimer}</p>
          )}
        </div>
      ))}

      {busy && <p className="text-xs text-slate-400">در حال بررسی…</p>}

      {/* Follow-up: the API has been multi-turn since day one (§۰.۵ rule 4), so
          the box that answered can also be asked again. */}
      <form
        className="flex gap-2"
        onSubmit={e => {
          e.preventDefault();
          submitFollowUp();
        }}
      >
        <input
          className="flex-1 rounded-xl border border-solid border-slate-200 px-3 py-2 text-xs"
          placeholder="سؤال تکمیلی بپرسید…"
          value={followUp}
          maxLength={600}
          disabled={busy}
          onChange={e => setFollowUp(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-xs text-white disabled:opacity-50"
          disabled={busy || !followUp.trim()}
        >
          ارسال
        </button>
      </form>
    </section>
  );
};

export default ConversationalSearchPanel;
