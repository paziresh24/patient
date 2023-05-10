import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import OnlineDoctorInfo from '@/common/components/atom/info/onlineDoctorInfo';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { Messenger, messengers } from '@/common/constants/messengers';
import { withCSR } from '@/common/hoc/withCsr';
import { CENTERS } from '@/common/types/centers';
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
        {(getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData) && <Loading />}
        {bookDetailsData && centerId === CENTERS.CONSULT && bookDetailsData?.book_params?.online_channel && (
          <OnlineDoctorInfo
            firstName={bookDetailsData?.doctor_name}
            lastName={bookDetailsData?.doctor_family}
            avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor_image}
            expertise={getDisplayDoctorExpertise({
              aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
              degree: bookDetailsData?.expertises?.[0]?.degree?.name,
              expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
            })}
            desciription={`سلام. من دکتر ${bookDetailsData?.doctor_name} ${
              bookDetailsData?.doctor_family
            } هستم.<br /> شما <b class="text-primary">ویزیت آنلاین از طریق ${
              messengers[bookDetailsData?.book_params?.online_channel as Messenger]?.name
            } </b> را انتخاب کرده اید.<br /><b class="text-primary">${moment
              .from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')
              ?.locale('fa')
              ?.calendar(undefined, {
                nextWeek: 'dddd',
                sameElse: 'dddd',
              })}</b> (تا حداکثر 5 ساعت بعد از آن) .پاسخگو سوالات شما خواهم بود. توجه داشته باشید در صورتی که از زمان نوبت تا 3 ساعت بعد از آن پاسخگوی شما نبودم، درخواست شما به صورت اتوماتیک لغو و هزینه به حساب شما باز میگردد`}
            wrapperClassName="mb-3 lg:w-2/5 rounded-md"
          />
        )}

        {bookDetailsData && centerId !== CENTERS.CONSULT && (
          <div className="w-full p-3 mb-2 space-y-3 bg-white border border-solid border-[#d0d2d6] rounded-lg shadow-card md:mb-0 md:w-2/5">
            <DoctorInfo
              className="p-4 rounded-lg bg-slate-50"
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
            <div>
              {centerId !== CENTERS.CONSULT && (
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
              )}
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
                      ?.calendar(undefined, {
                        sameDay: '[امروز]',
                        nextDay: '[فردا]',
                        nextWeek: 'dddd',
                        sameElse: 'dddd',
                      })}
              ${moment.from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.format('DD MMMM')}
                ساعت
                 ${moment.from(digitsFaToEn(bookDetailsData?.book_time_string), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.format('HH:mm')}
            `}
                  </Text>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const Loading = () => {
  return (
    <>
      <div className=" gap-2 mb-3 md:!mb-0  bg-white p-4 w-full  md:basis-2/5  rounded-lg">
        <div className="flex items-cente">
          <Skeleton w="4.4rem" h="4.4rem" rounded="full" />
          <div className="flex flex-col justify-center gap-3 mr-2">
            <Skeleton w="8rem" h="1rem" rounded="full" />
            <Skeleton w="4rem" h="1rem" rounded="full" />
          </div>
        </div>
        <Skeleton w="100%" h="8rem" rounded="md" className="mt-4" />
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

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Factor;
