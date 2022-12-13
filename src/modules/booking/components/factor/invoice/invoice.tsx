import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { addCommas } from '@persian-tools/persian-tools';

interface InvoiceProps {
  price?: string;
  priceText: string;
  tax?: string;
  discount?: string;
  totalPrice?: string;
  loading: boolean;
}
export const Invoice = (props: InvoiceProps) => {
  const { price, priceText, tax, discount, totalPrice, loading = false } = props;
  const formattedPrice = price ? addCommas(Math.round(+price / 10)) : null;
  const formattedTax = tax ? addCommas(Math.round(+tax / 10)) : null;
  const formattedTotalPrice = totalPrice ? addCommas(Math.round(+totalPrice / 10)) : null;
  const formattedDiscount = discount ? addCommas(Math.round(+discount / 10)) : null;

  return (
    <div className="border border-solid rounded-lg border-slate-200">
      <div className="flex flex-col p-3 space-y-3">
        <div className="flex justify-between">
          {loading && (
            <>
              <Skeleton w="10rem" h="1.25rem" rounded="full" />
              <Skeleton w="5rem" h="1.25rem" rounded="full" />
            </>
          )}

          {!loading && (
            <>
              <Text fontWeight="medium" fontSize="sm">
                {priceText}:
              </Text>
              <Text fontWeight="medium" fontSize="sm">
                {formattedPrice} تومان
              </Text>
            </>
          )}
        </div>
        {loading && (
          <div className="flex justify-between">
            <Skeleton w="7rem" h="1.25rem" rounded="full" />
            <Skeleton w="5rem" h="1.25rem" rounded="full" />
          </div>
        )}

        {!loading && formattedTax && (
          <div className="flex justify-between">
            <Text fontWeight="medium" fontSize="sm">
              مالیات:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {formattedTax} تومان
            </Text>
          </div>
        )}
        {formattedDiscount && (
          <div className="flex justify-between text-red-500">
            <Text fontWeight="medium" fontSize="sm">
              کدتخفیف:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {formattedDiscount} تومان
            </Text>
          </div>
        )}
      </div>

      <div className="flex justify-center p-5 border-t border-dashed border-slate-200 space-s-2">
        {loading && <Skeleton w="8rem" h="1.5rem" rounded="full" />}
        {!loading && (
          <>
            <Text fontWeight="bold">مبلغ قابل پرداخت:</Text>
            <Text fontWeight="bold" className="text-green-600">
              {formattedTotalPrice} تومان
            </Text>
          </>
        )}
      </div>
    </div>
  );
};
export default Invoice;
