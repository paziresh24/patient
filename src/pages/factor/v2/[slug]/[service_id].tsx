import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { CENTERS } from '@/common/types/centers';
import DoctorInvoiceNotice from '@/modules/booking/components/factor/doctorInvoiceNotice';
import FactorWrapper from '@/modules/booking/views/factor/wrapper';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo } from 'react';

const Factor = () => {
  const {
    query: { slug, service_id },
  } = useRouter();
  const { data: profile } = useGetProfileData({ slug: slug as string });
  const isLogin = useUserInfoStore(state => state.isLogin);
  const isPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();

  useEffect(() => {
    if (!isPending && !isLogin) {
      handleOpenLoginModal({ state: true, closable: false });
    }
  }, [isLogin, isPending]);

  return (
    <>
      <Seo title="فاکتور نوبت" noIndex />

      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10 mb-[5rem]">
        <div className="w-full md:basis-4/6 z-10">
          <FactorWrapper
            centerId={'5532'}
            serviceId={service_id as string}
            userCenterId={profile?.data?.centers?.find((item: any) => item.id == CENTERS.CONSULT)?.user_center_id}
          />
        </div>
        <DoctorInvoiceNotice slug={slug as string} serviceId={service_id as string} />
      </div>
    </>
  );
};

Factor.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} showBottomNavigation={false} {...page.props.config} showFooter={false}>
      {page}
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

export default Factor;
