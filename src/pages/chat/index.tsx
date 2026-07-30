/**
 * DR-11 MVP route — deliberately NOT on `/s`.
 *
 * A new path cannot shadow an existing search route, cannot change an existing
 * bundle, and cannot regress SEO, which is how "zero blast radius on classic
 * search" is made true by construction rather than promised in a review.
 *
 * Access is gated twice, because an unfinished medical-adjacent experience must
 * not be publicly reachable by accident:
 *   - `CHAT_MVP_ENABLED=true` (the kill-switch), or
 *   - `?preview=<CHAT_MVP_PREVIEW_KEY>` for a limited audience.
 * Otherwise the route 404s exactly like a page that does not exist.
 */
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import ConversationalSearch from '@/modules/chat/conversationalSearch';
import { chatRouteAllowed } from '@/modules/chat/chatEligibility';

const ChatPage: NextPage = () => (
  <>
    <Head>
      <title>راهنمای انتخاب پزشک | پذیرش۲۴</title>
      {/* Experimental surface: never indexed. */}
      <meta name="robots" content="noindex,nofollow" />
    </Head>
    <ConversationalSearch />
  </>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // Server-side, so reading process.env genuinely works here — unlike in client
  // code, where NEXT_PUBLIC_* is inlined at build time (useChatGate.ts explains
  // why that mattered). Both names are accepted so the env rename is not a cliff.
  if (!chatRouteAllowed(process.env, query.preview)) return { notFound: true };
  return { props: {} };
};

export default ChatPage;
