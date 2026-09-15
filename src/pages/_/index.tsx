import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import LauncherHomePage from '@/modules/doctorHome/components/launcherHomePage';
import { ds } from '@/modules/doctorHome/designSystem/tokens';
import { ReactElement } from 'react';

/**
 * Doctor-only static home (`getStaticProps`). SSG HTML includes switcher + feed shell
 * via LauncherHomePage (forceShow chrome). No interim empty-card boot.
 */
const Page = () => <LauncherHomePage />;

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} className={ds.surface.page} shouldShowPromoteApp={false} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

/** Static shell for CDN/fast TTFB. Keep a data-fetching export so next-translate preserves getLayout. */
export const getStaticProps = async () => {
  return { props: {} };
};

export default Page;
