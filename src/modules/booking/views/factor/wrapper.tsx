import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import { CENTERS } from '@/common/types/centers';
import useDiscount from '../../hooks/factor/useDiscount';
import useInvoice from '../../hooks/factor/useInvoice';
import Factor from './factor';

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
        location.assign(data.url);
      }
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <Factor
        {...invoice}
        {...discount}
        bookId={bookId}
        centerId={centerId}
        loading={isLoading}
        onSubmitDiscount={handleDiscountSubmit}
        onPayment={handlePaymentAction}
        isShowDiscountInput={centerId === CENTERS.CONSULT}
      />
    </div>
  );
};

export default FactorWrapper;
