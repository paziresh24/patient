import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
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
}

const FactorWrapper = (props: FactorWrapperProps) => {
  const { bookId, centerId } = props;
  const centerPayment = useCenterPayment();

  const { isLoading, ...invoice } = useInvoice({
    bookId,
    centerId,
  });
  const { handleDiscountSubmit, ...discount } = useDiscount({
    bookId,
  });

  const handlePaymentAction = async ({ discountToken, bookId }: { discountToken?: string; bookId: string }) => {
    if (bookId) {
      const { data } = await centerPayment.mutateAsync({ book_id: bookId, ...(discountToken && { discount_token: discountToken }) });
      if (data.status) {
        location.assign(publicRuntimeConfig.CLINIC_BASE_URL + data.url);
        return;
      }
      toast.error(data?.message ?? 'یک خطای غیرمنتظره رخ داد.');
    }
  };

  const getRules = () => {
    if (centerId === CENTERS.CONSULT) return [];
    return [
      `تنها در صورت لغو نوبت تا <b> 5 ساعت</b> قبل از زمان ویزیت، امکان استرداد وجه شما ممکن می باشد.`,
      `مبلغ فوق به عنوان پیش پرداخت حق ویزیت (بیعانه) می باشد و تسویه نهایی بعد از مراجعه به مطب انجام خواهد شد.`,
    ];
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <Factor
        {...invoice}
        {...discount}
        centerId={centerId}
        loading={isLoading}
        onSubmitDiscount={handleDiscountSubmit}
        onPayment={handlePaymentAction}
        isShowDiscountInput={centerId === CENTERS.CONSULT}
        rules={getRules()}
      />
      <div className="p-4 flex flex-col md:p-0 fixed md:static bottom-0 w-full md:w-auto right-0  bg-white md:bg-transparent shadow-card md:shadow-none">
        <Button
          onClick={() =>
            handlePaymentAction({
              discountToken: discount.discountToken,
              bookId,
            })
          }
          className="self-end w-full md:w-44"
          loading={centerPayment.isLoading}
        >
          {centerId === CENTERS.CONSULT ? 'پرداخت و شروع گفتگو' : 'پرداخت و ثبت نوبت'}
        </Button>
      </div>
    </div>
  );
};

export default FactorWrapper;
