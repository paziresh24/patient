import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import { useConsultPayment } from '@/common/apis/services/factor/consultPayment';
import Button from '@/common/components/atom/button/button';
import { CENTERS } from '@/common/types/centers';
import getConfig from 'next/config';
import { toast } from 'react-hot-toast';
import useDiscount from '../../hooks/factor/useDiscount';
import useInvoice from '../../hooks/factor/useInvoice';
import Factor from './factor';
const { publicRuntimeConfig } = getConfig();

interface FactorWrapperProps {
  bookId: string;
  centerId: string;
  respiteToRefundAfterDelete: string;
}

const FactorWrapper = (props: FactorWrapperProps) => {
  const { bookId, centerId, respiteToRefundAfterDelete } = props;
  const centerPayment = useCenterPayment();
  const consultPayment = useConsultPayment();

  const { isLoading, ...invoice } = useInvoice({
    bookId,
    centerId,
  });
  const { handleDiscountSubmit, ...discount } = useDiscount({
    bookId,
  });

  const handlePaymentAction = async ({ discountToken, bookId }: { discountToken?: string; bookId: string }) => {
    if (bookId) {
      const { data } = await [centerId === CENTERS.CONSULT ? consultPayment : centerPayment][0].mutateAsync({
        book_id: bookId,
        ...(discountToken && { discount_token: discountToken }),
      });
      if (data.status) {
        location.assign(data.url);
        return;
      }
      toast.error(data?.message ?? 'یک خطای غیرمنتظره رخ داد.');
    }
  };

  const getRules = () => {
    if (centerId === CENTERS.CONSULT) return [];
    return [
      `تنها در صورت لغو نوبت تا <b> ${respiteToRefundAfterDelete} ساعت</b> قبل از زمان ویزیت، امکان استرداد وجه شما ممکن می باشد.`,
      `مبلغ فوق به عنوان پیش پرداخت حق ویزیت (بیعانه) می باشد و تسویه نهایی بعد از مراجعه به مطب انجام خواهد شد.`,
    ];
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <Factor
        {...invoice}
        {...discount}
        centerId={centerId}
        bookId={bookId}
        loading={isLoading || !invoice.price}
        onSubmitDiscount={handleDiscountSubmit}
        onPayment={handlePaymentAction}
        isShowDiscountInput={centerId === CENTERS.CONSULT}
        rules={getRules()}
      />
      <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white md:p-0 md:static md:w-auto md:bg-transparent shadow-card md:shadow-none">
        <Button
          onClick={() =>
            handlePaymentAction({
              discountToken: discount.discountToken,
              bookId,
            })
          }
          className="self-end w-full md:w-44"
          loading={centerPayment.isLoading || consultPayment.isLoading}
        >
          {centerId === CENTERS.CONSULT ? 'پرداخت و رزرو گفتگو' : 'پرداخت و ثبت نوبت'}
        </Button>
      </div>
    </div>
  );
};

export default FactorWrapper;
