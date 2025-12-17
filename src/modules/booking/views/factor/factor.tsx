import Alert from '@/common/components/atom/alert/alert';
import Chips from '@/common/components/atom/chips';
import Text from '@/common/components/atom/text';
import WarningIcon from '@/common/components/icons/warning';
import Skeleton from '@/common/components/atom/skeleton';
import { CENTERS } from '@/common/types/centers';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import { useState, useEffect } from 'react';
import Discount from '../../components/factor/discount';
import Invoice from '../../components/factor/invoice';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useGetBalance } from '@/common/apis/services/wallet/getBalance';
import { useGetPaymentMethods } from '@/common/apis/services/factor/paymentMethods';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import useModal from '@/common/hooks/useModal';
import Modal from '@/common/components/atom/modal';
import PaymentMethods from '../../components/factor/paymentMethods';
interface FactorProps {
  bookId: string;
  centerId: string;
  price?: string;
  tax?: string;
  /*
    discount
  */
  discount?: string;
  discountToken?: string;
  discountErrorMessage?: string;
  discountLoading?: boolean;
  isShowDiscountInput?: boolean;
  isValidDiscount?: boolean;
  totalPrice?: string;
  rules?: string[];
  loading: boolean;
  onSubmitDiscount: (code: string) => void;
  onPayment: ({ discountToken, bookId, paymentMethod }: { discountToken?: string; bookId: string; paymentMethod?: string }) => void;
  selectedPaymentMethod?: string;
  onSelectionChange?: (paymentMethod: string) => void;
}
export const Factor = (props: FactorProps) => {
  const {
    centerId,
    price,
    totalPrice,
    tax,
    rules = [],
    onSubmitDiscount,
    discount,
    isValidDiscount,
    discountErrorMessage,
    isShowDiscountInput = false,
    discountLoading,
    loading,
    selectedPaymentMethod: propSelectedPaymentMethod,
    onSelectionChange,
  } = props;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(propSelectedPaymentMethod || '');
  const [isPaymentMethodsLoading, setIsPaymentMethodsLoading] = useState(false);
  const { handleOpen, modalProps } = useModal();
  const newVisitInvoice = useFeatureIsOn('new-visit-invoice');
  const refundTermsBadge = useFeatureIsOn('refund-terms-badge');
  const useKatibePaymentForEarnestFactor = useFeatureIsOn('use-katibe-payment-for-earnest-factor');
  const isKatibePaymentMethodsEnabled = useFeatureIsOn('katibe-paymentmethods');
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userInfo = useUserInfoStore(state => state.info);

  const timezone =
    typeof Intl?.DateTimeFormat?.()?.resolvedOptions()?.timeZone === 'string'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : undefined;

  const { data: balance, isLoading: balanceLoading } = useGetBalance({
    enabled: (!!newVisitInvoice || !!useKatibePaymentForEarnestFactor) && isLogin,
  });

  const { data: paymentMethodsData } = useGetPaymentMethods(
    {
      amount: totalPrice,
      timezone,
      countryCode: userInfo?.country_code_id,
      center_id: centerId,
    },
    {
      enabled: isKatibePaymentMethodsEnabled && !!totalPrice && !loading,
    },
  );
  const paymentMethods = paymentMethodsData?.data?.data?.payment_methods || [];
  const additionalContent = paymentMethodsData?.data?.data?.additional_content || '';
  const payment_description_html = paymentMethodsData?.data?.data?.payment_description_html || '';

  const handlePaymentMethodSelection = (paymentMethod: string) => {
    setSelectedPaymentMethod(paymentMethod);
    onSelectionChange?.(paymentMethod);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (isKatibePaymentMethodsEnabled) {
      setIsPaymentMethodsLoading(true);
      timeoutId = setTimeout(() => {
        setIsPaymentMethodsLoading(false);
      }, 5000);
    } else {
      setIsPaymentMethodsLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isKatibePaymentMethodsEnabled]);

  useEffect(() => {
    if (paymentMethodsData && isPaymentMethodsLoading) {
      setIsPaymentMethodsLoading(false);
    }
  }, [paymentMethodsData, isPaymentMethodsLoading]);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const firstPaymentMethod = paymentMethods[0].payment_method;
      setSelectedPaymentMethod(firstPaymentMethod);
      onSelectionChange?.(firstPaymentMethod);
    }
  }, [paymentMethods, selectedPaymentMethod, onSelectionChange]);

  return (
    <div className="flex flex-col space-y-2 md:space-y-5">
      <div className="flex flex-col justify-center p-5 space-y-3 bg-white md:rounded-lg shadow-card">
        <Invoice
          serviceFeeText={centerId === CENTERS.CONSULT ? 'کارمزد خدمات آنلاین' : 'مالیات و کارمزد خدمات آنلاین'}
          serviceFee={centerId === CENTERS.CONSULT ? 'پزشک پرداخت کرده' : 'رایگان'}
          priceText={centerId === CENTERS.CONSULT || !useKatibePaymentForEarnestFactor ? 'مبلغ ویزیت' : 'پیش پرداخت حق ویزیت (بیعانه)'}
          price={price}
          totalPrice={totalPrice}
          walletAmount={newVisitInvoice || useKatibePaymentForEarnestFactor ? balance?.data?.data?.balance : null}
          tax={tax}
          discount={discount}
          payment_description_html={payment_description_html || ''}
          loading={loading || (newVisitInvoice || useKatibePaymentForEarnestFactor ? balanceLoading : false)}
        />
        {centerId === CENTERS.CONSULT && !refundTermsBadge && (
          <Chips
            className="self-center !py-2 text-slate-800"
            icon={
              <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.1178 22.8254C13.2332 22.8857 13.3622 22.9163 13.4911 22.9153C13.6201 22.9143 13.7481 22.8826 13.8645 22.8213L17.581 20.8346C18.6349 20.2728 19.4603 19.6446 20.1041 18.9132C21.5041 17.3197 22.2686 15.286 22.255 13.1889L22.211 6.2716C22.2068 5.47486 21.6835 4.76392 20.9095 4.50549L13.9956 2.18574C13.5792 2.04478 13.1231 2.04785 12.7141 2.19289L5.8263 4.59538C5.05656 4.86402 4.54271 5.58007 4.5469 6.37783L4.59095 13.2901C4.60458 15.3902 5.39529 17.4147 6.81835 18.9919C7.46854 19.713 8.30119 20.332 9.36666 20.8846L13.1178 22.8254ZM12.1339 14.6955C12.2891 14.8446 12.4905 14.9182 12.6918 14.9161C12.8932 14.9151 13.0935 14.8395 13.2466 14.6883L17.3081 10.6842C17.6133 10.3829 17.6102 9.89871 17.3018 9.60146C16.9925 9.30422 16.4944 9.30626 16.1892 9.60759L12.6803 13.0663L11.2436 11.6852C10.9342 11.388 10.4371 11.3911 10.1309 11.6924C9.82576 11.9937 9.82891 12.4779 10.1383 12.7751L12.1339 14.6955Z"
                  fill="#28A745"
                ></path>
              </svg>
            }
          >
            ضمانت %100 بازگشت وجه در صورت نارضایتی
          </Chips>
        )}
        {centerId === CENTERS.CONSULT && refundTermsBadge && (
          <Chips
            className="self-center !py-2 text-slate-800"
            icon={
              <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.1178 22.8254C13.2332 22.8857 13.3622 22.9163 13.4911 22.9153C13.6201 22.9143 13.7481 22.8826 13.8645 22.8213L17.581 20.8346C18.6349 20.2728 19.4603 19.6446 20.1041 18.9132C21.5041 17.3197 22.2686 15.286 22.255 13.1889L22.211 6.2716C22.2068 5.47486 21.6835 4.76392 20.9095 4.50549L13.9956 2.18574C13.5792 2.04478 13.1231 2.04785 12.7141 2.19289L5.8263 4.59538C5.05656 4.86402 4.54271 5.58007 4.5469 6.37783L4.59095 13.2901C4.60458 15.3902 5.39529 17.4147 6.81835 18.9919C7.46854 19.713 8.30119 20.332 9.36666 20.8846L13.1178 22.8254ZM12.1339 14.6955C12.2891 14.8446 12.4905 14.9182 12.6918 14.9161C12.8932 14.9151 13.0935 14.8395 13.2466 14.6883L17.3081 10.6842C17.6133 10.3829 17.6102 9.89871 17.3018 9.60146C16.9925 9.30422 16.4944 9.30626 16.1892 9.60759L12.6803 13.0663L11.2436 11.6852C10.9342 11.388 10.4371 11.3911 10.1309 11.6924C9.82576 11.9937 9.82891 12.4779 10.1383 12.7751L12.1339 14.6955Z"
                  fill="#28A745"
                ></path>
              </svg>
            }
          >
            ضمانت بازگشت وجه در صورت نارضایتی{' '}
            <span className="text-primary text-[0.65rem] cursor-pointer underline underline-offset-4" onClick={handleOpen}>
              (طبق شرایط)
            </span>
          </Chips>
        )}
      </div>
      {isKatibePaymentMethodsEnabled &&
        (isPaymentMethodsLoading ? (
          <div className="px-1 !bg-white rounded-none md:rounded-lg shadow-card">
            <div className="flex items-center justify-between select-none cursor-pointer p-4">
              <Skeleton w="120px" h="20px" rounded="sm" />
              <Skeleton w="16px" h="16px" rounded="sm" />
            </div>
          </div>
        ) : (
          paymentMethods.length > 0 && (
            <PaymentMethods
              paymentMethods={paymentMethods}
              additionalContent={additionalContent}
              isOpen={paymentMethods.length > 1}
              selectedPaymentMethod={selectedPaymentMethod}
              onSelectionChange={handlePaymentMethodSelection}
            />
          )
        ))}
      {isShowDiscountInput && (
        <Discount
          loading={discountLoading}
          onSubmit={onSubmitDiscount}
          status={isValidDiscount !== undefined ? (isValidDiscount ? 'successful' : 'unSuccessful') : 'default'}
          errorMessage={discountErrorMessage}
        />
      )}
      <Modal {...modalProps} fullScreen title="شرایط استرداد وجه" bodyClassName="p-0">
        <iframe src="https://www.paziresh24.com/home/online-visit-refund-terms/" className="h-full w-full" />
      </Modal>
      {!isEmpty(rules) && !loading && (
        <Alert severity="warning" className="p-5 rounded-none md:rounded-lg">
          <div className="flex items-strat gap-2 mb-2">
            <WarningIcon className="-translate-y-1 text-[#975b2a]" />
            <Text fontWeight="bold">لطفا دقت کنید!</Text>
          </div>
          <ul className="mr-5 list-disc space-y-4">
            {rules.map((rule, index) => [
              <li key={index}>
                <Text fontSize="sm" className={clsx({ 'text-[#975b2a]': index === 0 })} dangerouslySetInnerHTML={{ __html: rule }} />
              </li>,
            ])}
          </ul>
        </Alert>
      )}
    </div>
  );
};
export default Factor;
