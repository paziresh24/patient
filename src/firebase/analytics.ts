import { isPWA } from '@/common/utils/isPwa';
import config from 'next/config';
const { publicRuntimeConfig } = config();

/**
 * PERF (DR-08, docs/dev-requests/dr-08-listing-pagespeed.md §۱۱): `firebase/analytics` and
 * `./config` (which calls `initializeApp()`) used to be *static* imports here. Static imports are
 * bundled and evaluated unconditionally regardless of any runtime `if`/ternary around their
 * *usage* — so even though the code only ever needs analytics inside an installed PWA, the whole
 * Firebase SDK was shipped in the site-wide shared webpack chunk and executed on every single page
 * load. A live Lighthouse run against the /s/* listing templates measured that shared chunk costing
 * ~15-17s of simulated-mobile main-thread time — the dominant driver behind the site's LCP/TBT/INP
 * failures (and almost certainly the mechanism behind Clarity's high "dead click" rate: buttons are
 * visible from SSR long before the main thread frees up to attach their handlers).
 *
 * Fix: gate the *import* itself (not just the call) on the exact same condition the code already
 * checked (`IS_FIREBASE_ENABLE && isPWA()`), using a dynamic `import()`. Non-PWA visits — the
 * overwhelming majority of traffic, including every /s/* listing page — now never fetch, parse, or
 * execute any Firebase code at all. Behavior for the PWA case is unchanged (same isSupported()
 * check, same fallback to null).
 *
 * Generality/validity boundary (debugging-principles §۷): this fixes the *class* of "static import
 * defeats a runtime feature-gate" for this one module. It does not by itself shrink firebase/fcm.ts
 * (currently unused/dead — separate cleanup) or any other conditionally-gated-but-statically-
 * imported dependency; the same audit should be repeated for other heavy libs before assuming the
 * shared bundle is now lean.
 */
const analytics: Promise<import('firebase/analytics').Analytics | null> =
  publicRuntimeConfig.IS_FIREBASE_ENABLE && typeof window !== 'undefined' && isPWA()
    ? import('firebase/analytics').then(async ({ getAnalytics, isSupported }) => {
        const supported = await isSupported();
        if (!supported) return null;
        const { default: app } = await import('./config');
        return getAnalytics(app);
      })
    : Promise.resolve(null);

export default analytics;
