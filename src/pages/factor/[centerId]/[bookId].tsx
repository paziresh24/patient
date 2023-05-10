import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import Badge from '@/common/components/atom/badge/badge';
import Divider from '@/common/components/atom/divider/divider';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { Messenger, messengers } from '@/common/constants/messengers';
import { withCSR } from '@/common/hoc/withCsr';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import FactorWrapper from '@/modules/booking/views/factor/wrapper';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import { digitsFaToEn } from '@persian-tools/persian-tools';
import moment from 'jalali-moment';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo } from 'react';
const { publicRuntimeConfig } = getConfig();

const Factor = () => {
  const {
    query: { bookId, centerId },
  } = useRouter();
  const getBookDetails = useGetBookDetails();

  useEffect(() => {
    if (bookId)
      getBookDetails.mutate({
        book_id: bookId.toString(),
        type: 'factor',
      });
  }, [bookId]);

  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);
  const isOnlineVisitTurn = !!bookDetailsData?.book_params?.online_channel;
  const convertTime = (time: string) => {
    return moment.from(digitsFaToEn(time), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.calendar(undefined, {
      nextWeek: 'dddd',
      sameElse: 'dddd',
    });
  };

  return (
    <>
      <Seo title="فاکتور نوبت" noIndex />

      <div className="flex flex-col-reverse items-start p-3 max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="w-full md:basis-4/6">
          <FactorWrapper
            bookId={bookId as string}
            centerId={centerId as string}
            respiteToRefundAfterDelete={bookDetailsData?.settings?.booking_respite_to_refund_after_delete ?? '5'}
          />
        </div>
        <div
          className={classNames(
            'w-full p-3 mb-[0.6rem] space-y-3 bg-white border border-solid border-[#d0d2d6] rounded-lg shadow-card md:mb-0 md:w-2/5',
            {
              'border-primary': isOnlineVisitTurn,
            },
          )}
        >
          {(getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData) && <Loading />}
          {!!bookDetailsData && (
            <>
              <div
                className={classNames('block', {
                  'flex justify-between': isOnlineVisitTurn,
                })}
              >
                <DoctorInfo
                  className={classNames('p-4 rounded-lg', {
                    'bg-slate-50': centerId !== CENTERS.CONSULT,
                    '!p-0': isOnlineVisitTurn,
                  })}
                  avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor_image}
                  firstName={bookDetailsData?.doctor_name}
                  lastName={bookDetailsData?.doctor_family}
                  expertise={getDisplayDoctorExpertise({
                    aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
                    degree: bookDetailsData?.expertises?.[0]?.degree?.name,
                    expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
                  })}
                  isLoading={getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData}
                />
                {isOnlineVisitTurn && (
                  <Badge
                    text="ویزیت آنلاین"
                    className="bg-[#f9f8fd] !rounded-md translate-x-[-0.5rem] translate-y-[-1rem] text-[0.75rem] text-[#56d4bf] p-2 whitespace-nowrap"
                  />
                )}
              </div>
              {isOnlineVisitTurn && <Divider className="!my-2" />}
              {bookDetailsData && centerId === CENTERS.CONSULT && isOnlineVisitTurn && (
                <Text
                  fontWeight="semiBold"
                  dangerouslySetInnerHTML={{
                    __html: `سلام. من دکتر ${bookDetailsData?.doctor_name} ${
                      bookDetailsData?.doctor_family
                    } هستم.<br /> شما <b class="text-primary">ویزیت آنلاین از طریق ${
                      messengers[bookDetailsData?.book_params?.online_channel as Messenger]?.name
                    } </b> را انتخاب کرده اید.<br /><b class="text-primary">${convertTime(
                      bookDetailsData?.book_time_string,
                    )}</b> (تا حداکثر 5 ساعت بعد از آن) .پاسخگو سوالات شما خواهم بود. توجه داشته باشید در صورتی که از زمان نوبت تا 3 ساعت بعد از آن پاسخگوی شما نبودم، درخواست شما به صورت اتوماتیک لغو و هزینه به حساب شما باز میگردد`,
                  }}
                  className="text-[#77777c] !leading-7 text-justify lg:text-[0.75rem] text-sm block"
                />
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
                        {`${convertTime(bookDetailsData?.book_time_string)}
              ${moment.from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.format('DD MMMM')}
                ساعت
                 ${moment.from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.format('HH:mm')}
            `}
                      </Text>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

const Loading = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Skeleton w="4.4rem" h="4.4rem" rounded="full" />
        <div className="flex flex-col mr-4 space-y-3">
          <Skeleton w="7rem" h="1rem" rounded="full" />
          <Skeleton w="4rem" h="1rem" rounded="full" />
        </div>
      </div>
      <Skeleton w="100%" h="7rem" rounded="md" className="my-3" />
    </div>
  );
};

Factor.getLayout = function getLayout(page: ReactElement) {
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

export default Factor;
