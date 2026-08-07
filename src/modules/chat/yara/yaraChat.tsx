/**
 * «یارا» — the full-page conversational assistant (DR-11 pivot, 2026-08-01;
 * rebuilt 2026-08-06 against the owner's «پنل یارا» design).
 *
 * This component assumes it is allowed to run: the gate lives one level up in
 * `yaraPage.tsx`, so this file is a *flow* (ask → render → follow up) and not a
 * second copy of the rollout rules.
 *
 * ### The shape the design asked for, and why each part earns its place
 *
 *  - **A rail, not a drawer.** History is a permanent column beside the thread
 *    (`YaraSidebar`) instead of a panel that opens over it. Switching between
 *    conversations is the main navigation of this page; it should not require
 *    covering the conversation you are in. Below `lg` it becomes an overlay,
 *    because 288px of rail on a phone would leave no thread.
 *  - **Sides carry meaning.** The patient's words sit at the start of the line
 *    on brand blue; Yara answers from the other side with an avatar and a white
 *    surface. Nobody should have to read a bubble to know who wrote it.
 *  - **An answer is a block, not a bubble.** Text, doctor cards, follow-up
 *    chips and the actions row are all one assistant turn, aligned to one
 *    gutter, so a recommendation reads as a single reply.
 *  - **A composer for sentences.** `YaraComposer` is a growing textarea with an
 *    example sheet — see its own file for why an `<input>` was the wrong tool.
 *
 * ### What the panel version never needed, still built here
 *
 * The in-search-box panel could always fail silently, because the classic
 * results were sitting underneath it. **Here there is nothing underneath.**
 *
 *  - a failed turn renders an *answer-shaped* block with a link to `/s/?text=…`
 *    built from the patient's own sentence — the sentence itself stays in the
 *    thread, so nothing they typed is ever lost;
 *  - «در حال بررسی…» has a hard ceiling (`withTimeout`), so no state can end in
 *    an endless spinner;
 *  - there is no error page and no empty bubble: `renderableAnswer` is what
 *    decides an answer is renderable, and anything else becomes the failure
 *    block.
 *
 * ### Restored conversations are conversations
 *
 * `openConversation` prefers the archive's structured `payload` and rebuilds a
 * normal turn from it, so history re-renders through this same component — the
 * flat audit transcript (numbered doctors, raw `/dr/` paths, «[گامِ بعد: …]») is
 * only ever a *legacy* fallback, and even then it is stripped of its audit
 * markers first. Rendering that transcript verbatim was the launch-day bug.
 *
 * ### What is deliberately NOT here
 *
 * No typewriter/streaming animation. A fake token-by-token reveal on a health
 * page sells confidence the answer has not earned; the bounded typing indicator
 * is honest and costs the patient nothing.
 *
 * 👍/👎 *do* exist now (2026-08-07): khesht's generic client-event ingest gives
 * them somewhere real to land, so they are no longer a button that swallows the
 * rating. Until that endpoint existed they were deliberately absent, for exactly
 * that reason.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Logo from '@/common/components/atom/logo';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import {
  getConversation,
  postTurn,
  sendChatClick,
  sendChatExit,
  sendChatView,
  sendYaraEvent,
  type ChatCard,
  type TurnResponse,
} from '../chatApi';
import { BookingList, ConfirmCancel, ProviderCard } from '../chatSurfaces';
import {
  cancelBooking,
  fetchMyBookings,
  planClientAction,
  toChatContext,
  type BookingSummary,
} from '../userDataBridge';
import {
  archivedTurnResponse,
  BETA_BADGE,
  classifyFailure,
  failureCopy,
  RETRY_CTA,
  BETA_NOTICE,
  FAILURE_CTA,
  FAILURE_TEXT,
  MAX_CARDS,
  stripTranscriptArtifacts,
  welcomeSubtitle,
  WELCOME_TITLE,
  STARTER_CHIPS,
  YARA_ENTRY_POINT,
  fallbackSearchUrl,
  readSuggestions,
  withTimeout,
  type YaraStatus,
  type YaraTurn,
} from './yaraTurn';
import YaraDoctorCard, { YaraDoctorList } from './yaraDoctorCard';
import YaraSidebar from './yaraSidebar';
import YaraComposer from './yaraComposer';
import { clearSnapshot, readSnapshot, snapshotMatches, writeSnapshot } from './yaraSession';

/**
 * Yara answers with the **paziresh24 mark**, not a private «ی» monogram.
 *
 * owner (2026-08-07): «در چت‌ها لوگوی یارا همان لوگوی پذیرش۲۴ باشد.» A second
 * brand mark inside our own product asks the patient to trust a new thing; the
 * point is that this *is* paziresh24 talking.
 */
const YaraAvatar = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => (
  <span
    className={`grid shrink-0 place-items-center rounded-full border border-solid border-[#e6e8ec] bg-white ${
      size === 'lg' ? 'h-14 w-14' : 'mt-0.5 h-8 w-8'
    }`}
  >
    <Logo width={size === 'lg' ? 30 : 18} type="compact" />
  </span>
);

const DOT_CLASS: Record<YaraStatus, string> = {
  idle: 'bg-slate-300',
  ok: 'bg-green-500',
  // Not red-alarming, but definitively not the "everything is fine" green.
  failed: 'bg-amber-500',
};

const DOT_LABEL: Record<YaraStatus, string> = {
  idle: 'یارا آمادهٔ پاسخ‌گویی است',
  ok: 'یارا آمادهٔ پاسخ‌گویی است',
  failed: 'ارتباط برقرار نشد',
};

/** A centred pill for things that happened *to* the thread, not *in* it. */
const ThreadNote = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center">
    <span className="rounded-full bg-[#e9ecf1] px-3 py-1 text-[0.6875rem] text-[#667085]">{children}</span>
  </div>
);

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

/** The assistant's visual identity: avatar on the far side, content in a column. */
const AssistantRow = ({ children }: { children: React.ReactNode }) => (
  // row-reverse so the avatar (first child) lands on the outer edge in RTL.
  <div className="flex flex-row-reverse justify-end gap-3">
    <YaraAvatar />
    <div className="flex min-w-0 flex-1 flex-col gap-3">{children}</div>
  </div>
);

const CHIP_CLASS =
  'h-[2.125rem] rounded-full border border-solid border-[#e6e8ec] bg-white px-3.5 text-xs text-[#344054] transition-colors hover:border-primary hover:text-primary';

export const YaraChat = () => {
  const [turns, setTurns] = useState<YaraTurn[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<YaraStatus>('idle');
  const [showRail, setShowRail] = useState(false);
  const [railKey, setRailKey] = useState(0);
  const [copiedAt, setCopiedAt] = useState(-1);
  const [ratings, setRatings] = useState<Record<number, 1 | -1>>({});
  const conversationId = useRef('');
  const router = useRouter();
  const scroller = useRef<HTMLDivElement | null>(null);
  const restored = useRef(false);

  /* ---- the user's own data, fetched by this browser and nowhere else ---- */
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [bookingsBusy, setBookingsBusy] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [pendingCancel, setPendingCancel] = useState<BookingSummary | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const bookingsRef = useRef<BookingSummary[]>([]);

  const terminalId = useMemo(() => String(getCookie('terminal_id') ?? ''), []);
  /**
   * شخصی‌سازی (dr-11 §۱۳.۸): نامِ کوچک فقط برای خوش‌آمدِ کلاینت‌ساید — هرگز به
   * khesht/provider نمی‌رود. شهر از همان کوکیِ `new-city` که کادرِ جستجو می‌خواند،
   * تا یارا بدونِ پرسشِ بدیهی («کدام شهر؟») همان شهرِ کاربر را بگردد.
   */
  const userFirstName = useUserInfoStore(state => state.info?.name);
  const city = useMemo(() => {
    try {
      const parsed = JSON.parse(String(getCookie('new-city') ?? '')) as { en_slug?: string };
      return parsed?.en_slug || 'ir';
    } catch {
      return 'ir';
    }
  }, []);

  const threadEnd = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // Best-effort: jsdom and older Safari have no scrollIntoView options.
    threadEnd.current?.scrollIntoView?.({ block: 'end', behavior: 'smooth' });
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
      let timedOut = false;
      const startedAt = Date.now();
      const res: TurnResponse | null =
        (await withTimeout(
          postTurn({
            text,
            // Everything typed into this page is a deliberate act — there is no
            // guessing surface here, so a turn is never `explicit: false`.
            explicit: true,
            conversationId: conversationId.current || undefined,
            terminalId,
            city,
            ...(bookingsRef.current.length ? { bookings: toChatContext(bookingsRef.current) } : {}),
          }),
          undefined,
          () => {
            timedOut = true;
          }
        )) ?? null;
      setBusy(false);

      // یک استثنای عامدانه، خوانده‌شده قبل از باریک‌شدنِ type: پاسخِ classic
      // می‌تواند حاملِ `emergency` باشد (red-flag + LLM مرده/بودجه‌ی صفر — گاردِ ۱ِ
      // safety سمتِ سرور). آن هشدار نباید همراهِ پاسخِ غیرقابل‌رندر دور ریخته شود؛
      // کنارِ درِ فرار می‌نشیند.
      const emergency = res?.emergency?.trim() || undefined;
      // Read **before** the type guard: `renderableAnswer` narrows `res` away to
      // `null`, and a `mode:'classic'` body — the one that actually carries a
      // reason — is exactly the case that fails the guard.
      const reached = res !== null;
      const fallbackReason = res?.fallback_reason;

      if (!renderableAnswer(res)) {
        // Network error, timeout, `mode: "classic"`, or a 200 with nothing in it.
        // All four are the same thing to the patient, so they get the same door.
        setStatus('failed');
        // Four outcomes that used to be one sentence. `reached` is the honest
        // signal for "the server answered at all" — a `mode:'classic'` body did,
        // a network error did not.
        const failureKind = classifyFailure({
          timedOut,
          reached,
          fallbackReason,
        });
        sendChatExit(conversationId.current, 'turn_failed', YARA_ENTRY_POINT);
        // The reason khesht gave us is kept verbatim in analytics even though the
        // patient never sees it — that asymmetry is the whole point of §۱۳.۱۰.
        sendYaraEvent('turn_failed', {
          failure_kind: failureKind,
          fallback_reason: String(fallbackReason ?? ''),
          duration_ms: Date.now() - startedAt,
          conversation_id: conversationId.current,
          turn_number: turns.length + 1,
        });
        setTurns(current => {
          const next = [...current];
          const last = next[next.length - 1];
          if (last && !last.assistant) next[next.length - 1] = { ...last, failed: true, failureKind, emergency };
          else next.push({ user: text, failed: true, failureKind, emergency });
          return next;
        });
        return;
      }

      const isFirstTurn = !conversationId.current;
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
      // A conversation only exists in the archive once it has an answer, so the
      // rail is re-read exactly then — not on every turn, which would refetch
      // the whole list for a row that is already in it.
      if (isFirstTurn) setRailKey(k => k + 1);
      sendYaraEvent('turn_answered', {
        conversation_id: res.conversation_id,
        turn_index: res.turn_index,
        result_count: res.result_count ?? 0,
        has_emergency: Boolean(res.emergency),
        is_clarifying: Boolean(res.clarifying_question && !res.message),
        duration_ms: Date.now() - startedAt,
      });
      if (res.client_action) void runClientAction(res.client_action);
    },
    [terminalId, city, runClientAction]
  );

  /** The one way a turn starts — chips, suggestions and the composer all go here. */
  const send = useCallback(
    (raw: string) => {
      const text = String(raw ?? '').trim();
      if (!text || busy) return;
      setShowRail(false);
      setTurns(current => [...current, { user: text, at: Date.now() }]);
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

  /** «گفت‌وگوی جدید» — a clean thread, without reloading the page. */
  const newChat = useCallback(() => {
    conversationId.current = '';
    setTurns([]);
    setShowBookings(false);
    setPendingCancel(null);
    setNotice('');
    setStatus('idle');
    setShowRail(false);
    clearSnapshot();
    void router.push({ pathname: '/yara' }, undefined, { shallow: true });
  }, [router]);

  /**
   * Open an earlier conversation and continue it — «سوییچ بین چت‌ها».
   *
   * Structured `payload` first, stripped transcript text as the legacy fallback —
   * see the file comment: the transcript in a bubble was the launch-day bug.
   */
  const openConversation = useCallback(async (id: string) => {
    const found = await getConversation(id);
    if (!found) return;
    conversationId.current = id;
    // A real history entry, so «back» steps *between* conversations before it
    // ever leaves Yara. `shallow` because the page has no server data to refetch.
    void router.push({ pathname: '/yara', query: { c: id } }, undefined, { shallow: true });
    setShowRail(false);
    setShowBookings(false);
    setNotice('');
    const restored: YaraTurn[] = [];
    for (const m of found.messages) {
      if (m.role === 'user') {
        restored.push({ user: m.text });
        continue;
      }
      if (!restored.length) continue;
      const last = restored[restored.length - 1];
      const structured = archivedTurnResponse(m.payload);
      if (structured) last.assistant = structured;
      else last.archivedAnswer = stripTranscriptArtifacts(m.text);
    }
    setTurns(restored);
  }, []);

  const copyAnswer = useCallback((index: number, text: string) => {
    // No polyfill and no fallback prompt: on a browser without the async
    // clipboard the button simply does nothing visible, which is better than a
    // modal full of text the patient did not ask for.
    void navigator?.clipboard?.writeText?.(text);
    setCopiedAt(index);
    setTimeout(() => setCopiedAt(-1), 1600);
  }, []);

  /**
   * Come back from a doctor profile and the thread is still there.
   *
   * Runs once: a later `?c=` change is the rail's job, and re-running this would
   * fight it. `restored` also guards against the snapshot re-appearing after the
   * patient explicitly started a new conversation.
   */
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    const urlId = String(router.query.c ?? '');
    const snapshot = readSnapshot();
    if (snapshotMatches(snapshot, urlId) && snapshot) {
      conversationId.current = snapshot.conversationId;
      setTurns(snapshot.turns);
      setStatus('ok');
      // After paint, or the container has no height to scroll yet.
      requestAnimationFrame(() => {
        if (scroller.current) scroller.current.scrollTop = snapshot.scrollTop;
      });
      return;
    }
    if (urlId) void openConversation(urlId);
  }, [router.query.c, openConversation]);

  useEffect(() => {
    writeSnapshot({
      conversationId: conversationId.current,
      turns,
      scrollTop: scroller.current?.scrollTop ?? 0,
    });
  }, [turns]);

  /**
   * 👍/👎. Recorded locally so the button visibly latches, and sent once — a
   * changed mind sends a second event rather than editing the first, because an
   * analytics row is a record of what happened, not a mutable opinion.
   */
  const rateAnswer = useCallback(
    (index: number, value: 1 | -1, turn: YaraTurn) => {
      setRatings(current => ({ ...current, [index]: value }));
      sendYaraEvent('answer_rated', {
        rating: value,
        conversation_id: conversationId.current,
        turn_index: turn.assistant?.turn_index ?? index,
        result_count: turn.assistant?.result_count ?? 0,
      });
    },
    []
  );

  /** اولین turnِ پاسخ‌دار — لنگرِ نمایشِ تک‌بارِ سلبِ مسئولیت (§۱۳.۸). */
  const firstAnsweredIndex = turns.findIndex(t => t.assistant);

  const statusDot = (
    <>
      <span
        data-testid="yara-status-dot"
        data-status={status}
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASS[status]}`}
      />
      {DOT_LABEL[status]}
    </>
  );

  const rail = (
    <YaraSidebar
      activeId={conversationId.current}
      refreshKey={railKey}
      statusDot={statusDot}
      onPick={openConversation}
      onNewChat={newChat}
    />
  );

  return (
    <div dir="rtl" className="flex min-h-0 w-full flex-1 flex-col bg-[#f2f3f5] text-[#101828]">

      <div className="grid min-h-0 flex-1 lg:grid-cols-[18rem_1fr]" style={{ height: 'calc(100dvh - 8rem)' }}>
        <div className="hidden min-h-0 lg:block">{rail}</div>

        {/* Below `lg` the same rail slides over the thread — one component, two
            placements, so history can never drift between them. */}
        {showRail && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              role="presentation"
              className="absolute inset-0 bg-black/30"
              onClick={() => setShowRail(false)}
            />
            <div className="absolute inset-y-0 right-0 w-[18rem] max-w-[85vw] shadow-xl">{rail}</div>
          </div>
        )}

        <main className="flex min-h-0 flex-col overflow-hidden">
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto py-7" aria-live="polite">
            <div className="mx-auto flex w-full max-w-[47.5rem] flex-col gap-7 px-4">
              {/* Below `lg` the rail is an overlay, so it needs a way in. It is a
                  quiet pill inside the thread rather than a second header bar —
                  the site header above already owns that row. */}
              <button
                type="button"
                data-testid="yara-rail-toggle"
                className="self-start rounded-full border border-solid border-[#e6e8ec] bg-white px-3.5 py-1.5 text-xs text-[#475467] lg:hidden"
                onClick={() => setShowRail(true)}
              >
                گفت‌وگوهای من
              </button>
              {/* The welcome is static content, not a turn: a greeting must never
                  cost a round-trip, and it must be on screen before anything can
                  fail. */}
              {turns.length === 0 && (
                <div className="flex flex-col items-center gap-3.5 pb-2 pt-14 text-center">
                  <YaraAvatar size="lg" />
                  <h2 className="text-2xl font-bold">{WELCOME_TITLE}</h2>
                  <p className="max-w-md text-sm leading-7 text-[#667085]">{welcomeSubtitle(userFirstName)}</p>
                  <div className="flex items-center gap-2 rounded-full border border-solid border-[#e6e8ec] bg-white px-3.5 py-1.5 text-[0.6875rem] text-[#475467]">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-primary">{BETA_BADGE}</span>
                    {BETA_NOTICE}
                  </div>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {STARTER_CHIPS.map(chip => (
                      <button key={chip} type="button" className={CHIP_CLASS} onClick={() => send(chip)}>
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {turns.length > 0 && <ThreadNote>{`${BETA_BADGE} — ${BETA_NOTICE}`}</ThreadNote>}

              {turns.map((turn, i) => (
                <div key={i} className="flex flex-col gap-7">
                  {/* The patient's own words — unmistakably theirs, never restyled away. */}
                  <div className="flex justify-start">
                    <p className="max-w-[78%] whitespace-pre-line rounded-2xl rounded-br-[0.25rem] bg-primary px-4 py-3 text-sm leading-7 text-white">
                      {turn.user}
                    </p>
                  </div>

                  {(turn.assistant || turn.archivedAnswer || turn.failed || turn.emergency) && (
                    <AssistantRow>
                      {(turn.assistant?.emergency || turn.emergency) && (
                        <p
                          role="alert"
                          className="rounded-2xl border border-solid border-red-300 bg-red-50 px-4 py-3 text-sm font-bold leading-7 text-red-700"
                        >
                          {turn.assistant?.emergency || turn.emergency}
                        </p>
                      )}

                      {(turn.assistant?.message || turn.assistant?.clarifying_question || turn.archivedAnswer) && (
                        <p className="whitespace-pre-line rounded-2xl rounded-bl-[0.25rem] border border-solid border-[#e6e8ec] bg-white px-4 py-3.5 text-sm leading-7 text-[#1d2939]">
                          {turn.assistant?.message || turn.assistant?.clarifying_question || turn.archivedAnswer}
                        </p>
                      )}

                      {turn.assistant?.provider && <ProviderCard provider={turn.assistant.provider} />}

                      {turn.assistant?.guide && (
                        <a
                          href={turn.assistant.guide.url}
                          className="self-start rounded-[0.5625rem] bg-primary px-5 py-2.5 text-xs font-bold text-white"
                          onClick={() =>
                            sendChatExit(
                              conversationId.current,
                              `guide_${turn.assistant?.guide?.topic}`,
                              YARA_ENTRY_POINT
                            )
                          }
                        >
                          {turn.assistant.guide.cta}
                        </a>
                      )}

                      {/* Only the top few, as full trust cards, in one framed list.
                          An answer that lists ten doctors has handed the triage
                          back to the patient, which is the thing this page exists
                          to stop doing. */}
                      {!!turn.assistant?.results?.length && (
                        <YaraDoctorList>
                          {turn.assistant.results.slice(0, MAX_CARDS).map((card: ChatCard) => (
                            <YaraDoctorCard
                              key={card.id}
                              card={card}
                              onClick={() => {
                                sendYaraEvent('card_click', {
                                  conversation_id: conversationId.current,
                                  turn_index: turn.assistant?.turn_index ?? 0,
                                  position: card.position,
                                  card_type: card.type,
                                  online_visit: Boolean(card.online_visit),
                                });
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
                                );
                              }}
                            />
                          ))}
                        </YaraDoctorList>
                      )}

                      {/* سلبِ مسئولیت فقط روی اولین پاسخ — تکرارش زیرِ هر پیام همان
                          «محافظه‌کاریِ رباتیک»ی است که owner نخواست (§۱۳.۸)؛ خطِ ثابتِ
                          زیرِ composer همیشه حاضر است، پس M-7 هم پابرجاست. */}
                      {turn.assistant?.disclaimer && i === firstAnsweredIndex && (
                        <p className="text-[0.6875rem] leading-5 text-[#98a2b3]">{turn.assistant.disclaimer}</p>
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
                              className={CHIP_CLASS}
                              onClick={() => send(s.label)}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Actions on a *delivered* answer only. Both do something
                          real — copy the text, ask the same question again — which
                          is why 👍/👎 are not here (see the file comment). */}
                      {turn.assistant && (
                        <div className="flex flex-wrap items-center gap-1 text-[0.6875rem] text-[#98a2b3]">
                          <button
                            type="button"
                            className="rounded-md px-2 py-1 text-[#667085] transition-colors hover:bg-[#eceef2] hover:text-[#101828]"
                            onClick={() =>
                              copyAnswer(
                                i,
                                String(turn.assistant?.message || turn.assistant?.clarifying_question || '')
                              )
                            }
                          >
                            {copiedAt === i ? 'کپی شد' : 'کپی'}
                          </button>
                          <button
                            type="button"
                            className="rounded-md px-2 py-1 text-[#667085] transition-colors hover:bg-[#eceef2] hover:text-[#101828] disabled:opacity-40"
                            disabled={busy}
                            onClick={() => send(turn.user)}
                          >
                            پاسخ دیگر
                          </button>
                          <button
                            type="button"
                            aria-label="این پاسخ کمک کرد"
                            aria-pressed={ratings[i] === 1}
                            data-testid="yara-rate-up"
                            className={`rounded-md px-2 py-1 transition-colors hover:bg-[#eceef2] ${
                              ratings[i] === 1 ? 'text-primary' : 'text-[#667085] hover:text-[#101828]'
                            }`}
                            onClick={() => rateAnswer(i, 1, turn)}
                          >
                            👍
                          </button>
                          <button
                            type="button"
                            aria-label="این پاسخ کمک نکرد"
                            aria-pressed={ratings[i] === -1}
                            data-testid="yara-rate-down"
                            className={`rounded-md px-2 py-1 transition-colors hover:bg-[#eceef2] ${
                              ratings[i] === -1 ? 'text-[#e5343f]' : 'text-[#667085] hover:text-[#101828]'
                            }`}
                            onClick={() => rateAnswer(i, -1, turn)}
                          >
                            👎
                          </button>
                          {turn.at && (
                            <span className="px-2">
                              {new Date(turn.at).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      )}

                      {/* 🔴 The no-dead-end guarantee. The user's own sentence is right
                          above this block and is also what builds the link, so the worst
                          outcome on this page is still one tap from a working search. */}
                      {turn.failed && (
                        <div
                          data-testid="yara-failure"
                          data-kind={turn.failureKind ?? 'unavailable'}
                          className="flex flex-col items-start gap-2.5 rounded-2xl rounded-bl-[0.25rem] border border-solid border-amber-200 bg-amber-50 px-4 py-3.5"
                        >
                          <p className="text-sm leading-7 text-[#475467]">
                            {failureCopy(turn.failureKind ?? 'unavailable').text}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* A retry is the *right* door for a timeout or a dead
                                connection — sending them to classic search would
                                lose the conversation for a problem that is very
                                often gone one second later. */}
                            {failureCopy(turn.failureKind ?? 'unavailable').retry && (
                              <button
                                type="button"
                                data-testid="yara-retry"
                                disabled={busy}
                                className="rounded-[0.5625rem] bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
                                onClick={() => {
                                  sendYaraEvent('failure_retry', { failure_kind: turn.failureKind ?? '' });
                                  send(turn.user);
                                }}
                              >
                                {RETRY_CTA}
                              </button>
                            )}
                            <a
                              href={fallbackSearchUrl(turn.user)}
                              className="rounded-[0.5625rem] border border-solid border-[#d0d5dd] bg-white px-4 py-2 text-xs font-bold text-[#344054]"
                              onClick={() =>
                                sendChatExit(conversationId.current, 'failure_to_search', YARA_ENTRY_POINT)
                              }
                            >
                              {FAILURE_CTA}
                            </a>
                          </div>
                        </div>
                      )}
                    </AssistantRow>
                  )}
                </div>
              ))}

              {/* Live data, rendered once below the thread rather than per turn: two
                  copies would disagree the moment one booking is cancelled. */}
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

              {notice && (
                <p className="rounded-2xl border border-solid border-[#e6e8ec] bg-white px-4 py-3 text-sm leading-7">
                  {notice}
                </p>
              )}

              {/* Honest, bounded, and shaped like an incoming message — not a floating
                  sentence. The hard ceiling is `withTimeout`, not this animation. */}
              {busy && (
                <div data-testid="yara-busy" aria-label="در حال بررسی">
                  <AssistantRow>
                    <span className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-[0.25rem] border border-solid border-[#e6e8ec] bg-white px-4 py-4">
                      {[0, 150, 300].map(delay => (
                        <span
                          key={delay}
                          className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#98a2b3]"
                          style={{ animationDelay: `${delay}ms` }}
                        />
                      ))}
                    </span>
                  </AssistantRow>
                </div>
              )}

              <div ref={threadEnd} />
            </div>
          </div>

          <YaraComposer busy={busy} onSend={send} />
        </main>
      </div>
    </div>
  );
};

export default YaraChat;
