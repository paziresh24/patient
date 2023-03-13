import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
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
      <Seo title="فاکتور نوبت" />
      <div className="flex flex-col-reverse items-start max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="w-full md:basis-4/6">
          <FactorWrapper bookId={bookId as string} centerId={centerId as string} />
        </div>
        <div className="w-full p-3 mb-2 space-y-3 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6">
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
            {centerId === CENTERS.CONSULT && bookDetailsData?.book_params?.online_channel && (
              <div className="flex flex-col px-2 py-1 space-y-1 border-r-2 border-slate-200">
                <Text fontSize="xs" className="opacity-70">
                  نام پیام رسان
                </Text>
                {(getBookDetails.isLoading || getBookDetails.isIdle || !bookDetailsData) && (
                  <Skeleton w="9rem" h="0.8rem" className="!mt-2" rounded="full" />
                )}
                {getBookDetails.isSuccess && bookDetailsData && (
                  <Text fontSize="sm" fontWeight="medium" className="flex items-center">
                    <img
                      src={messengers[bookDetailsData?.book_params?.online_channel as Messenger]?.icon}
                      width={24}
                      height={24}
                      alt=""
                      className="ml-1"
                    />
                    {messengers[bookDetailsData?.book_params?.online_channel as Messenger]?.name}
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
                  {`${moment(bookDetailsData?.book_from * 1000)
                    ?.locale('fa')
                    ?.calendar(undefined, {
                      sameDay: '[امروز]',
                      nextDay: '[فردا]',
                      nextWeek: 'dddd',
                      sameElse: 'dddd',
                    })}
              ${moment(bookDetailsData?.book_from * 1000)
                ?.locale('fa')
                ?.format('DD MMMM')}
                ساعت
                 ${moment(bookDetailsData?.book_from * 1000)
                   ?.locale('fa')
                   ?.format('HH:mm')}
            `}
                </Text>
              )}
            </div>
          </div>
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

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Factor;
