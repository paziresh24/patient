/**
 * The rules of one Yara turn, as pure functions.
 *
 * They live outside the component because every one of them is a *promise to the
 * patient* — «متن‌تان گم نمی‌شود»، «هیچ‌وقت اسپینرِ بی‌پایان نمی‌بینید» — and a
 * promise that only exists inside a `useCallback` is a promise nobody can test.
 *
 * DR-11 (pivot «یارا»), 2026-08-01.
 */
import type { TurnResponse } from '../chatApi';

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
  assistant?: TurnResponse;
  /** Restored from the archive: text only, no live payload to re-render. */
  archivedAnswer?: string;
  /** The turn ended without a usable answer ⇒ render the escape hatch. */
  failed?: boolean;
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

export function withTimeout<T>(work: Promise<T>, ms = TURN_TIMEOUT_MS): Promise<T | null> {
  let timer: ReturnType<typeof setTimeout>;
  const ceiling = new Promise<null>(resolve => {
    timer = setTimeout(() => resolve(null), ms);
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
