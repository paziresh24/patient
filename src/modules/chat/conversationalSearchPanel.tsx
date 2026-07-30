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
  getConversation,
  postTurn,
  sendChatClick,
  sendChatExit,
  sendChatView,
  type ChatCard,
  type TurnResponse,
} from './chatApi';
import { looksConversational } from './chatEligibility';
import { useChatGate } from './useChatGate';
import { BookingList, ConfirmCancel, HistoryDrawer, ProviderCard } from './chatSurfaces';
import {
  cancelBooking,
  fetchMyBookings,
  planClientAction,
  toChatContext,
  type BookingSummary,
} from './userDataBridge';

const ENTRY_POINT = 'search_box' as const;

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

/** How many provider cards the expanded box shows. See the note at the render site. */
const MAX_CARDS = 3;

interface Turn {
  user: string;
  assistant?: TurnResponse;
  /** Restored from the archive: text only, no live payload to re-render. */
  archivedAnswer?: string;
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

  /* ---- the user's own data, fetched by this browser and nowhere else ---- */
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [bookingsBusy, setBookingsBusy] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<BookingSummary | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  /** Kept in a ref as well so `ask` does not have to be re-created on every fetch. */
  const bookingsRef = useRef<BookingSummary[]>([]);

  const queryText = typeof router.query.text === 'string' ? router.query.text : '';
  const terminalId = useMemo(() => String(getCookie('terminal_id') ?? ''), []);

  const loadBookings = useCallback(async (): Promise<BookingSummary[]> => {
    if (bookingsRef.current.length > 0) return bookingsRef.current;
    setBookingsBusy(true);
    const rows = await fetchMyBookings();
    bookingsRef.current = rows;
    setBookings(rows);
    setBookingsBusy(false);
    return rows;
  }, []);

  /**
   * Carry out a `client_action`. Two rules make this safe rather than convenient:
   *
   *  1. the fetch happens **here**, with the user's own session — khesht never sees
   *     the data;
   *  2. a cancellation is only ever *proposed*. `resolveBooking` refuses any id that
   *     is not in the list this browser fetched, and even a resolved one goes to a
   *     confirmation showing the appointment's details. Nothing is cancelled by a
   *     model deciding it should be.
   */
  const runClientAction = useCallback(
    async (action: NonNullable<TurnResponse['client_action']>) => {
      const rows = await loadBookings();
      // The rule itself lives in `planClientAction` (pure, tested). An action that
      // asks for confirmation and has no dialog here is refused, not performed.
      const plan = planClientAction(action, rows);
      if (plan.kind === 'refuse') return;
      setShowBookings(true);
      if (plan.kind === 'confirm_cancel') setPendingCancel(plan.booking);
    },
    [loadBookings]
  );

  const ask = useCallback(
    async (text: string, explicit = false) => {
      setBusy(true);
      setNotice('');
      const res = await postTurn({
        text,
        // The first turn is a *guess* from the search box, so the orchestrator's
        // gate decides. A follow-up the user typed into this panel is a deliberate
        // act, so it is explicit — belt and braces alongside the server-side
        // follow-up rule (a fragment like «در تهران باشد» must not be re-gated).
        explicit,
        conversationId: conversationId.current || undefined,
        terminalId,
        // Only what the browser already holds, and only so a follow-up like
        // «دومی را لغو کن» can name a booking. khesht gates it further: it reaches
        // the model only when the message is actually about appointments.
        ...(bookingsRef.current.length ? { bookings: toChatContext(bookingsRef.current) } : {}),
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
      if (res.client_action) void runClientAction(res.client_action);
    },
    [terminalId, runClientAction]
  );

  const confirmCancel = useCallback(async () => {
    if (!pendingCancel) return;
    setCancelBusy(true);
    const out = await cancelBooking(pendingCancel);
    setCancelBusy(false);
    setPendingCancel(null);
    setNotice(out.message);
    if (out.ok) {
      // Re-read rather than patch the local list: the source of truth is the
      // platform, and a locally "removed" booking that did not actually cancel is
      // the worst possible outcome to show someone.
      bookingsRef.current = [];
      void loadBookings();
    }
  }, [pendingCancel, loadBookings]);

  /** Open an earlier conversation and continue it — «سوییچ بین چت‌ها». */
  const openConversation = useCallback(async (id: string) => {
    const found = await getConversation(id);
    if (!found) return;
    conversationId.current = id;
    setShowHistory(false);
    setShowBookings(false);
    setDismissed(false);
    const restored: Turn[] = [];
    for (const m of found.messages) {
      if (m.role === 'user') restored.push({ user: m.text });
      else if (restored.length) restored[restored.length - 1].archivedAnswer = m.text;
    }
    setTurns(restored);
    // The search box did not produce this thread, so the auto-trigger must not
    // immediately append the box's current query on top of it.
    askedFor.current = queryText;
  }, [queryText]);

  // The trigger: the patient searched something sentence-shaped.
  useEffect(() => {
    if (!gate.allowed || dismissed) return;
    if (!queryText || queryText === askedFor.current) return;
    if (!looksConversational(queryText)) return;
    askedFor.current = queryText;
    // 🔴 Do NOT reset the thread. The first version cleared `turns` and the
    // conversation id on every search from the box, so the owner's report was
    // exactly right: "each time I ask, the previous question and answer are gone."
    // A second sentence typed into the search box is the same conversation
    // continuing — keeping the id is also what lets the orchestrator use context.
    setTurns(current => [...current, { user: queryText }]);
    void ask(queryText);
  }, [queryText, gate.allowed, dismissed, ask]);

  // Closed by the user: leave a way back in. A dead end is not a kill-switch —
  // without this the only way to see the panel again was to re-run the search.
  if (gate.allowed && dismissed && turns.length > 0) {
    return (
      <button
        type="button"
        dir="rtl"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-2 text-xs text-slate-600 hover:bg-slate-50"
        onClick={() => setDismissed(false)}
      >
        <ChatIcon />
        نمایش دوباره‌ی راهنمای انتخاب پزشک ({turns.filter(t => t.assistant).length} پاسخ)
      </button>
    );
  }

  if (!gate.allowed || turns.length === 0) return null;

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
        <div className="flex items-center gap-3">
        <button type="button" className="text-xs text-slate-500 underline" onClick={() => setShowHistory(v => !v)}>
          گفتگوهای من
        </button>
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
        </div>
      </header>

      {showHistory && (
        <HistoryDrawer activeId={conversationId.current} onPick={openConversation} onClose={() => setShowHistory(false)} />
      )}

      {turns.map((turn, i) => (
        <div key={i} className="flex flex-col gap-2">
          {/* Every question, including the first. The first one is also visible in
              the search box, but once the thread has more than one turn the box only
              shows the latest — so hiding it here lost the history. */}
          <p className="self-end rounded-2xl bg-primary/10 px-3 py-2 text-xs">{turn.user}</p>

          {turn.assistant?.emergency && (
            <p className="rounded-xl border border-solid border-red-300 bg-red-50 p-3 text-xs font-bold leading-6 text-red-700">
              {turn.assistant.emergency}
            </p>
          )}

          {(turn.assistant?.message || turn.assistant?.clarifying_question || turn.archivedAnswer) && (
            <p className="whitespace-pre-line rounded-2xl bg-slate-100 px-3 py-2 text-xs leading-6">
              {turn.assistant?.message || turn.assistant?.clarifying_question || turn.archivedAnswer}
            </p>
          )}

          {turn.assistant?.provider && <ProviderCard provider={turn.assistant.provider} />}

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

      {/* The user's own appointments, in place. Rendered once below the thread
          rather than per turn: it is live data, and two copies of it in the same
          panel would disagree the moment one is cancelled. */}
      {showBookings && (
        <BookingList
          bookings={bookings}
          loading={bookingsBusy}
          onCancel={booking => setPendingCancel(booking)}
        />
      )}

      {pendingCancel && (
        <ConfirmCancel
          booking={pendingCancel}
          busy={cancelBusy}
          onConfirm={confirmCancel}
          onDismiss={() => setPendingCancel(null)}
        />
      )}

      {notice && <p className="rounded-xl bg-slate-100 px-3 py-2 text-xs leading-6">{notice}</p>}

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
