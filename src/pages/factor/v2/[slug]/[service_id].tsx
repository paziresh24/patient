import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import Badge from '@/common/components/atom/badge/badge';
import Divider from '@/common/components/atom/divider/divider';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import FactorWrapper from '@/modules/booking/views/factor/wrapper';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { digitsFaToEn } from '@persian-tools/persian-tools';
import moment from 'jalali-moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo } from 'react';
import { growthbook } from 'src/pages/_app';
const { publicRuntimeConfig } = getConfig();

const Factor = () => {
  const {
    query: { slug, service_id },
  } = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const getBookDetails = useGetBookDetails();
  const messengers = useFeatureValue<any>('onlinevisitchanneltype', {});
  const { isLoading, data: profile } = useGetProfileData({ slug: slug as string });

  useEffect(() => {
    if (getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0]) {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        center_id: '5532',
        slug: slug,
        service_id: service_id,
        user_center_id: getBookDetails.data?.data?.result?.[0]?.user_center_id,
      });
    }
  }, [getBookDetails.isSuccess, getBookDetails.data?.data?.result?.[0]]);

  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);
  const doctorName = `${profile?.data?.name} ${profile?.data?.family}`;

  const isOnlineVisitTurn = true;
  const convertTime = (time: number) => {
    return moment(time)?.locale('fa')?.calendar(undefined, {
      nextWeek: 'YYYY/MM/DD(dddd) حدود ساعت HH:mm',
      sameElse: 'YYYY/MM/DD حدود ساعت HH:mm',
      sameDay: 'امروز حدود ساعت HH:mm',
      nextDay: 'فردا حدود ساعت HH:mm',
    });
  };

  return (
    <>
      <Seo title="فاکتور نوبت" noIndex />

      <div className="flex flex-col-reverse items-start p-3 w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10 mb-[5rem]">
        <div className="w-full md:basis-4/6">
          <FactorWrapper
            centerId={'5532'}
            serviceId={service_id as string}
            userCenterId={profile?.data?.centers?.find((item: any) => item.id == CENTERS.CONSULT)?.user_center_id}
          />
        </div>
        <div
          className={classNames(
            'w-full p-3 mb-[0.6rem] space-y-1 bg-white border border-solid border-[#d0d2d6] shadow-card rounded-lg  md:mb-0 md:w-2/5 relative',
            {
              'border-primary/50  shadow-xl shadow-primary/10': isOnlineVisitTurn,
            },
          )}
        >
          <DoctorInfo
            className={classNames('rounded-lg', {
              '!p-0': isOnlineVisitTurn,
            })}
            avatar={publicRuntimeConfig.CDN_BASE_URL + profile?.data?.image}
            fullName={doctorName}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: profile?.data?.expertises?.[0]?.alias_title,
              degree: profile?.data?.expertises?.[0]?.degree?.name,
              expertise: profile?.data?.expertises?.[0]?.expertise?.name,
            })}
            isLoading={isLoading}
          />
          {isLoading && <Skeleton w="100%" h="8rem" className="!mt-2" rounded="md" />}
          {isOnlineVisitTurn && (
            <Badge
              text="ویزیت آنلاین"
              fontWeight="medium"
              fontSize="xs"
              className="bg-slate-200/50 !rounded-md text-secondary p-2 whitespace-nowrap absolute top-2 left-2"
            />
          )}
          {isOnlineVisitTurn && <Divider />}
          {!isLoading && isOnlineVisitTurn && (
            <div className="flex flex-col p-2 space-y-1">
              <Text fontSize="sm" as="p">
                سلام. من {doctorName} هستم.
              </Text>
              <Text as="p" fontSize="sm" align="justify" className="leading-6">
                پس از نهایی شدن نوبت،{' '}
                <Text className="text-primary" fontWeight="semiBold">
                  {convertTime(profile?.data?.centers?.find((item: any) => item.id == CENTERS.CONSULT)?.freeturn * 1000)}
                </Text>{' '}
                شما را ویزیت خواهم کرد.
              </Text>
            </div>
          )}
        </div>
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
