/**
 * «یارا» — the full-page conversational assistant (DR-11 pivot, 2026-08-01).
 *
 * This component assumes it is allowed to run: the gate lives one level up in
 * `yaraPage.tsx`, so this file is a *flow* (ask → render → follow up) and not a
 * second copy of the rollout rules.
 *
 * ### What is different from the in-search-box panel
 *
 * The panel could always fail silently, because the classic results were sitting
 * underneath it. **Here there is nothing underneath.** Every safety property the
 * panel got for free has to be built:
 *
 *  - a failed turn renders an *answer-shaped* block with a link to `/s/?text=…`
 *    built from the patient's own sentence — the sentence itself stays in the
 *    thread, so nothing they typed is ever lost;
 *  - «در حال بررسی…» has a hard ceiling (`withTimeout`), so no state can end in
 *    an endless spinner;
 *  - there is no error page and no empty bubble: `renderableAnswer` is what
 *    decides an answer is renderable, and anything else becomes the failure block.
 *
 * ### What is deliberately NOT here
 *
 * No typewriter/streaming animation. A fake token-by-token reveal on a health
 * page sells confidence the answer has not earned; «در حال بررسی…» is honest and
 * costs the patient nothing.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import {
  getConversation,
  postTurn,
  sendChatClick,
  sendChatExit,
  sendChatView,
  type ChatCard,
  type TurnResponse,
} from '../chatApi';
import { BookingList, ConfirmCancel, HistoryDrawer, ProviderCard } from '../chatSurfaces';
import {
  cancelBooking,
  fetchMyBookings,
  planClientAction,
  toChatContext,
  type BookingSummary,
} from '../userDataBridge';
import {
  FAILURE_CTA,
  FAILURE_TEXT,
  MAX_CARDS,
  STANDING_DISCLAIMER,
  STARTER_CHIPS,
  WELCOME_TEXT,
  YARA_ENTRY_POINT,
  fallbackSearchUrl,
  readSuggestions,
  withTimeout,
  type YaraStatus,
  type YaraTurn,
} from './yaraTurn';

/** «ی» on the brand gradient. Inline because it is one element, not a design system. */
const YaraAvatar = () => (
  <span
    aria-hidden="true"
    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
    style={{ background: 'linear-gradient(135deg,#7A5AF8,#2B6BE6)' }}
  >
    ی
  </span>
);

const DOT_CLASS: Record<YaraStatus, string> = {
  idle: 'bg-slate-300',
  ok: 'bg-green-500',
  // Not red-alarming, but definitively not the "everything is fine" green.
  failed: 'bg-amber-500',
};

const DOT_LABEL: Record<YaraStatus, string> = {
  idle: 'آماده',
  ok: 'متصل',
  failed: 'ارتباط برقرار نشد',
};

/**
 * Is there anything in this response worth showing as an answer?
 *
 * An orchestrator can answer 200 with a `mode: "chat"` envelope and no content at
 * all. Rendering that is the "empty bubble" the spec forbids, so an empty answer
 * is treated exactly like a network error: the patient gets the escape hatch.
 */
function renderableAnswer(res: TurnResponse | null): res is TurnResponse {
  if (!res || res.mode !== 'chat') return false;
  return Boolean(
    res.message?.trim() ||
      res.clarifying_question?.trim() ||
      res.emergency?.trim() ||
      res.provider ||
      res.guide ||
      res.results?.length ||
      res.client_action
  );
}

export const YaraChat = () => {
  const [turns, setTurns] = useState<YaraTurn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<YaraStatus>('idle');
  const [showHistory, setShowHistory] = useState(false);
  const conversationId = useRef('');

  /* ---- the user's own data, fetched by this browser and nowhere else ---- */
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [bookingsBusy, setBookingsBusy] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<BookingSummary | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const bookingsRef = useRef<BookingSummary[]>([]);

  const terminalId = useMemo(() => String(getCookie('terminal_id') ?? ''), []);

  const threadEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Best-effort: jsdom and older Safari have no scrollIntoView options.
    threadEnd.current?.scrollIntoView?.({ block: 'end' });
  }, [turns.length, busy]);

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
   * Carry out a `client_action`. Identical division of labour to the panel: the
   * fetch happens here with the user's own session, and a cancellation is only
   * ever *proposed* — `planClientAction` refuses anything it cannot match to a
   * booking this browser itself fetched.
   */
  const runClientAction = useCallback(
    async (action: NonNullable<TurnResponse['client_action']>) => {
      const rows = await loadBookings();
      const plan = planClientAction(action, rows);
      if (plan.kind === 'refuse') return;
      setShowBookings(true);
      if (plan.kind === 'confirm_cancel') setPendingCancel(plan.booking);
    },
    [loadBookings]
  );

  /**
   * One turn, end to end.
   *
   * The user bubble is appended by the caller **before** the request, so the
   * sentence is on screen from the first frame and survives every outcome — a
   * failed turn only ever *adds* the fallback block next to it.
   */
  const ask = useCallback(
    async (text: string) => {
      setBusy(true);
      setNotice('');
      // `?? null` collapses "timed out" and "call failed" into one value before
      // the guard, so the narrowing below has a single nullable to reason about.
      const res: TurnResponse | null =
        (await withTimeout(
          postTurn({
            text,
            // Everything typed into this page is a deliberate act — there is no
            // guessing surface here, so a turn is never `explicit: false`.
            explicit: true,
            conversationId: conversationId.current || undefined,
            terminalId,
            ...(bookingsRef.current.length ? { bookings: toChatContext(bookingsRef.current) } : {}),
          })
        )) ?? null;
      setBusy(false);

      // یک استثنای عامدانه، خوانده‌شده قبل از باریک‌شدنِ type: پاسخِ classic
      // می‌تواند حاملِ `emergency` باشد (red-flag + LLM مرده/بودجه‌ی صفر — گاردِ ۱ِ
      // safety سمتِ سرور). آن هشدار نباید همراهِ پاسخِ غیرقابل‌رندر دور ریخته شود؛
      // کنارِ درِ فرار می‌نشیند.
      const emergency = res?.emergency?.trim() || undefined;

      if (!renderableAnswer(res)) {
        // Network error, timeout, `mode: "classic"`, or a 200 with nothing in it.
        // All four are the same thing to the patient, so they get the same door.
        setStatus('failed');
        sendChatExit(conversationId.current, 'turn_failed', YARA_ENTRY_POINT);
        setTurns(current => {
          const next = [...current];
          const last = next[next.length - 1];
          if (last && !last.assistant) next[next.length - 1] = { ...last, failed: true, emergency };
          else next.push({ user: text, failed: true, emergency });
          return next;
        });
        return;
      }

      conversationId.current = res.conversation_id;
      setStatus('ok');
      sendChatView(res, YARA_ENTRY_POINT);
      setTurns(current => {
        const next = [...current];
        const last = next[next.length - 1];
        if (last && !last.assistant) next[next.length - 1] = { ...last, assistant: res, failed: false };
        else next.push({ user: text, assistant: res });
        return next;
      });
      if (res.client_action) void runClientAction(res.client_action);
    },
    [terminalId, runClientAction]
  );

  /** The one way a turn starts — chips, suggestions and the composer all go here. */
  const send = useCallback(
    (raw: string) => {
      const text = String(raw ?? '').trim();
      if (!text || busy) return;
      setTurns(current => [...current, { user: text }]);
      void ask(text);
    },
    [ask, busy]
  );

  const confirmCancel = useCallback(async () => {
    if (!pendingCancel) return;
    setCancelBusy(true);
    const out = await cancelBooking(pendingCancel);
    setCancelBusy(false);
    setPendingCancel(null);
    setNotice(out.message);
    if (out.ok) {
      // Re-read rather than patch: a locally "removed" booking that did not
      // actually cancel is the worst possible thing to show someone.
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
    setNotice('');
    const restored: YaraTurn[] = [];
    for (const m of found.messages) {
      if (m.role === 'user') restored.push({ user: m.text });
      else if (restored.length) restored[restored.length - 1].archivedAnswer = m.text;
    }
    setTurns(restored);
  }, []);

  return (
    <div dir="rtl" className="mx-auto flex min-h-screen w-full max-w-2xl flex-col bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-solid border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <YaraAvatar />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">یارا</h1>
              <span className="rounded-full bg-slate-100 px-2 py-[0.125rem] text-[0.625rem] text-slate-600">
                همراه سلامت شما
              </span>
            </div>
            <span className="flex items-center gap-1 text-[0.625rem] text-slate-400">
              <span
                data-testid="yara-status-dot"
                data-status={status}
                className={`inline-block h-[0.375rem] w-[0.375rem] rounded-full ${DOT_CLASS[status]}`}
              />
              {DOT_LABEL[status]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="text-xs text-slate-500 underline" onClick={() => setShowHistory(v => !v)}>
            گفتگوهای من
          </button>
          <Link
            href="/"
            prefetch={false}
            className="text-xs text-slate-500 underline"
            onClick={() => sendChatExit(conversationId.current, 'back_home', YARA_ENTRY_POINT)}
          >
            بازگشت
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-3 px-4 py-4">
        {showHistory && (
          <HistoryDrawer
            activeId={conversationId.current}
            onPick={openConversation}
            onClose={() => setShowHistory(false)}
          />
        )}

        {/* The welcome is static text, not a turn: a greeting must never cost a
            round-trip, and it must be on screen before anything can fail. */}
        {turns.length === 0 && (
          <>
            <p className="whitespace-pre-line rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-7 text-slate-700">
              {WELCOME_TEXT}
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTER_CHIPS.map(chip => (
                <button
                  key={chip}
                  type="button"
                  className="rounded-full border border-solid border-slate-300 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                  onClick={() => send(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </>
        )}

        {turns.map((turn, i) => (
          <div key={i} className="flex flex-col gap-2">
            <p className="max-w-[85%] self-end whitespace-pre-line rounded-2xl bg-primary/10 px-4 py-2 text-sm leading-7">
              {turn.user}
            </p>

            {(turn.assistant?.emergency || turn.emergency) && (
              <p className="rounded-xl border border-solid border-red-300 bg-red-50 p-3 text-sm font-bold leading-7 text-red-700">
                {turn.assistant?.emergency || turn.emergency}
              </p>
            )}

            {(turn.assistant?.message || turn.assistant?.clarifying_question || turn.archivedAnswer) && (
              <p className="max-w-[90%] self-start whitespace-pre-line rounded-2xl bg-slate-100 px-4 py-3 text-sm leading-7">
                {turn.assistant?.message || turn.assistant?.clarifying_question || turn.archivedAnswer}
              </p>
            )}

            {turn.assistant?.provider && <ProviderCard provider={turn.assistant.provider} />}

            {turn.assistant?.guide && (
              <a
                href={turn.assistant.guide.url}
                className="self-start rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
                onClick={() =>
                  sendChatExit(conversationId.current, `guide_${turn.assistant?.guide?.topic}`, YARA_ENTRY_POINT)
                }
              >
                {turn.assistant.guide.cta}
              </a>
            )}

            {/* Only the top few. An answer that lists ten doctors has handed the
                triage back to the patient, which is the thing this page exists to
                stop doing. */}
            {turn.assistant?.results?.slice(0, MAX_CARDS).map((card: ChatCard) => (
              <a
                key={card.id}
                href={card.url}
                data-testid="yara-result-card"
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
                    YARA_ENTRY_POINT
                  )
                }
                className="flex flex-col gap-1 rounded-xl border border-solid border-slate-200 p-3 text-xs hover:bg-slate-50"
              >
                <span className="text-sm font-bold">{card.title}</span>
                {card.expertise && <span className="text-slate-500">{card.expertise}</span>}
              </a>
            ))}

            {turn.assistant?.disclaimer && (
              <p className="text-[0.625rem] leading-5 text-slate-400">{turn.assistant.disclaimer}</p>
            )}

            {/* Tappable next steps. `readSuggestions` swallows every malformed
                shape, so this renders nothing rather than throwing. */}
            {readSuggestions(turn.assistant).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {readSuggestions(turn.assistant).map(s => (
                  <button
                    key={s.key}
                    type="button"
                    data-testid="yara-suggestion"
                    className="rounded-full border border-solid border-primary/40 px-3 py-2 text-xs text-primary hover:bg-primary/5"
                    onClick={() => send(s.label)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* 🔴 The no-dead-end guarantee. The user's own sentence is right above
                this block and is also what builds the link, so the worst outcome
                on this page is still one tap from a working search. */}
            {turn.failed && (
              <div
                data-testid="yara-failure"
                className="flex max-w-[90%] flex-col items-start gap-2 self-start rounded-2xl bg-slate-100 px-4 py-3"
              >
                <p className="text-sm leading-7 text-slate-700">{FAILURE_TEXT}</p>
                <a
                  href={fallbackSearchUrl(turn.user)}
                  className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white"
                  onClick={() => sendChatExit(conversationId.current, 'failure_to_search', YARA_ENTRY_POINT)}
                >
                  {FAILURE_CTA}
                </a>
              </div>
            )}
          </div>
        ))}

        {/* Live data, rendered once below the thread rather than per turn: two
            copies would disagree the moment one booking is cancelled. */}
        {showBookings && (
          <BookingList bookings={bookings} loading={bookingsBusy} onCancel={booking => setPendingCancel(booking)} />
        )}

        {pendingCancel && (
          <ConfirmCancel
            booking={pendingCancel}
            busy={cancelBusy}
            onConfirm={confirmCancel}
            onDismiss={() => setPendingCancel(null)}
          />
        )}

        {notice && <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm leading-7">{notice}</p>}

        {/* Honest, bounded, and not pretending to be typing. */}
        {busy && (
          <p data-testid="yara-busy" className="text-xs text-slate-400">
            در حال بررسی…
          </p>
        )}

        <div ref={threadEnd} />
      </main>

      <footer className="sticky bottom-0 border-t border-solid border-slate-200 bg-white px-4 pb-3 pt-2">
        <form
          className="flex gap-2"
          onSubmit={e => {
            e.preventDefault();
            const text = input.trim();
            if (!text || busy) return;
            setInput('');
            send(text);
          }}
        >
          <input
            className="flex-1 rounded-xl border border-solid border-slate-200 px-4 py-3 text-sm"
            placeholder="علائم، نام پزشک یا سؤال‌تان را بنویسید…"
            aria-label="پیام شما به یارا"
            value={input}
            maxLength={600}
            disabled={busy}
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-3 text-sm text-white disabled:opacity-50"
            disabled={busy || !input.trim()}
          >
            ارسال
          </button>
        </form>
        <p className="mt-2 text-center text-[0.625rem] leading-5 text-slate-400">{STANDING_DISCLAIMER}</p>
      </footer>
    </div>
  );
};

export default YaraChat;
