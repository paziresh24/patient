import { useCenterPayment } from '@/common/apis/services/factor/centerPayment';
import { useConsultPayment } from '@/common/apis/services/factor/consultPayment';
import Alert from '@/common/components/atom/alert/alert';
import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import useApplication from '@/common/hooks/useApplication';
import { CENTERS } from '@/common/types/centers';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';
import getConfig from 'next/config';
import { useEffect } from 'react';
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
  const isApplication = useApplication();
  const userInfo = useUserInfoStore(state => state.info);
  const premiumOnlineVistDiscountCode = useFeatureValue('premium.online_visit_discount_code', '');
  const premiumOnlineVisitDiscountPercentage = useFeatureValue('premium.online_visit_discount_percentage', '');

  const { isLoading, ...invoice } = useInvoice({
    bookId,
    centerId,
  });
  const { handleDiscountSubmit, ...discount } = useDiscount({
    bookId,
  });

  useEffect(() => {
    if (checkPremiumUser(userInfo.vip) && premiumOnlineVistDiscountCode && premiumOnlineVisitDiscountPercentage) {
      handleDiscountSubmit(premiumOnlineVistDiscountCode);
    }
  }, [userInfo, premiumOnlineVistDiscountCode, premiumOnlineVisitDiscountPercentage]);

  const handlePaymentAction = async ({ discountToken, bookId }: { discountToken?: string; bookId: string }) => {
    if (bookId) {
      const { data } = await [centerId === CENTERS.CONSULT ? consultPayment : centerPayment][0].mutateAsync({
        book_id: bookId,
        ...(discountToken && { discount_token: discountToken }),
      });
      if (isApplication) {
        window.open(data.url, '_blank');
        return;
      }
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
        isShowDiscountInput={
          centerId === CENTERS.CONSULT && checkPremiumUser(userInfo.vip)
            ? !premiumOnlineVisitDiscountPercentage && !premiumOnlineVistDiscountCode
            : true
        }
        rules={getRules()}
      />
      {checkPremiumUser(userInfo.vip) && premiumOnlineVisitDiscountPercentage && premiumOnlineVistDiscountCode && (
        <Alert severity="warning" className="p-4">
          <div className="flex space-s-2 text-amber-700 items-center">
            <DiamondIcon />
            <Text fontSize="sm" fontWeight="medium">
              %{premiumOnlineVisitDiscountPercentage} تخفیف برای ویزیت آنلاین اعمال شده است.
            </Text>
          </div>
        </Alert>
      )}
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
