/**
 * Who is allowed to see the conversational layer — DR-11 rollout gates.
 *
 * Every rule here came from the owner on 2026-07-29, and each one is a *veto*:
 * all of them must pass. They are collected in one file on purpose, because a
 * rollout gate spread across three components is a rollout gate that will be
 * half-applied by the next person who adds a fourth entry point.
 *
 * ⛔ **The university rule is the important one.**
 *   owner: «این سرچ توی سایت‌های دانشگاه‌های علوم پزشکی که طرف قرارداد پذیرش۲۴
 *   هستند، نباید روت بشه؛ به هیچ وجه. مثلاً nobat.tums.ac.ir یا nobat.sums.ac.ir»
 *
 * It is implemented as a **positive allow-list of our own hosts**, not as a
 * blocklist of university hosts, and not as `if (partnerKey) return false`.
 * Reason — and this is a real trap, not a style preference:
 *
 *   `partnerKey` comes from GrowthBook (`theme-config:${host}`, fetched in
 *   `withServerUtils` with a **500 ms timeout** and defaulting to `{}`). So when
 *   GrowthBook is slow or down, a university page renders with an EMPTY
 *   partnerKey — i.e. a blocklist keyed on `partnerKey` **fails open on exactly
 *   the host where the owner said "به هیچ وجه"**. An allow-list fails closed: an
 *   unknown host gets nothing.
 *
 * `partnerKey` is still checked, as the second layer: it catches a partner served
 * from a paziresh24-shaped host.
 */

/**
 * Hosts where the conversational layer may appear. Anything else — every
 * `*.ac.ir`, every partner domain, every white-label — is refused by default.
 */
const ALLOWED_HOSTS = new Set(['paziresh24.com', 'www.paziresh24.com']);

/** Non-production hosts, allowed only when the build is not production. */
const DEV_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

export function isChatAllowedHost(rawHost: string | undefined | null, isProduction = process.env.NODE_ENV === 'production'): boolean {
  const host = String(rawHost ?? '')
    .trim()
    .toLowerCase()
    .split(':')[0]; // strip :3000
  if (!host) return false;
  if (ALLOWED_HOSTS.has(host)) return true;
  if (!isProduction && (DEV_HOSTS.has(host) || host.endsWith('.localhost'))) return true;
  // Staging/preview deployments of our own app, still never a partner domain.
  if (!isProduction && host.endsWith('.p24cloud.ir')) return true;
  return false;
}

export interface ChatEligibilityInputs {
  /** `window.location.host` on the client, or the forwarded host on the server. */
  host: string | undefined | null;
  /** GrowthBook `theme-config` partner key — non-empty on every white-label site. */
  partnerKey: string | undefined | null;
  /**
   * Owner 2026-07-29: «برای رول‌اوت مینیمم اولیه … فقط برای گروهی که لاگین هستند».
   * Logged-in only is also what makes the spend bounded and the funnel joinable.
   */
  isLogin: boolean;
  /** The auth store starts `pending: true`; showing chat before it resolves would leak to guests. */
  isAuthPending: boolean;
  /**
   * `publicRuntimeConfig.CHAT_MVP_ENABLED` **and** the GrowthBook rollout flag,
   * composed by `useChatGate`. Deliberately NOT a `NEXT_PUBLIC_*` value read from
   * client code — that inlines at build time and could never be true in the
   * production image (see useChatGate.ts).
   */
  featureEnabled: boolean;
  isProduction?: boolean;
}

export type ChatIneligibleReason =
  | 'feature_off'
  | 'host_not_allowed'
  | 'partner_site'
  | 'auth_pending'
  | 'not_logged_in';

/**
 * Returns null when chat may be shown, or the **first** failing gate. The reason
 * is returned rather than a bare boolean so the decision is debuggable in one
 * console line instead of by bisecting five conditions.
 */
export function chatIneligibleReason(input: ChatEligibilityInputs): ChatIneligibleReason | null {
  if (!input.featureEnabled) return 'feature_off';
  if (!isChatAllowedHost(input.host, input.isProduction)) return 'host_not_allowed';
  if (String(input.partnerKey ?? '').trim()) return 'partner_site';
  if (input.isAuthPending) return 'auth_pending';
  if (!input.isLogin) return 'not_logged_in';
  return null;
}

export function isChatEligible(input: ChatEligibilityInputs): boolean {
  return chatIneligibleReason(input) === null;
}

/**
 * Sentence shapes, in four families. Kept in sync with khesht's
 * `CHAT_TRIGGER_CONVERSATIONAL_PATTERN` default — that one is authoritative and
 * tunable without a deploy; this one only avoids a pointless round-trip.
 *
 * Family 3 (**request/intent without a question mark**) exists because of a test
 * failure, not a hunch: «دنبال پزشکی هستم که بیمه نیروهای مسلح را قبول کند و در
 * غرب تهران باشد» — the owner's own example of the complex multi-attribute query
 * this feature is for — carries no `؟` and no first-person verb from family 1,
 * and the first version of this filter silently dropped it. Owner 2026-07-29:
 * «ممکنه حتی به شکل سوالی هم پرسیده نشه، ولی چت‌خورش خوب باشه».
 *
 * Family 4 (**non-provider intents**: cancel / reschedule / reviews) is included
 * deliberately even though phase 1 cannot *act* on them — see DR-11 §۱۲.۴. It is
 * better to route those to a layer that can say "here is where you do that" than
 * to keep matching them as keywords against a doctor index.
 */
const CONVERSATIONAL_SHAPE = new RegExp(
  [
    // 1. interrogative punctuation / first-person narrative
    '[?؟]',
    '(^|\\s)(دارم|دارد|شدم|شده‌ام|شده ام|می‌کنم|میکنم|بروم|برم|مراجعه کنم|چیکار|چه کار|باید|هستم|لازم دارم)(\\s|$)',
    // 2. explicit interrogatives
    'چه دکتر|چه پزشک|کدام دکتر|کدام پزشک|به چه|چرا |آیا |کجا |چطور |چگونه |علت ',
    // 3. request / multi-attribute need, stated as a sentence, no «؟»
    'دنبال |می‌خواهم|می‌خوام|میخوام|میخواهم|معرفی کن|پیدا کنم|سراغ |کسی که |پزشکی که|دکتری که|قبول می‌?کن',
    // 4. non-provider intents (cancel / reschedule / reviews) — **two conditions,
    //    not one word**. The first version of this line matched «کنسل» inside
    //    «کنسلیِ» a service name and accounted for 37 of 40 firings in a live 24h
    //    replay (ghane exports/dr11-trigger-precision-20260729.md). Kept in sync
    //    with khesht's authoritative pattern.
    '(?=.*(نوبت|وقت))(?=.*(لغو|کنسل|جابه‌?جا|تغییر))|نظر (ثبت|بذارم|بدهم|بنویسم)|ثبت نظر|نظرات بیماران|نظرات مراجع|رضایت بیماران',
  ].join('|')
);

/**
 * Client-side pre-filter: "does this look like a sentence rather than a catalog
 * lookup?"
 *
 * It is **not** the trigger. The orchestrator in khesht owns the trigger decision
 * (DR-11 §۰.۵ rule: no decision logic in the front end) and will answer
 * `mode: "classic"` for anything it does not want. This exists only to avoid
 * paying for an HTTP round-trip on «دکتر قلب تهران» — measured live traffic says
 * that is 96%+ of long queries (§۱۱.۱). Being *loose* here is safe (the server
 * vetoes); being tight would hide real questions from the server, so when in
 * doubt this says yes.
 */
export function looksConversational(text: string): boolean {
  const t = String(text ?? '').trim();
  if (t.length < 25) return false;
  if (t.split(/\s+/).length < 5) return false;
  return CONVERSATIONAL_SHAPE.test(t);
}

/**
 * Server-side gate for the standalone `/chat` route.
 *
 * Lives in this dependency-free module on purpose: `getServerSideProps` must not
 * pull in the auth store / axios client just to read two env vars. Reading
 * `process.env` here genuinely works, because this runs on the server — unlike
 * client code, where `NEXT_PUBLIC_*` is inlined at build time and the image is
 * built without build args (see useChatGate.ts).
 */
export function chatRouteAllowed(
  env: Partial<Record<string, string | undefined>>,
  previewParam: unknown
): boolean {
  const enabled = (env.CHAT_MVP_ENABLED ?? env.NEXT_PUBLIC_CHAT_MVP_ENABLED) === 'true';
  const key = env.CHAT_MVP_PREVIEW_KEY ?? env.NEXT_PUBLIC_CHAT_MVP_PREVIEW_KEY;
  return enabled || (Boolean(key) && previewParam === key);
}
