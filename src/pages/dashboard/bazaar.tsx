import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import classNames from '@/common/utils/classNames';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useState } from 'react';

export const BazaarPage = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);

  return (
    <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
      {isAppLoading && <LoadingApps />}
      <iframe
        onLoad={() => setIsAppLoading(false)}
        className={classNames('w-full h-full', { hidden: isAppLoading })}
        src="https://bazaar.paziresh24.com/"
      />
    </div>
  );
};

BazaarPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} showFooter={false}>
      <SideBar className="hidden md:flex">{page}</SideBar>
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default BazaarPage;
