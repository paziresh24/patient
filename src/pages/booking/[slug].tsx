import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import Loading from '@/common/components/atom/loading/loading';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import Transition from '@/common/components/atom/transition/transition';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { CENTERS } from '@/common/types/centers';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import BookingSteps from '@/modules/booking/views';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import moment from 'jalali-moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useCallback, useEffect, useMemo } from 'react';
const { publicRuntimeConfig } = getConfig();

const Booking = () => {
  const router = useRouter();
  const setProfileData = useProfileDataStore(state => state.setData);

  const {
    data,
    isLoading: fullProfileLoading,
    isSuccess,
    status,
  } = useGetProfileData(
    {
      slug: router.query?.slug?.toString() ?? '/',
    },
    {
      enabled: !!router.isReady,
    },
  );

  const profileData = data?.data;

  const doctorName = `${profileData?.name} ${profileData?.family}`;

  useEffect(() => {
    if (data?.redirect) {
      router.replace(data.redirect?.route?.replace('/dr', '/booking') + location.search);
    }
  }, [data?.redirect]);

  useEffect(() => {
    if (profileData && !profileData?.centers?.some((item: any) => item.id === router.query?.centerId)) {
      router.replace(`/booking/${router.query?.slug?.toString()}`);
    }
  }, [profileData]);

  const isLoading = fullProfileLoading;

  const queryHandler = useCallback((queries: any) => {
    const payloads = Object.keys(queries);
    if (
      payloads.includes('centerId') &&
      payloads.includes('serviceId') &&
      (payloads.includes('timeId') ||
        payloads.includes('time') ||
        payloads.includes('reserveId') ||
        payloads.includes('skipTimeSelectStep'))
    ) {
      return {
        step: 'SELECT_USER',
        payload: queries as any,
      };
    }
    if (payloads.includes('centerId') && payloads.includes('serviceId') && payloads.includes('bookRequest'))
      return {
        step: 'SELECT_USER',
        payload: queries as any,
      };
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

  useEffect(() => {
    if (isSuccess) {
      setProfileData(profileData);
    }
  }, [status]);

  useEffect(() => {
    // Prefetch the factor page
    router.prefetch('/factor/[centerId]/[bookId]');
    // Prefetch the receipt page
    router.prefetch('/receipt/[centerId]/[bookId]');
  }, []);

  const centerName = useMemo(() => {
    const center = profileData?.centers?.find((center: any) => center.id === router.query.centerId);
    return center?.center_type === 1 ? `مطب ${doctorName}` : center?.name;
  }, [router.query.centerId, profileData]);

  return (
    <>
      <Seo title={`دریافت نوبت ${doctorName ? `از ${doctorName}` : ''}`} noIndex />
      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="flex flex-col w-full bg-white md:basis-4/6 md:rounded-lg shadow-card mb-28">
          {isLoading && (
            <div className="self-center p-10">
              <Loading className="self-center" />
            </div>
          )}
          <Transition match={!!queryHandler(router.query) && !isLoading} animation="bottom">
            {<BookingSteps defaultStep={queryHandler(router.query) as any} slug={router.query?.slug?.toString() ?? '/'} />}
          </Transition>
        </div>
        <div className="w-full p-3 mb-2 space-y-3 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
          <DoctorInfo
            className="p-4 rounded-lg bg-slate-100"
            isLoading={isLoading || !profileData}
            avatar={publicRuntimeConfig.CDN_BASE_URL + profileData?.image}
            fullName={doctorName}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: profileData?.expertises?.[0]?.alias_title,
              degree: profileData?.expertises?.[0]?.degree?.name,
              expertise: profileData?.expertises?.[0]?.expertise?.name,
            })}
          />

          {router.query.centerId && (
            <div className="flex flex-col px-2 py-1 space-y-1 border-r-2 border-slate-200">
              <Text fontSize="xs" className="opacity-70">
                {router.query.centerId === CENTERS.CONSULT ? 'خدمت' : 'مرکز'}
              </Text>
              {isLoading && <Skeleton w="9rem" h="0.8rem" className="!mt-2 !mb-1" rounded="full" />}
              {isSuccess && (
                <Text fontSize="sm" fontWeight="medium">
                  {router.query.centerId === CENTERS.CONSULT
                    ? `ویزیت آنلاین ${profileData?.online_visit_channel_types?.length > 0 ? 'در پیام رسان' : ''}`
                    : centerName}
                </Text>
              )}
            </div>
          )}

          {router.query?.time && (
            <div className="flex flex-col px-2 py-1 space-y-1 border-r-2 border-slate-200">
              <Text fontSize="xs" className="opacity-70">
                زمان نوبت
              </Text>
              {isLoading && <Skeleton w="9rem" h="0.8rem" className="!mt-2 !mb-1" rounded="full" />}
              {isSuccess && (
                <Text fontSize="sm" fontWeight="medium">
                  {moment(router.query.time)?.locale('fa')?.calendar?.(undefined, {
                    sameDay: 'امروز (dddd) - ساعت: HH:mm',
                    nextDay: 'فردا (dddd) - ساعت: HH:mm',
                    sameElse: 'dddd jD jMMMM - ساعت: HH:mm',
                  })}
                </Text>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Booking.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} showBottomNavigation={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    const { id, center_id } = context.query;
    if (id && center_id) {
      return {
        redirect: {
          statusCode: 302,
          destination: `/receipt/${center_id}/${id}`,
        },
      };
    }

    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Booking;
