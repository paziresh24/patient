import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { buildRaviDocsideHandoffSrc } from '@/modules/patient/utils/buildRaviDocsideHandoff';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useRef, useState } from 'react';

export const BazaarPage = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframe = useRef<any>(null);

  return (
    <>
      <Seo title="نظرات پروفایل من" noIndex />
      <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
        {isAppLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
            <LoadingApps />
          </div>
        )}
        <iframe
          ref={iframe}
          onLoad={() => setIsAppLoading(false)}
          className={classNames('w-full h-full', { hidden: isAppLoading })}
          src={buildRaviDocsideHandoffSrc()}
          referrerPolicy="no-referrer"
        />
      </div>
    </>
  );
};

BazaarPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      <SideBar className="hidden md:flex">{page}</SideBar>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default BazaarPage;
