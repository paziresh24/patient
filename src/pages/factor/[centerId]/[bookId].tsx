import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
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
    query: { bookId, centerId },
  } = useRouter();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPending = useUserInfoStore(state => state.pending);
  const { handleOpenLoginModal } = useLoginModalContext();
  const getBookDetails = useGetBookDetails();
  const messengers = useFeatureValue<any>('onlinevisitchanneltype', {});

  useEffect(() => {
    if (!isLogin && !userPending) {
      handleOpenLoginModal({ state: true });
    }
    if (bookId && isLogin && !userPending)
      getBookDetails.mutate({
        book_id: bookId.toString(),
        type: 'factor',
      });
  }, [bookId, isLogin, userPending]);

  useEffect(() => {
    if (getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0]) {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        center_id: centerId,
        book_id: bookId,
        service_id: getBookDetails.data?.data?.result?.[0]?.services?.[0]?.service_id,
        user_center_id: getBookDetails.data?.data?.result?.[0]?.user_center_id,
      });
    }
  }, [getBookDetails.isSuccess, getBookDetails.data?.data?.result?.[0]]);

  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);
  const doctorName = (() => {
    const name = bookDetailsData?.doctor_name?.trim() || '';
    const family = bookDetailsData?.doctor_family?.trim() || '';
    
    if (!name && !family) return '';
    if (!name) return family;
    if (!family) return name;
    
    return `${name} ${family}`;
  })();

  const isOnlineVisitTurn = !!bookDetailsData?.book_params?.online_channel;
  const convertTime = (time: string) => {
    return moment.from(digitsFaToEn(time), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.calendar(undefined, {
      nextWeek: 'YYYY/MM/DD(dddd) ساعت HH:mm',
      sameElse: 'YYYY/MM/DD ساعت HH:mm',
    });
  };

  return (
    <>
      <Seo title="فاکتور نوبت" noIndex />

      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10 mb-[5rem]">
        <div className="w-full md:basis-4/6">
          <FactorWrapper
            bookId={bookId as string}
            centerId={centerId as string}
            respiteToRefundAfterDelete={bookDetailsData?.settings?.delay_to_delete_book_refund ?? '5'}
          />
        </div>
        <div className="w-full p-3 mb-2 space-y-1 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
          <DoctorInfo
            className="p-4 rounded-lg bg-slate-100"
            avatar={publicRuntimeConfig.CDN_BASE_URL + bookDetailsData?.doctor_image}
            fullName={doctorName}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
              degree: bookDetailsData?.expertises?.[0]?.degree?.name,
              expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
            })}
            isLoading={getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData}
          />
          {centerId === CENTERS.CONSULT && (getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData) && (
            <Skeleton w="100%" h="5em" className="!mt-2" rounded="md" />
          )}
          {isOnlineVisitTurn && (
            <Badge
              text="ویزیت آنلاین"
              fontWeight="medium"
              fontSize="xs"
              parentClassName="bg-slate-200/50 !rounded-md text-secondary p-2 whitespace-nowrap absolute top-4 left-4"
            />
          )}
          {!!bookDetailsData && centerId === CENTERS.CONSULT && isOnlineVisitTurn && (
            <div className="flex flex-col p-2 space-y-1  border-r-2 border-slate-200">
              <Text fontSize="sm" as="p">
                سلام. من {doctorName} هستم.
              </Text>
              <Text as="p" fontSize="sm" align="justify" className="leading-6">
                پس از نهایی شدن نوبت،{' '}
                <Text className="text-primary" fontWeight="semiBold">
                  {convertTime(bookDetailsData?.book_time_string)}، از طریق {messengers[bookDetailsData?.book_params?.online_channel]?.text}
                </Text>{' '}
                شما را ویزیت خواهم کرد.
              </Text>
            </div>
          )}
          {centerId !== CENTERS.CONSULT && (
            <div>
              <div className="flex flex-col px-2 py-1 space-y-1 border-r-2 border-slate-200">
                <Text fontSize="xs" className="opacity-70">
                  مرکز
                </Text>
                {(getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData) && (
                  <Skeleton w="9rem" h="0.8rem" className="!mt-2" rounded="full" />
                )}
                {getBookDetails.isSuccess && bookDetailsData && (
                  <Text fontSize="sm" fontWeight="medium">
                    {bookDetailsData?.center_name}
                  </Text>
                )}
              </div>
              <div className="flex flex-col px-2 py-1 space-y-1 border-r-2 border-slate-200">
                <Text fontSize="xs" className="opacity-70">
                  {centerId === CENTERS.CONSULT ? 'زمان گفتگو با شما' : 'زمان نوبت'}
                </Text>
                {(getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData) && (
                  <Skeleton w="9rem" h="0.8rem" className="!my-2" rounded="full" />
                )}
                {getBookDetails.isSuccess && bookDetailsData && (
                  <Text fontSize="sm" fontWeight="medium">
                    {`${moment
                      .from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')
                      ?.locale('fa')
                      ?.format('DD MMMM')} ساعت ${moment
                      .from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')
                      ?.locale('fa')
                      ?.format('HH:mm')}`}
                  </Text>
                )}
              </div>
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
