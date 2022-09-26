import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { addCommas } from '@persian-tools/persian-tools';

interface PaymentDetailsProps {
  price: string;
  loading: boolean;
}
export const PaymentDetails = (props: PaymentDetailsProps) => {
  const { price, loading = false } = props;
  const formattedPrice = addCommas(+price / 10);
  return (
    <div className="flex flex-col space-y-6">
      <Text fontWeight="bold">اطلاعات پرداخت</Text>
      <div className="mt-5 border border-solid border-slate-200  rounded-lg">
        <div className="flex justify-between p-5">
          {loading && (
            <>
              <Skeleton w="10rem" h="1.25rem" rounded="full" />
              <Skeleton w="5rem" h="1.25rem" rounded="full" />
            </>
          )}

          {!loading && (
            <>
              <Text fontWeight="medium" fontSize="sm">
                پیش پرداخت حق ویزیت (بیعانه):
              </Text>
              <Text fontWeight="medium" fontSize="sm">
                {formattedPrice} تومان
              </Text>
            </>
          )}
        </div>
        <div className="border-t border-dashed border-slate-200 flex justify-center space-s-2 p-5">
          {loading && <Skeleton w="8rem" h="1.5rem" rounded="full" />}
          {!loading && (
            <>
              <Text fontWeight="bold">مبلغ قابل پرداخت:</Text>
              <Text fontWeight="bold" className="text-green-500">
                {formattedPrice} تومان
              </Text>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default PaymentDetails;
