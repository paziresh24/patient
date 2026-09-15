import Accordion from '@/common/components/atom/accordion';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text';
import { addCommas } from '@persian-tools/persian-tools';
import { ExtraWalletTopupEditor, openExtraWalletTopupAmount } from '../extraWalletTopup';

interface InvoiceProps {
  serviceFeeText?: string;
  serviceFee?: string;
  price?: string;
  priceText: string;
  tax?: string;
  discount?: string;
  walletAmount?: number;
  totalPrice?: string;
  /** Extra wallet top-up in rial — when set, payable = invoice + extra (no partial-wallet subtract). */
  extraWalletTopupRial?: number;
  showExtraWalletTopup?: boolean;
  extraWalletTopupEnabled?: boolean;
  extraWalletTopupToman?: number;
  onExtraWalletTopupEnabledChange?: (enabled: boolean) => void;
  onExtraWalletTopupTomanChange?: (toman: number) => void;
  loading: boolean;
  payment_description_html?: string;
}
export const Invoice = (props: InvoiceProps) => {
  const {
    serviceFeeText,
    serviceFee,
    price,
    priceText,
    walletAmount,
    tax,
    discount,
    totalPrice,
    extraWalletTopupRial = 0,
    showExtraWalletTopup = false,
    extraWalletTopupEnabled = false,
    extraWalletTopupToman = 0,
    onExtraWalletTopupEnabledChange,
    onExtraWalletTopupTomanChange,
    loading = false,
    payment_description_html,
  } = props;
  const formattedPrice = price ? addCommas(Math.round(+price / 10)) : null;
  const formattedTax = tax ? addCommas(Math.round(+tax / 10)) : null;
  // مبلغ قابل پرداخت:
  // - شارژ اضافه: کل فاکتور + extra (مسیر _topups؛ کیف کسر نمی‌شود)
  // - موجودی جزئی (۰ < کیف < مبلغ): ماندهٔ درگاه = فاکتور − کیف (مورد ۲ هنوز انتخاب جایگزین ندارد)
  // - کیف کافی یا صفر: همان مبلغ فاکتور (بعد از تخفیف) — وقتی کافی است صفر نشان نده
  const totalPriceRial = totalPrice != null && totalPrice !== '' ? Number(totalPrice) : NaN;
  const walletRial = typeof walletAmount === 'number' && !Number.isNaN(walletAmount) ? walletAmount : 0;
  const extraRial = Math.max(0, Math.floor(Number(extraWalletTopupRial) || 0));
  // While extra box is open, payable = invoice + extra (live); don't fall back to partial-wallet subtract
  const payableRial = Number.isFinite(totalPriceRial)
    ? extraWalletTopupEnabled || extraRial > 0
      ? Math.max(0, totalPriceRial) + extraRial
      : walletRial > 0 && walletRial < totalPriceRial
        ? Math.max(0, totalPriceRial - walletRial)
        : Math.max(0, totalPriceRial)
    : NaN;
  const formattedTotalPrice = Number.isFinite(payableRial) ? addCommas(Math.round(payableRial / 10)) : null;
  const formattedWalletAmount =
    (walletAmount == 0 || walletAmount) && typeof walletAmount === 'number' ? addCommas(Math.round(+walletAmount / 10)) : null;
  const formattedDiscount = discount ? addCommas(Math.round(+discount / 10)) : null;
  const showWalletRow = !!formattedWalletAmount || showExtraWalletTopup;
  const visitTotalToman = Number.isFinite(totalPriceRial) ? Math.round(totalPriceRial / 10) : 0;

  return (
    <div className="border border-solid rounded-lg border-slate-200">
      <Accordion title="اطلاعات پرداخت" className="bg-white p-0" isOpen={!!(walletAmount && walletAmount > 0)}>
        <div className="flex flex-col space-y-3">
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

          {!loading && showWalletRow && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <Text fontWeight="medium" fontSize="sm">
                  موجودی کیف پول:
                </Text>
                <div className="flex items-center gap-1.5">
                  <Text fontWeight="medium" fontSize="sm">
                    {formattedWalletAmount ?? '۰'} تومان
                  </Text>
                  {showExtraWalletTopup && onExtraWalletTopupEnabledChange && onExtraWalletTopupTomanChange && (
                    <button
                      type="button"
                      aria-label={extraWalletTopupEnabled ? 'بستن شارژ اضافه' : 'افزودن شارژ به کیف پول'}
                      title={extraWalletTopupEnabled ? 'بستن شارژ اضافه' : 'افزودن شارژ به کیف پول'}
                      onClick={() => {
                        if (extraWalletTopupEnabled) {
                          // Keep last amount so reopen restores it
                          onExtraWalletTopupEnabledChange(false);
                          return;
                        }
                        onExtraWalletTopupTomanChange(
                          openExtraWalletTopupAmount(extraWalletTopupToman, visitTotalToman),
                        );
                        onExtraWalletTopupEnabledChange(true);
                      }}
                      className="shrink-0 px-0.5 text-lg font-bold leading-none text-primary hover:opacity-80"
                    >
                      {extraWalletTopupEnabled ? '−' : '+'}
                    </button>
                  )}
                </div>
              </div>
              {showExtraWalletTopup && onExtraWalletTopupEnabledChange && onExtraWalletTopupTomanChange && (
                <ExtraWalletTopupEditor
                  enabled={extraWalletTopupEnabled}
                  selectedToman={extraWalletTopupToman}
                  onEnabledChange={onExtraWalletTopupEnabledChange}
                  onSelectedTomanChange={onExtraWalletTopupTomanChange}
                />
              )}
            </div>
          )}
        </div>
      </Accordion>

      <div className="flex justify-center p-5 border-t border-dashed border-slate-200 space-s-2">
        {loading && <Skeleton w="8rem" h="1.5rem" rounded="full" />}
        {!loading && (
          <>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Text fontWeight="bold">مبلغ قابل پرداخت:</Text>
                <Text fontWeight="bold" className="text-green-600">
                  {formattedTotalPrice} تومان
                </Text>
              </div>
              <div dangerouslySetInnerHTML={{ __html: payment_description_html || '' }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Invoice;
