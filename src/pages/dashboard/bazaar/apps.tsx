import Loading from '@/common/components/atom/loading';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useRef, useState } from 'react';

export const BazaarPage = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const iframe = useRef<any>(null);
  const user = useUserInfoStore(state => state.info);

  useEffect(() => {
    if (iframe.current) {
      window.addEventListener('message', function (event) {
        if (event.data.key === 'GET_USER_INFORMATION') {
          iframe.current?.contentWindow?.postMessage(
            {
              key: 'USER_INFORMATION',
              id: user.id,
              name: user.name,
              family: user.family,
              cell: user.cell,
              national_code: user.national_code,
            },
            '*',
          );
        }
      });
    }
  }, [user]);

  return (
    <>
      <Seo title="بازارچه اَبزارک ها" noIndex />
      <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
        {isAppLoading && (
          <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
            <Loading />
          </div>
        )}
        <iframe
          ref={iframe}
          onLoad={() => setIsAppLoading(false)}
          className={classNames('w-full h-full', { hidden: isAppLoading })}
          src="https://bazaar.paziresh24.com/apps"
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
