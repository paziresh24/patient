import { useGetBookDetails } from '@/common/apis/services/booking/getBookDetails';
import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import { LayoutWithOutFooter } from '@/common/components/layouts/layoutWithOutFooter';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import PaymentDetails from '@/modules/factor/views/paymentDetails';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo } from 'react';
import { NextPageWithLayout } from '../_app';
const { publicRuntimeConfig } = getConfig();

const Factor: NextPageWithLayout = () => {
  const {
    query: { bookId },
  } = useRouter();

  const getBookDetails = useGetBookDetails();
  const centerPayment = useCenterPayment();

  useEffect(() => {
    if (bookId)
      getBookDetails.mutate({
        book_id: bookId.toString(),
        type: 'factor',
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
        <PaymentDetails price={bookDetailsData?.book_payable_cost} loading={getBookDetails.isLoading || getBookDetails.isIdle} />
        <div className="flex flex-col space-y-1">
          <Text fontWeight="bold" className="mb-2">
            نکات مهم
          </Text>
          <ul className="list-disc mr-5 ">
            <li>
              <Text fontSize="sm">
                تنها در صورت لغو نوبت تا <strong>5 ساعت</strong> قبل از زمان ویزیت، امکان استرداد وجه شما ممکن می باشد.
              </Text>
            </li>
            <li>
              <Text fontSize="sm">
                مبلغ فوق به عنوان پیش پرداخت حق ویزیت (بیعانه) می باشد و تسویه نهایی بعد از مراجعه به مطب انجام خواهد شد.
              </Text>
            </li>
          </ul>
        </div>
        <Button onClick={handlePaymentAction} className="self-end w-40" loading={centerPayment.isLoading}>
          پرداخت و ثبت نوبت
        </Button>
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

Factor.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithOutFooter>{page}</LayoutWithOutFooter>;
};

export default Factor;
