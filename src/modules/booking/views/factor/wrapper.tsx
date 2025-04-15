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
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import useDiscount from '../../hooks/factor/useDiscount';
import useInvoice from '../../hooks/factor/useInvoice';
import Factor from './factor';
import { splunkInstance } from '@/common/services/splunk';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import useFirstFreeTime from '../../hooks/selectTime/useFirstFreeTime';
import useBooking from '../../hooks/booking';

interface FactorWrapperProps {
  bookId?: string;
  userCenterId?: string;
  serviceId?: string;
  centerId: string;
  respiteToRefundAfterDelete?: string;
}

const FactorWrapper = (props: FactorWrapperProps) => {
  const { bookId, centerId, serviceId, userCenterId, respiteToRefundAfterDelete } = props;
  const centerPayment = useCenterPayment();
  const consultPayment = useConsultPayment();
  const isApplication = useApplication();
  const userInfo = useUserInfoStore(state => state.info);
  const premiumOnlineVistDiscountCode = useFeatureValue('premium.online_visit_discount_code', '');
  const premiumOnlineVisitDiscountPercentage = useFeatureValue('premium.online_visit_discount_percentage', '');
  const newVisitInvoice = useFeatureIsOn('new-visit-invoice');
  const isLogin = useUserInfoStore(state => state.isLogin);
  const loginModal = useLoginModalContext();
  const getFirstFreeTime = useFirstFreeTime({
    enabled: false,
    centerId: centerId,
    serviceId: serviceId!,
    userCenterId: userCenterId!,
  });
  const { handleBook, isLoading: bookLoading } = useBooking();

  const { isLoading, ...invoice } = useInvoice({
    bookId,
    centerId,
    serviceId,
    userCenterId: userCenterId,
  });
  const { handleDiscountSubmit, ...discount } = useDiscount({
    bookId: bookId ?? '',
    centerId,
    serviceId,
    userCenterId: userCenterId,
  });

  const isApplyPremiumDiscount = useMemo(
    () =>
      checkPremiumUser(userInfo.vip) &&
      centerId === CENTERS.CONSULT &&
      premiumOnlineVistDiscountCode &&
      premiumOnlineVisitDiscountPercentage,
    [userInfo, premiumOnlineVistDiscountCode, premiumOnlineVisitDiscountPercentage, centerId],
  );

  useEffect(() => {
    if (isApplyPremiumDiscount) {
      handleDiscountSubmit(premiumOnlineVistDiscountCode);
    }
  }, [isApplyPremiumDiscount]);

  const handlePaymentAction = async ({
    discountToken,
    bookId,
    userDataFromLogin = null,
  }: {
    discountToken?: string;
    bookId?: string;
    userDataFromLogin?: any;
  }) => {
    if (serviceId || bookId) {
      if (!bookId) {
        let reserveId: string | undefined;

        const freeturnData = await getFirstFreeTime.getFirstFreeTime();
        if (!freeturnData.timeId) return toast.error(freeturnData?.message ?? 'خطا در دریافت نوبت خالی پزشک.');
        reserveId = freeturnData.timeId;

        return handleBook(
          {
            center: {
              id: centerId,
              user_center_id: userCenterId!,
              server_id: '1',
            },
            timeId: reserveId as string,
            user: {
              name: '',
              family: '',
              cell: userDataFromLogin?.cell ?? userInfo?.cell,
              messengerType: 'skip_select_user',
            },
          },
          {
            async onSuccess(data) {
              if (data.payment.reqiure_payment === '1') {
                const { data: paymentData } = await [centerId === CENTERS.CONSULT ? consultPayment : centerPayment][0].mutateAsync({
                  book_id: data?.book_info?.id as string,
                  ...(discountToken && { discount_token: discountToken }),
                });
                if (paymentData.status) {
                  splunkInstance('booking').sendEvent({
                    group: 'FinancialTransactions',
                    type: 'PaymentButtonClicked',
                    event: {
                      book_id: data?.book_info?.id,
                      center_id: centerId,
                      user_id: userInfo.id,
                    },
                  });
                  location.assign(paymentData.url);
                  return;
                }
                toast.error(paymentData?.message ?? 'یک خطای غیرمنتظره رخ داد.');
              }
            },
            onError(data) {
              if (Object.values(data?.details ?? {})?.length > 0) {
                toast.error(
                  `${data.message} \n ${Object.entries(data?.details)
                    .map(item => `${item[0]}: ${item[1]}`)
                    .join('\n')}`,
                  {
                    duration: 10000,
                  },
                );
              }
              if (Object.values(data?.details ?? {})?.length == 0) {
                toast.error(data.message, {
                  duration: 10000,
                });
              }
            },
          },
        );
      }

      const { data } = await [centerId === CENTERS.CONSULT ? consultPayment : centerPayment][0].mutateAsync({
        book_id: bookId,
        ...(discountToken && { discount_token: discountToken }),
      });
      if (data.status) {
        splunkInstance('booking').sendEvent({
          group: 'FinancialTransactions',
          type: 'PaymentButtonClicked',
          event: {
            book_id: bookId,
            center_id: centerId,
            user_id: userInfo.id,
          },
        });
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
      newVisitInvoice
        ? `این مبلغ هزینه ویزیت شما است که به‌صورت آنلاین پرداخت می‌شود.`
        : `مبلغ فوق به عنوان پیش پرداخت حق ویزیت (بیعانه) می باشد و تسویه نهایی بعد از مراجعه به مطب انجام خواهد شد.`,
      newVisitInvoice ? `درصورتی‌که خدمات اضافی در مطب ارائه شود، ممکن است هزینه‌های دیگری نیز توسط پزشک تعیین و دریافت شود.` : undefined,
    ];
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      <Factor
        {...invoice}
        {...discount}
        centerId={centerId}
        bookId={bookId ?? ''}
        loading={isLoading || !invoice.price}
        onSubmitDiscount={(code: string) => {
          if (!isLogin) {
            return loginModal.handleOpenLoginModal({
              state: true,
              postLogin: userInfo => handleDiscountSubmit(code),
            });
          }
          handleDiscountSubmit(code);
        }}
        onPayment={handlePaymentAction}
        isShowDiscountInput={
          centerId === CENTERS.CONSULT &&
          (checkPremiumUser(userInfo.vip) ? !premiumOnlineVisitDiscountPercentage && !premiumOnlineVistDiscountCode : true)
        }
        rules={getRules()?.filter(Boolean) as string[]}
      />
      {isApplyPremiumDiscount && (
        <Alert severity="warning" className="p-4">
          <div className="flex items-center space-s-2 text-amber-700">
            <DiamondIcon />
            <Text fontSize="sm" fontWeight="medium">
              %{premiumOnlineVisitDiscountPercentage} تخفیف برای ویزیت آنلاین اعمال شده است.
            </Text>
          </div>
        </Alert>
      )}
      <div className="fixed bottom-0 right-0 flex flex-col w-full p-4 bg-white md:p-0 md:static md:w-auto md:bg-transparent shadow-card md:shadow-none">
        <Button
          onClick={() => {
            if (!isLogin) {
              return loginModal.handleOpenLoginModal({
                state: true,
                postLogin: userInfo =>
                  handlePaymentAction({
                    discountToken: discount.discountToken,
                    bookId: bookId ?? '',
                    userDataFromLogin: userInfo,
                  }),
              });
            }
            handlePaymentAction({
              discountToken: discount.discountToken,
              bookId: bookId ?? '',
            });
          }}
          className="self-end w-full md:w-auto"
          loading={centerPayment.isLoading || consultPayment.isLoading || bookLoading || getFirstFreeTime?.loading}
        >
          {centerId === CENTERS.CONSULT ? 'پرداخت و آغاز گفتگو' : 'پرداخت و ثبت نوبت'}
        </Button>
      </div>
    </div>
  );
};

export default FactorWrapper;
