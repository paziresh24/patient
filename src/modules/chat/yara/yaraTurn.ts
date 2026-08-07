/**
 * The rules of one Yara turn, as pure functions.
 *
 * They live outside the component because every one of them is a *promise to the
 * patient* — «متن‌تان گم نمی‌شود»، «هیچ‌وقت اسپینرِ بی‌پایان نمی‌بینید» — and a
 * promise that only exists inside a `useCallback` is a promise nobody can test.
 *
 * DR-11 (pivot «یارا»), 2026-08-01.
 */
import type { ConversationSummary, TurnResponse } from '../chatApi';

/** Analytics surface id. One string, one place — see `ChatEntryPoint`. */
export const YARA_ENTRY_POINT = 'yara' as const;

/**
 * How many provider cards one answer may show.
 *
 * Same number as the in-search-box panel, for a different reason: there, the
 * classic results were underneath and the box had to stay a box. Here there is
 * nothing underneath, so the limit is about the answer staying an *answer*
 * rather than turning into a result list the patient has to re-triage.
 */
export const MAX_CARDS = 3;

/** The welcome turn — static text, never a paid round-trip. */
export const WELCOME_TEXT =
  'سلام! من یارا هستم، همراه سلامت شما. از پیدا کردن پزشک تا نوبت‌گیری کنارتان هستم. چه کمکی از من برمی‌آید؟';

/**
 * شخصی‌سازیِ خوش‌آمد با نامِ کوچک (چشم‌اندازِ owner، dr-11 §۱۳.۸): «بیمار را به
 * اسم صدا بزند». عمداً **فقط سمتِ کلاینت** — نام هرگز به khesht/providerِ LLM
 * نمی‌رود: هم PIIِ کمتر، هم اینکه پاسخِ cacheشده‌ی مدل (کلیدِ cache نام ندارد)
 * می‌توانست نامِ یک کاربر را به کاربرِ بعدی نشان دهد.
 */
export function welcomeText(firstName?: string | null): string {
  const name = String(firstName ?? '').trim().split(/\s+/)[0];
  if (!name || name.length > 30) return WELCOME_TEXT;
  return `سلام ${name} عزیز! من یارا هستم، همراه سلامت شما. از پیدا کردن پزشک تا نوبت‌گیری کنارتان هستم. چه کمکی از من برمی‌آید؟`;
}

export const STARTER_CHIPS = [
  'حالم خوب نیست، کمکم کنید',
  'از پزشک مشخصی نوبت می‌خواهم',
  'پیگیری نوبت‌هایم',
] as const;

/**
 * The empty state opens with a **question**, not a nameplate.
 *
 * owner (2026-08-07): «تیتر اصلی "یارا، دستیار سلامت پذیرش۲۴" اصلا خوب نیست …
 * نیازه که یک جمله سوالی دوستانه پرسیده بشه که کاربر باهاش هم متوجه عملکرد و
 * کاربرد این ابزار بشه، هم ترغیب به طرح مشکلش بکنه.» A title that states who we
 * are asks the patient to admire the product; a question asks them to start. The
 * product name moved down to the subtitle, where it costs nothing.
 */
export const WELCOME_TITLE = 'امروز چه چیزی اذیت‌تان می‌کند؟';
export const WELCOME_SUBTITLE =
  'علائم‌تان را ساده بنویسید — می‌گویم به کدام پزشک مراجعه کنید، پزشکِ مناسب را پیدا می‌کنم و نوبتش را همین‌جا می‌گیرم.';

/**
 * Same client-only personalisation rule as `welcomeText`, applied to the new
 * hero: the name decorates the sentence in this browser and never travels to
 * khesht (see the note on `welcomeText`).
 */
export function welcomeSubtitle(firstName?: string | null): string {
  const name = String(firstName ?? '').trim().split(/\s+/)[0];
  if (!name || name.length > 30) return WELCOME_SUBTITLE;
  return `${name} عزیز، ${WELCOME_SUBTITLE}`;
}

/**
 * Placeholders that rotate while the box is empty.
 *
 * owner (2026-08-07): «متن placeholder … بصورت انیمیشن و هر چند ثانیه عوض میشه …
 * باعث میشه که بیمار بفهمه چه چیزهایی رو میتونه مطرح کنه.» An empty box is a
 * question with no examples; most people answer it with a keyword, which is
 * exactly the behaviour this page exists to change.
 *
 * Deliberately **four different kinds** of request — a symptom, a named doctor,
 * a follow-up on an existing booking, an administrative task — because the point
 * is to widen what the patient believes they may ask, not to show four symptoms.
 */
export const ROTATING_PLACEHOLDERS = [
  'چند روزه گردنم درد می‌کند و دستم بی‌حس می‌شود…',
  'از دکتر رضایی، متخصص پوست، نوبت می‌خواهم',
  'نوبت‌های ثبت‌شده‌ام را نشانم بده',
  'تب کودک ۳ ساله؛ چه زمانی باید به اورژانس برویم؟',
  'نزدیک‌ترین نوبتِ ارتوپد در شهرم کِی است؟',
  'می‌خواهم نوبت فردا را لغو کنم',
] as const;

/** Seconds each placeholder stays. Long enough to read a Persian sentence, once. */
export const PLACEHOLDER_INTERVAL_MS = 3500;

/**
 * Once a conversation exists, the rotation stops.
 *
 * owner: «وقتی چت آغاز شده دیگه اون placeholder از موضوعیت میافته.» Rotating
 * example questions *under* an answer invites the patient to abandon the thread
 * they are in; a mid-conversation box only needs to say "keep going".
 */
export const FOLLOW_UP_PLACEHOLDER = 'پاسخ‌تان را بنویسید یا سؤال بعدی را بپرسید…';

/** Beta framing. Shown once in the hero and once at the head of a thread. */
export const BETA_BADGE = 'نسخهٔ بتا';
export const BETA_NOTICE = 'در دورهٔ آزمایشی، استفاده از یارا رایگان است';

/**
 * Example questions offered above the composer while it is empty and focused.
 *
 * These are *prompts*, not promises: each one is a sentence Yara can already
 * take as an ordinary turn, so tapping one is identical to typing it.
 */
export const COMPOSER_SUGGESTIONS = [
  'سردردم چند روز است ادامه دارد، چه کار کنم؟',
  'نزدیک‌ترین نوبت متخصص پوست را می‌خواهم',
  'تب کودک ۳ ساله؛ چه زمانی باید به اورژانس برویم؟',
  'کمردرد بعد از ورزش — ارتوپد یا فیزیوتراپ؟',
  // ⚠️ Deliberately worded differently from `STARTER_CHIPS`: two buttons with the
  // same label on one screen are ambiguous to a screen reader and to a test.
  'از دکتر مشخصی می‌خواهم نوبت بگیرم',
  'نوبت‌های ثبت‌شده‌ام را نشانم بده',
] as const;

/** Shown under the composer on every render — not a per-answer disclaimer. */
export const STANDING_DISCLAIMER = 'یارا تشخیص پزشکی نمی‌دهد؛ تصمیم نهایی با پزشک شماست';

/**
 * The failure copy. It says one true thing and offers one working door.
 *
 * ⛔ It must never mention budget, cost, quota or an LLM. Why the patient cannot
 * be answered right now is our problem, not theirs, and «سقفِ هزینه تمام شد» on a
 * health page reads as «شما به‌اندازه‌ی کافی مهم نبودید».
 */
export const FAILURE_TEXT = 'الان نمی‌توانم گفتگو کنم؛ عذر می‌خواهم.';
export const FAILURE_CTA = 'همین متن را در جستجو ببین';
export const RETRY_CTA = 'دوباره تلاش کن';

/**
 * Why a turn produced no answer — the *front end's* vocabulary, not khesht's.
 *
 * Four back-end reasons collapse into `unavailable` on purpose: whether the LLM
 * errored, the daily budget ran out, or a tool failed is our problem, and none
 * of those sentences helps a patient decide what to do next. What genuinely
 * changes their next action is kept separate: a timeout and a dead connection
 * are worth *retrying*, "too busy" is worth retrying *in a moment*, and
 * `unavailable` is worth leaving for the classic search.
 */
export type YaraFailureKind = 'timeout' | 'offline' | 'busy' | 'unavailable';

/** Map khesht's `fallback_reason` (or a transport failure) to one of the four. */
export function classifyFailure(input: {
  timedOut?: boolean;
  reached?: boolean;
  fallbackReason?: string | undefined;
}): YaraFailureKind {
  if (input.timedOut) return 'timeout';
  if (!input.reached) return 'offline';
  if (String(input.fallbackReason ?? '') === 'rate_limited') return 'busy';
  return 'unavailable';
}

/**
 * One sentence per kind, plus which doors to open.
 *
 * ⛔ No copy here may mention budget, cost, quota or an LLM — «سقفِ هزینه تمام
 * شد» on a health page reads as «شما به‌اندازه‌ی کافی مهم نبودید». Saying *what
 * happened to the patient* («طول کشید»، «شلوغ است») is not the same as saying
 * what it cost us, and only the first helps them.
 */
export function failureCopy(kind: YaraFailureKind): { text: string; retry: boolean; search: boolean } {
  switch (kind) {
    case 'timeout':
      return { text: 'پاسخ بیشتر از حد طول کشید و نیمه‌کاره ماند.', retry: true, search: true };
    case 'offline':
      return { text: 'ارتباط با یارا برقرار نشد؛ اتصال اینترنت‌تان را بررسی کنید.', retry: true, search: true };
    case 'busy':
      return { text: 'همین حالا خیلی شلوغ است؛ چند لحظه‌ی دیگر دوباره امتحان کنید.', retry: true, search: true };
    default:
      return { text: FAILURE_TEXT, retry: false, search: true };
  }
}

/**
 * The escape hatch, built from the patient's **own** words.
 *
 * This is the single reason a failed turn is not a dead end: the sentence they
 * typed is still in the thread and still one tap away from a working search.
 */
export function fallbackSearchUrl(userText: string): string {
  return `/s/?text=${encodeURIComponent(String(userText ?? '').trim())}`;
}

export interface YaraSuggestion {
  key: string;
  label: string;
}

/**
 * Read `suggestions` off a turn without ever trusting its shape.
 *
 * The orchestrator is adding this field *after* this page shipped, so on the day
 * it lands the front end must already be correct for: absent, `null`, not an
 * array, array of strings, array of objects missing `label`. Every one of those
 * means «چیزی نشان نده» — a surface that throws on an unexpected payload turns a
 * back-end iteration into a front-end outage.
 */
export function readSuggestions(res: TurnResponse | undefined): YaraSuggestion[] {
  const raw = (res as { suggestions?: unknown } | undefined)?.suggestions;
  if (!Array.isArray(raw)) return [];
  return raw
    .map(item => {
      const key = String((item as { key?: unknown })?.key ?? '');
      const label = String((item as { label?: unknown })?.label ?? '').trim();
      return { key: key || label, label };
    })
    .filter(s => Boolean(s.label))
    .slice(0, 6);
}

/** One line in the thread. `failed` is a first-class state, not an absent answer. */
export interface YaraTurn {
  user: string;
  /**
   * When the patient sent it, `Date.now()`. Only ever used to stamp the answer
   * in the thread — a restored conversation has no live clock, so it is absent
   * there and the stamp simply does not render.
   */
  at?: number;
  assistant?: TurnResponse;
  /** Restored from the archive: text only, no live payload to re-render. */
  archivedAnswer?: string;
  /** The turn ended without a usable answer ⇒ render the escape hatch. */
  failed?: boolean;
  /** Which door to open, and with which sentence — see `classifyFailure`. */
  failureKind?: YaraFailureKind;
  /**
   * هشدارِ اورژانسی که روی یک پاسخِ **غیرقابل‌رندر** آمده (mode:'classic' وقتی
   * LLM مرده یا بودجه تمام است — khesht آن را عمداً به fallback هم می‌چسباند).
   * جدا از `assistant` نگه داشته می‌شود چون آن پاسخ رندرشدنی نیست ولی این هشدار
   * باید باشد: گم‌شدنِ پیامِ ۱۱۵ پشتِ درِ فرار، بدترین باختِ ممکنِ این صفحه است.
   */
  emergency?: string;
}

/**
 * Was the last request healthy? Drives the header dot, and it is deliberately
 * three-valued: a green dot before anything has been asked would be a claim we
 * have not earned yet.
 */
export type YaraStatus = 'idle' | 'ok' | 'failed';

/**
 * A hard ceiling on «در حال بررسی…».
 *
 * `postTurn` has no timeout of its own, so a hung connection would leave the
 * busy indicator on screen forever — precisely the state this page is not
 * allowed to have. A timeout resolves to `null`, which is the same thing as a
 * network error to every caller, so there is exactly one failure path.
 */
export const TURN_TIMEOUT_MS = 20_000;

export function withTimeout<T>(work: Promise<T>, ms = TURN_TIMEOUT_MS, onTimeout?: () => void): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout>;
  const ceiling = new Promise<null>(resolve => {
    timer = setTimeout(() => {
      // The caller cannot otherwise tell "the ceiling fired" from "the call
      // failed" — both resolve to null — and those two deserve different
      // sentences and different diagnostics.
      onTimeout?.();
      resolve(null);
    }, ms);
  });
  return Promise.race([work, ceiling]).finally(() => clearTimeout(timer));
}


/**
 * Rebuild a renderable answer from an archived `payload`.
 *
 * The archive stores an allow-listed subset of the live response, so a restored
 * turn can render through the exact same path as a live one — cards, chips,
 * emergency block — instead of the flat audit transcript. Defensive on every
 * field for the same reason as `readSuggestions`: the payload crosses a version
 * boundary (it was written by whatever khesht was deployed months ago).
 */
export function archivedTurnResponse(payload: unknown): TurnResponse | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
  const p = payload as Partial<TurnResponse>;
  const hasContent = Boolean(
    p.message || p.clarifying_question || p.emergency || p.guide || p.provider || (Array.isArray(p.results) && p.results.length)
  );
  if (!hasContent) return null;
  return {
    mode: 'chat',
    conversation_id: '',
    query_id: '',
    turn_index: 0,
    ...p,
    // یک گفتگوی بازیابی‌شده هرگز نباید دوباره جریانِ لغو را مسلح کند — همان
    // قاعده‌ای که سمتِ سرور هم client_action را از payload بیرون گذاشته است.
    client_action: undefined,
  } as TurnResponse;
}

/** One dated section of the conversation rail. */
export interface ConversationGroup {
  label: string;
  items: ConversationSummary[];
}

const DAY_MS = 86_400_000;

/**
 * Bucket the conversation rail by recency — «امروز / دیروز / ۷ روز گذشته / …».
 *
 * Pure, and `now` is a parameter, because "which bucket" is the kind of thing
 * that is right in Tehran at noon and wrong at 00:30 UTC; a test has to be able
 * to pin the clock. Buckets are computed from *local midnight*, not from a
 * rolling 24 hours, so a conversation at 23:50 is «دیروز» the next morning
 * rather than «امروز» — which is what the label claims.
 *
 * An unparsable or absent `last_message_at` sorts last instead of throwing: a
 * malformed row must cost its own position in the list, never the whole rail.
 */
export function groupConversations(rows: ConversationSummary[], now = Date.now()): ConversationGroup[] {
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const today = midnight.getTime();

  const label = (row: ConversationSummary): string => {
    const at = new Date(String(row?.last_message_at ?? '')).getTime();
    if (!Number.isFinite(at)) return 'قدیمی‌تر';
    if (at >= today) return 'امروز';
    if (at >= today - DAY_MS) return 'دیروز';
    if (at >= today - 7 * DAY_MS) return '۷ روز گذشته';
    return 'قدیمی‌تر';
  };

  const order = ['امروز', 'دیروز', '۷ روز گذشته', 'قدیمی‌تر'];
  const groups: ConversationGroup[] = [];
  for (const row of rows ?? []) {
    const key = label(row);
    let group = groups.find(g => g.label === key);
    if (!group) {
      group = { label: key, items: [] };
      groups.push(group);
    }
    group.items.push(row);
  }
  return groups.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
}

/**
 * Legacy conversations (archived before `payload` existed) only have the audit
 * transcript. Rendering it verbatim shows `[گامِ بعد: …]` markers and raw
 * `(/dr/…)` paths — noise addressed to the owner's audit, not to a patient. This
 * strips exactly those two artifact shapes and nothing else.
 */
export function stripTranscriptArtifacts(text: string): string {
  return String(text ?? '')
    .split('\n')
    // ⚠️ no \b here: JS word boundaries are ASCII-only and never match after «بعد».
    .filter(line => !/^\s*\[(?:گامِ? بعد|راهنما|اقدام در گفتگو)/.test(line))
    .map(line => line.replace(/\s*\((\/[^\s)]*)\)\s*$/u, ''))
    .join('\n')
    .trim();
}
