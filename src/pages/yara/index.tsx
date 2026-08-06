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
 */
import type { NextPage } from 'next';
import Head from 'next/head';
import YaraPage from '@/modules/chat/yara/yaraPage';

const Yara: NextPage = () => (
  <>
    <Head>
      <title>یارا | همراه سلامت شما | پذیرش۲۴</title>
      {/* A per-user, gated, non-canonical surface: never indexed. */}
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <YaraPage />
  </>
);

export default Yara;

