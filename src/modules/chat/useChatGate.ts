/**
 * The one hook that answers "may the conversational layer run, here, now?" —
 * DR-11 §۱۲.۷ + §۱۲.۸.
 *
 * ### Why this file exists at all (a trap that would have wasted a release)
 *
 * The first version read `process.env.NEXT_PUBLIC_CHAT_MVP_ENABLED` in client
 * code. In this repo that can never be true in production: the Dockerfile runs
 * `npm run build` inside the image with **no build args**, so every
 * `NEXT_PUBLIC_*` referenced from the browser bundle is inlined as `undefined`.
 * The feature would have deployed permanently dark, and — worse — the promised
 * "flag off ⇒ back to normal in seconds" rollback would not have existed.
 *
 * So the switch is now two layers, matching how this app really works:
 *
 * 1. **`publicRuntimeConfig.CHAT_MVP_ENABLED`** — the master switch. Read from
 *    the process env at *server start*, so changing it is a pod restart. This is
 *    the "is this feature deployable here at all" gate.
 * 2. **GrowthBook `conversational_search`** — the *rollout* control. Instant
 *    on/off, percentage, and sticky bucketing on `terminal_id` (the same
 *    attribute `searchia_backend` uses, already set in `_app.tsx`). This is the
 *    seconds-level kill-switch and the way to go 0% → 5% → more.
 *
 * Both must be on. Plus the preview escape hatch:
 *
 * 3. **`?chatPreview=<CHAT_MVP_PREVIEW_KEY>`** — lets a named person see it on
 *    production while GrowthBook is still at 0%. It bypasses the rollout
 *    percentage **only**; the host allow-list and the logged-in requirement still
 *    apply, because those are safety and cost rules, not rollout knobs.
 */
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import useCustomize from '@/common/hooks/useCustomize';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { chatIneligibleReason, devFakeLogin, type ChatIneligibleReason } from './chatEligibility';
export { chatRouteAllowed } from './chatEligibility';

/** Lazy + defensive: `getConfig()` returns undefined outside a Next runtime (tests). */
const runtimeConfig = (): Record<string, unknown> =>
  (getConfig()?.publicRuntimeConfig ?? {}) as Record<string, unknown>;

/** GrowthBook feature key. Same naming family as `searchia_backend`. */
export const CHAT_ROLLOUT_FLAG = 'conversational_search';

export interface ChatGate {
  allowed: boolean;
  /** null when allowed; otherwise the first gate that said no. */
  reason: ChatIneligibleReason | null;
  /** True when this session is only in because of the preview key. */
  isPreview: boolean;
}

export function useChatGate(): ChatGate {
  const router = useRouter();
  const partnerKey = useCustomize(state => state.customize?.partnerKey);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const isAuthPending = useUserInfoStore(state => state.pending);
  const rolloutOn = useFeatureIsOn(CHAT_ROLLOUT_FLAG);

  const cfg = runtimeConfig();
  const previewKey = String(cfg.CHAT_MVP_PREVIEW_KEY ?? '');
  const isPreview = Boolean(previewKey) && router.query.chatPreview === previewKey;
  const masterOn = String(cfg.CHAT_MVP_ENABLED ?? '') === 'true';
  const fakeLogin = devFakeLogin(cfg);

  return useMemo(() => {
    const reason = chatIneligibleReason({
      // `window` is absent during SSR. "No host yet" must mean "not eligible
      // yet", never "eligible" — the panel is a client-only enhancement.
      host: typeof window === 'undefined' ? '' : window.location.host,
      partnerKey,
      isLogin: isLogin || fakeLogin,
      isAuthPending: isAuthPending && !fakeLogin,
      featureEnabled: masterOn && (rolloutOn || isPreview),
    });
    return { allowed: reason === null, reason, isPreview };
  }, [partnerKey, isLogin, isAuthPending, masterOn, rolloutOn, isPreview, fakeLogin]);
}
