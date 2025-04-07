import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { addCommas } from '@persian-tools/persian-tools';
import { isEmpty } from 'lodash';

interface InvoiceProps {
  serviceFeeText?: string;
  serviceFee?: string;
  price?: string;
  priceText: string;
  tax?: string;
  discount?: string;
  walletAmount?: number;
  totalPrice?: string;
  loading: boolean;
}
export const Invoice = (props: InvoiceProps) => {
  const { serviceFeeText, serviceFee, price, priceText, walletAmount, tax, discount, totalPrice, loading = false } = props;
  const formattedPrice = price ? addCommas(Math.round(+price / 10)) : null;
  const formattedTax = tax ? addCommas(Math.round(+tax / 10)) : null;
  const formattedTotalPrice = totalPrice ? addCommas(Math.max(0, Math.round((+totalPrice - +(walletAmount ?? 0)) / 10))) : null;
  const formattedWalletAmount =
    (walletAmount == 0 || walletAmount) && typeof walletAmount === 'number' ? addCommas(Math.round(+walletAmount / 10)) : null;
  const formattedDiscount = discount ? addCommas(Math.round(+discount / 10)) : null;

  return (
    <div className="border border-solid rounded-lg border-slate-200">
      <div className="flex flex-col p-3 space-y-3">
        {loading && (
          <div className="flex justify-between">
            <Skeleton w="10rem" h="1.25rem" rounded="full" />
            <Skeleton w="5rem" h="1.25rem" rounded="full" />
          </div>
        )}
        {loading && (
          <div className="flex justify-between">
            <Skeleton w="7rem" h="1.25rem" rounded="full" />
            <Skeleton w="5rem" h="1.25rem" rounded="full" />
          </div>
        )}

        {!loading && !!serviceFeeText && (
          <div className="flex justify-between">
            <Text fontWeight="medium" fontSize="sm">
              {serviceFeeText}:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {serviceFee}
            </Text>
          </div>
        )}

        {!loading && (
          <div className="flex justify-between">
            <Text fontWeight="medium" fontSize="sm">
              {priceText}:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {formattedPrice} تومان
            </Text>
          </div>
        )}

        {!loading && !!formattedTax && (
          <div className="flex justify-between">
            <Text fontWeight="medium" fontSize="sm">
              مالیات:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {formattedTax} تومان
            </Text>
          </div>
        )}
        {!!formattedDiscount && (
          <div className="flex justify-between text-red-500">
            <Text fontWeight="medium" fontSize="sm">
              تخفیف:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {formattedDiscount} تومان
            </Text>
          </div>
        )}

        {!loading && !!formattedWalletAmount && (
          <div className="flex justify-between">
            <Text fontWeight="medium" fontSize="sm">
              شارژ کیف پول:
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {formattedWalletAmount} تومان
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
