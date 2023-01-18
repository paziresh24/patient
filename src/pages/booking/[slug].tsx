import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import Loading from '@/common/components/atom/loading/loading';
import Transition from '@/common/components/atom/transition/transition';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withCSR } from '@/common/hoc/withCsr';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import BookingSteps from '@/modules/booking/views';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useCallback } from 'react';
import { NextPageWithLayout } from '../_app';
const { publicRuntimeConfig } = getConfig();

const Booking: NextPageWithLayout = () => {
  const router = useRouter();
  const { data, isLoading, isIdle } = useGetProfileData(
    {
      slug: router.query?.slug?.toString() ?? '/',
    },
    {
      enabled: !!router.isReady,
    },
  );

  const aa = useCallback((queries: any) => {
    const payloads = Object.keys(queries);
    if (payloads.includes('centerId') && payloads.includes('serviceId') && payloads.includes('timeId')) {
      return {
        step: 'SELECT_USER',
        payload: queries as any,
      };
    }
    if (payloads.includes('centerId') && payloads.includes('serviceId')) {
      return {
        step: 'SELECT_TIME',
        payload: queries as any,
      };
    }
    if (payloads.includes('centerId')) {
      return {
        step: 'SELECT_SERVICES',
        payload: queries as any,
      };
    }
    return {
      step: 'SELECT_CENTER',
      payload: queries as any,
    };
  }, []);

  return (
    <div className="flex flex-col-reverse items-start max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
      <div className="flex flex-col w-full bg-white md:basis-4/6 md:rounded-lg shadow-card mb-28">
        {(isLoading || isIdle) && (
          <div className="self-center p-10">
            <Loading className="self-center" />
          </div>
        )}
        <Transition match={!!aa(router.query) && !isLoading && !isIdle} animation="bottom">
          <BookingSteps defaultStep={aa(router.query) as any} slug={router.query?.slug?.toString() ?? '/'} />
        </Transition>
      </div>
      <div className="w-full p-3 mb-2 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
        <DoctorInfo
          className="p-4 rounded-lg bg-slate-50"
          isLoading={isLoading || isIdle}
          avatar={publicRuntimeConfig.CLINIC_BASE_URL + data?.data?.data?.image}
          firstName={data?.data?.data?.name}
          lastName={data?.data?.data?.family}
          expertise={getDisplayDoctorExpertise({
            aliasTitle: data?.data?.data?.expertises?.[0]?.alias_title,
            degree: data?.data?.data?.expertises?.[0]?.degree?.name,
            expertise: data?.data?.data?.expertises?.[0]?.expertise?.name,
          })}
        />
      </div>
    </div>
  );
};

Booking.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} showBottomNavigation={false} {...page.props.config} showFooter={false}>
      {page}
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

export default Booking;
