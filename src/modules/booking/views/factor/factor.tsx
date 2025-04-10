import Alert from '@/common/components/atom/alert/alert';
import Chips from '@/common/components/atom/chips';
import Text from '@/common/components/atom/text';
import WarningIcon from '@/common/components/icons/warning';
import { CENTERS } from '@/common/types/centers';
import clsx from 'clsx';
import isEmpty from 'lodash/isEmpty';
import Discount from '../../components/factor/discount';
import Invoice from '../../components/factor/invoice';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useGetBalance } from '@/common/apis/services/wallet/getBalance';
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
  onPayment: ({ discountToken, bookId }: { discountToken?: string; bookId: string }) => void;
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
  } = props;

  const newVisitInvoice = useFeatureIsOn('new-visit-invoice');
  const useKatibePaymentForEarnestFactor = useFeatureIsOn('use-katibe-payment-for-earnest-factor');
  const { data: balance, isLoading: balanceLoading } = useGetBalance({
    enabled: !!newVisitInvoice || !!useKatibePaymentForEarnestFactor,
  });

  return (
    <div className="flex flex-col space-y-2 md:space-y-5">
      <div className="flex flex-col justify-center p-5 space-y-3 bg-white  border border-solid border-[#d0d2d6] rounded-lg shadow-card">
        <Text fontWeight="bold" fontSize="sm">
          اطلاعات پرداخت
        </Text>
        <Invoice
          serviceFeeText={newVisitInvoice ? (centerId === CENTERS.CONSULT ? 'کارمزد خدمات آنلاین' : 'مالیات و کارمزد خدمات آنلاین') : ''}
          serviceFee={newVisitInvoice ? (centerId === CENTERS.CONSULT ? 'پزشک پرداخت کرده' : 'رایگان') : ''}
          priceText={centerId === CENTERS.CONSULT || newVisitInvoice ? 'مبلغ ویزیت' : 'پیش پرداخت حق ویزیت (بیعانه)'}
          price={price}
          totalPrice={totalPrice}
          walletAmount={newVisitInvoice || useKatibePaymentForEarnestFactor ? balance?.data?.data?.balance : null}
          tax={tax}
          discount={discount}
          loading={loading || (newVisitInvoice || useKatibePaymentForEarnestFactor ? balanceLoading : false)}
        />
        {centerId === CENTERS.CONSULT && (
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
      </div>
      {isShowDiscountInput && (
        <Discount
          loading={discountLoading}
          onSubmit={onSubmitDiscount}
          status={isValidDiscount !== undefined ? (isValidDiscount ? 'successful' : 'unSuccessful') : 'default'}
          errorMessage={discountErrorMessage}
        />
      )}
      {!isEmpty(rules) && !loading && (
        <Alert severity="warning" className="p-5">
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
