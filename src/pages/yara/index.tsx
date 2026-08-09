/**
 * `/yara` — the standalone full-page assistant (DR-11 pivot, 2026-08-01).
 *
 * Unlike `/chat`, this route has **no** `getServerSideProps` gate that 404s. That
 * is a decision, not an omission: `/chat` was an unannounced experiment, so making
 * it indistinguishable from a non-existent page was the safest thing. `/yara` is a
 * link we intend to give people, and a 404 for "you are not in the rollout bucket"
 * is indistinguishable from "we broke the link". The gate therefore runs on the
 * client (`yaraPage.tsx`) and always renders a sentence.
 *
 * The rollout guards themselves are unchanged and still fail-closed — master
 * switch, GrowthBook percentage, preview key, host allow-list, logged-in — because
 * they live in `useChatGate`/`chatEligibility` and this route does not re-implement
 * any of them.
 *
 * ⚠️ **`getServerSideProps` is load-bearing even though it returns nothing.**
 * Caught on production 2026-08-06: the first deploy of this page served a 200 whose
 * `__NEXT_DATA__.runtimeConfig` had **4 keys instead of 41** and whose gate said
 * `feature_off` for everyone, preview key included. Cause: a page with no
 * data-fetching method is *automatically statically optimized*, and Next.js does not
 * populate `publicRuntimeConfig` for those — so `CHAT_MVP_ENABLED` read as
 * `undefined` at runtime and the master switch was permanently off. `/s` never hit
 * this because it has its own `getServerSideProps`.
 *
 * This is the same class as the `NEXT_PUBLIC_*` build-time trap (DR-11 §۱۲.۹ row 1):
 * the switch existed, but the value could never reach the client. Opting out of
 * static optimization is what makes the runtime config actually runtime. It does
 * **not** reintroduce the `/chat` 404 gate — no props, no redirect, no `notFound`.
 */
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import type { ReactElement } from 'react';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import YaraPage from '@/modules/chat/yara/yaraPage';

/** `_app` reads `getLayout` off the page component, so the type has to allow it. */
type PageWithLayout = NextPage & { getLayout?: (page: ReactElement) => ReactElement };

const Yara: PageWithLayout = () => (
  <>
    <Head>
      <title>یارا | همراه سلامت شما | پذیرش۲۴</title>
      {/* A per-user, gated, non-canonical surface: never indexed. */}
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <YaraPage />
  </>
);

/**
 * Empty on purpose: the only job here is to opt the route out of automatic static
 * optimization so `publicRuntimeConfig` is populated on every request. Anything
 * that gates, redirects, or 404s belongs in `yaraPage.tsx`, not here.
 */
/**
 * The page wears the site's own chrome (owner 2026-08-07: «نوار هدر و نویگیشن
 * بار باید مثل بقیه صفحات سایت باشه و از اونها Reuse بشه»). Yara used to draw a
 * private header, which made it feel like a different product and duplicated a
 * logo, a menu and a back link the site already has — including the bottom
 * navigation's own «گفت‌وگوها» entry.
 *
 * The footer is off because this page is an app shell: a scrolling thread with a
 * pinned composer has no bottom to put a sitemap on.
 */
Yara.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter showFooter={false} shouldShowPromoteApp={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

export default Yara;

