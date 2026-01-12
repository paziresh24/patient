import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import { Wrapper } from '@/modules/dashboard/components/wrapper';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useState } from 'react';
import PatinetProfile from '../patient/profile';
import Loading from '@/common/components/atom/loading';

export const AppointmentsPage = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const user = useUserInfoStore(state => state.info);
  return (
    <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
      {user.provider?.job_title === 'doctor' ? (
        <>
          <Seo title="ویرایش پروفایل" noIndex />
          {isAppLoading && (
            <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
              <Loading />
            </div>
          )}
          <iframe
            onLoad={() => setIsAppLoading(false)}
            className={classNames('w-full h-full', { hidden: isAppLoading })}
            src={`https://opium-dashboard.paziresh24.com/profile-page/?user_id=${user.id}`}
          />
        </>
      ) : (
        <>
          <Seo title="ویرایش پروفایل" noIndex />
          {isAppLoading && (
            <div className="w-full bg-white justify-center flex items-center h-full flex-grow">
              <Loading />
            </div>
          )}
          <iframe
            onLoad={() => setIsAppLoading(false)}
            className={classNames('w-full h-full', { hidden: isAppLoading })}
            src="https://profile.paziresh24.com"
          />
        </>
      )}
    </div>
  );
};

AppointmentsPage.getLayout = function getLayout(page: ReactElement) {
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

export default AppointmentsPage;
