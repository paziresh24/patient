/**
 * DR-11 MVP route — deliberately NOT on `/s`.
 *
 * A new path cannot shadow an existing search route, cannot change an existing
 * bundle, and cannot regress SEO, which is how "zero blast radius on classic
 * search" is made true by construction rather than promised in a review.
 *
 * Access is gated twice, because an unfinished medical-adjacent experience must
 * not be publicly reachable by accident:
 *   - `NEXT_PUBLIC_CHAT_MVP_ENABLED=true` (the kill-switch), or
 *   - `?preview=<NEXT_PUBLIC_CHAT_MVP_PREVIEW_KEY>` for a limited audience.
 * Otherwise the route 404s exactly like a page that does not exist.
 */
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import ConversationalSearch from '@/modules/chat/conversationalSearch';

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
  const enabled = process.env.NEXT_PUBLIC_CHAT_MVP_ENABLED === 'true';
  const previewKey = process.env.NEXT_PUBLIC_CHAT_MVP_PREVIEW_KEY;
  const hasPreview = Boolean(previewKey) && query.preview === previewKey;
  if (!enabled && !hasPreview) return { notFound: true };
  return { props: {} };
};

export default ChatPage;
