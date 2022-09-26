import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import BookInfo from '@/modules/receipt/views/bookInfo';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '../_app';
const { publicRuntimeConfig } = getConfig();

const Receipt: NextPageWithLayout = () => {
  const {
    query: { bookId },
  } = useRouter();

  const getBookDetails = useGetBookDetails();
  const centerPayment = useCenterPayment();

  useEffect(() => {
    if (bookId)
      getBookDetails.mutate({
        book_id: bookId.toString(),
      });
  }, [bookId]);

  const bookDetailsData = useMemo(() => getBookDetails.isSuccess && getBookDetails.data?.data?.result?.[0], [getBookDetails.status]);

  const handlePaymentAction = async () => {
    if (bookId) {
      const { data } = await centerPayment.mutateAsync({ book_id: bookId?.toString() });
      if (data.status) {
        location.assign(data.url);
      }
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row items-start space-s-0 md:space-s-5 max-w-screen-xl mx-auto md:py-10">
      <div className="w-full flex flex-col space-y-6 bg-white rounded-lg shadow-card p-5 md:p-8">
        <div className="flex flex-col justify-center items-center space-y-3">
          <svg width="43" height="43" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.875 18.5C5.875 11.5274 11.5274 5.875 18.5 5.875C25.4726 5.875 31.125 11.5274 31.125 18.5C31.125 25.4726 25.4726 31.125 18.5 31.125C11.5274 31.125 5.875 25.4726 5.875 18.5ZM18.5 3.375C10.1467 3.375 3.375 10.1467 3.375 18.5C3.375 26.8533 10.1467 33.625 18.5 33.625C26.8533 33.625 33.625 26.8533 33.625 18.5C33.625 10.1467 26.8533 3.375 18.5 3.375ZM25.5506 14.7589C26.0387 14.2707 26.0387 13.4793 25.5506 12.9911C25.0624 12.503 24.2709 12.503 23.7828 12.9911L16.9583 19.8156L14.7589 17.6161C14.2707 17.128 13.4793 17.128 12.9911 17.6161C12.503 18.1043 12.503 18.8957 12.9911 19.3839L16.0745 22.4672C16.5626 22.9554 17.3541 22.9554 17.8422 22.4672L25.5506 14.7589Z"
              fill="#28A745"
            ></path>
          </svg>
          <Text fontWeight="bold" className="text-green-600">
            نوبت شما با موفقیت ثبت شد
          </Text>
        </div>
        <BookInfo turnData={bookDetailsData} loading={getBookDetails.isLoading || getBookDetails.isIdle} />
        <div className="flex flex-col space-y-3">
          <div className="flex space-s-3">
            <Button block variant="secondary" onClick={handlePaymentAction} loading={centerPayment.isLoading}>
              دانلود رسید نوبت
            </Button>

            <Button block variant="secondary" onClick={handlePaymentAction} loading={centerPayment.isLoading}>
              اشتراک گذاری
            </Button>
          </div>
          <Button block variant="secondary" onClick={handlePaymentAction} loading={centerPayment.isLoading}>
            نوبت های من
          </Button>
        </div>
      </div>
      <div className="w-full md:w-[35rem] bg-white p-5 shadow-card rounded-lg mb-2 md:mb-0">
        <DoctorInfo
          avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor_image}
          firstName={bookDetailsData?.doctor_name}
          lastName={bookDetailsData?.doctor_family}
          expertise={getDisplayDoctorExpertise({
            aliasTitle: bookDetailsData?.expertises?.[0]?.alias_title,
            degree: bookDetailsData?.expertises?.[0]?.degree?.name,
            expertise: bookDetailsData?.expertises?.[0]?.expertise?.name,
          })}
          isLoading={getBookDetails.isLoading || getBookDetails.isIdle}
        />
      </div>
    </div>
  );
};

Receipt.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithOutFooter>{page}</LayoutWithOutFooter>;
};

export default Receipt;
