import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import classNames from '@/common/utils/classNames';
import { LoadingApps } from '@/modules/dashboard/components/loading';
import { Wrapper } from '@/modules/dashboard/components/wrapper';
import { SideBar } from '@/modules/dashboard/layouts/sidebar';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useState } from 'react';
import PatinetProfile from '../patient/profile';

export const AppointmentsPage = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const user = useUserInfoStore(state => state.info);
  return (
    <div className="flex md:h-[calc(100vh-80px)] items-center justify-center overflow-y-auto flex-grow w-full relative">
      {user.provider?.job_title === 'doctor' ? (
        <>
          <Seo title="ویرایش پروفایل" noIndex />
          {isAppLoading && <LoadingApps />}
          <iframe
            onLoad={() => setIsAppLoading(false)}
            className={classNames('w-full h-full', { hidden: isAppLoading })}
            src="https://dr.paziresh24.com/profile"
          />
        </>
      ) : (
        <Wrapper>
          <PatinetProfile />
        </Wrapper>
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
