import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import ChatIcon from '@/common/components/icons/chat';
import CloseIcon from '@/common/components/icons/close';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios, { isAxiosError } from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Payment from './payment';

const RASAN_APP_KEY = 'rasan';
const RASAN_PRICING_URL = 'https://hamdast.paziresh24.com/api/v1/rasan/credit/pricing';
const RASAN_PREPARE_URL = 'https://hamdast.paziresh24.com/api/v1/rasan/credit/prepare';
const RASAN_CHARGE_URL = 'https://hamdast.paziresh24.com/api/v1/rasan/credit/charge';

type ChargeEvent =
  | 'HAMDAST_RASAN_CHARGE_SUCCESS'
  | 'HAMDAST_RASAN_CHARGE_CANCEL'
  | 'HAMDAST_RASAN_CHARGE_ERROR';

type Pricing = {
  unit_price_irr: number;
  packages: number[];
  min_amount_irr?: number;
  min_sms_count?: number;
  currency: string;
};

type Phase = 'select' | 'paying' | 'applying';

/** 100 تومان = 1_000 ریال */
const DEFAULT_MIN_CHARGE_IRR = 1_000;

function formatToman(irr: number) {
  return `${Math.round(irr / 10).toLocaleString('fa-IR')} تومان`;
}

export const HamdastRasanCharge = ({ iframeRef }: { iframeRef: any }) => {
  const { isLogin } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();
  const hashId = useRef<string | number | null>(null);
  const repliedRef = useRef(false);
  const paymentRef = useRef<any>(null);
  const pendingRef = useRef<{ sms_count: number; receipt_id: string } | null>(null);

  const [phase, setPhase] = useState<Phase>('select');
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [smsCount, setSmsCount] = useState(100);
  const [customMode, setCustomMode] = useState(false);
  const [customDraft, setCustomDraft] = useState('200');
  const [isLoadingPricing, setIsLoadingPricing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleClose, handleOpen, modalProps } = useModal();

  const packages = pricing?.packages?.length ? pricing.packages : [100, 500, 1000];
  const unitPrice = pricing?.unit_price_irr ?? 0;
  const minAmountIrr = pricing?.min_amount_irr ?? DEFAULT_MIN_CHARGE_IRR;
  const minSmsCount = useMemo(() => {
    if (pricing?.min_sms_count && pricing.min_sms_count >= 1) {
      return pricing.min_sms_count;
    }
    if (unitPrice > 0) {
      return Math.max(1, Math.ceil(minAmountIrr / unitPrice));
    }
    return 1;
  }, [pricing?.min_sms_count, unitPrice, minAmountIrr]);
  const amount = useMemo(
    () => (unitPrice > 0 && smsCount > 0 ? smsCount * unitPrice : 0),
    [smsCount, unitPrice],
  );
  const canCheckout = amount >= minAmountIrr && smsCount >= minSmsCount;

  const replyToWidget = (event: ChargeEvent, data: Record<string, unknown> = {}) => {
    if (repliedRef.current) return;
    repliedRef.current = true;

    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event,
          action: 'forwardToApp',
          data: { event, ...data },
          hash_id: hashId.current,
        },
      },
      '*',
    );
  };

  const closeAll = () => {
    handleClose();
    setPhase('select');
    setIsSubmitting(false);
    pendingRef.current = null;
  };

  const handleCancel = () => {
    replyToWidget('HAMDAST_RASAN_CHARGE_CANCEL');
    closeAll();
  };

  const loadPricingAndOpen = async () => {
    repliedRef.current = false;
    setCustomMode(false);
    setIsLoadingPricing(true);
    setPhase('select');
    handleOpen();

    try {
      const { data } = await axios.get<Pricing>(RASAN_PRICING_URL, { withCredentials: true });
      setPricing(data);
      const first = data.packages?.[0] ?? 100;
      const minCount =
        data.min_sms_count && data.min_sms_count >= 1
          ? data.min_sms_count
          : Math.max(
              1,
              Math.ceil((data.min_amount_irr ?? DEFAULT_MIN_CHARGE_IRR) / (data.unit_price_irr || 1)),
            );
      setSmsCount(Math.max(first, minCount));
      setCustomDraft(String(Math.max(first + 100, minCount, 200)));
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'خطا در دریافت تعرفه پیامک'
        : 'خطا در دریافت تعرفه پیامک';
      toast.error(message);
      replyToWidget('HAMDAST_RASAN_CHARGE_ERROR', { message });
      closeAll();
    } finally {
      setIsLoadingPricing(false);
    }
  };

  useEffect(() => {
    const onMessage = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event !== 'HAMDAST_RASAN_CHARGE') return;

      hashId.current = messageEvent.data?.hamdast?.hash_id;

      if (!isLogin) {
        return handleOpenLoginModal({
          state: true,
          postLogin() {
            void loadPricingAndOpen();
          },
          onClose: () => replyToWidget('HAMDAST_RASAN_CHARGE_CANCEL'),
        });
      }

      void loadPricingAndOpen();
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isLogin]);

  const startCheckout = async () => {
    if (smsCount < 1) {
      toast.error('تعداد پیامک معتبر نیست');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await axios.post(
        RASAN_PREPARE_URL,
        { sms_count: smsCount },
        { withCredentials: true },
      );

      const receipt_id = data?.receipt_id as string;
      if (!receipt_id) throw new Error('missing_receipt_id');

      pendingRef.current = { sms_count: data.sms_count ?? smsCount, receipt_id };
      setPhase('paying');
      handleClose();
      paymentRef.current?.open({ receipt_id });
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'خطا در آماده‌سازی شارژ'
        : 'خطا در آماده‌سازی شارژ';
      toast.error(message);
      replyToWidget('HAMDAST_RASAN_CHARGE_ERROR', { message });
      closeAll();
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyCredit = async (receipt_id: string) => {
    const pending = pendingRef.current;
    if (!pending) {
      replyToWidget('HAMDAST_RASAN_CHARGE_ERROR', { message: 'missing_charge_context' });
      return;
    }

    setPhase('applying');
    try {
      const { data } = await axios.post(
        RASAN_CHARGE_URL,
        { receipt_id, sms_count: pending.sms_count },
        { withCredentials: true },
      );

      toast.success('موجودی پیامک شارژ شد');
      replyToWidget('HAMDAST_RASAN_CHARGE_SUCCESS', {
        credit: data?.credit,
        sms_count: data?.sms_count ?? pending.sms_count,
        amount: data?.amount,
        receipt_id,
      });
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.error?.message ||
          error.response?.data?.message ||
          'پرداخت موفق بود ولی شارژ پیامک انجام نشد. با پشتیبانی تماس بگیرید.'
        : 'پرداخت موفق بود ولی شارژ پیامک انجام نشد. با پشتیبانی تماس بگیرید.';
      toast.error(message);
      replyToWidget('HAMDAST_RASAN_CHARGE_ERROR', { message, receipt_id });
    } finally {
      closeAll();
    }
  };

  const busy = isLoadingPricing || isSubmitting;

  return (
    <>
      <Modal
        {...modalProps}
        onClose={() => {
          if (busy) return;
          handleCancel();
        }}
        noHeader
        noLine
        bodyClassName="!p-0 overflow-hidden"
        className="md:!w-[22rem]"
      >
        {isLoadingPricing || !pricing ? (
          <div className="flex flex-col items-center justify-center px-6 py-14">
            <Loading />
          </div>
        ) : (
          <div className="relative flex flex-col px-5 pt-7 pb-5">
            <CloseIcon
              className="absolute top-3.5 left-3.5 h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-slate-600 active:scale-[0.97]"
              onClick={() => !busy && handleCancel()}
            />

            <div className="mb-4 flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ChatIcon className="h-6 w-6" />
              </div>
              <Text as="p" fontWeight="bold" fontSize="lg" className="text-slate-900">
                شارژ پیامک
              </Text>
              <Text as="p" fontSize="sm" className="mt-1.5 max-w-[17rem] leading-6 text-slate-500">
                تعداد پیامک مورد نیاز را انتخاب کنید.
              </Text>
            </div>

            <div className="flex flex-col gap-2">
              {packages.map(pack => {
                const selected = !customMode && smsCount === pack;
                return (
                  <button
                    key={pack}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setCustomMode(false);
                      setSmsCount(pack);
                    }}
                    className={classNames(
                      'flex w-full items-center justify-between rounded-xl border px-3.5 py-3 text-right transition duration-150 ease-out active:scale-[0.99]',
                      selected
                        ? 'border-primary bg-primary/5 ring-1 ring-primary/25'
                        : 'border-slate-200 bg-white hover:border-slate-300',
                    )}
                  >
                    <Text as="span" fontSize="sm" fontWeight="bold" className="text-slate-900">
                      {pack.toLocaleString('fa-IR')} پیامک
                    </Text>
                    <Text as="span" fontSize="sm" className={selected ? 'font-semibold text-primary' : 'text-slate-600'}>
                      {formatToman(pack * unitPrice)}
                    </Text>
                  </button>
                );
              })}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setCustomMode(true);
                  const next = Math.max(minSmsCount, Number(customDraft) || minSmsCount);
                  setSmsCount(next);
                  setCustomDraft(String(next));
                }}
                className={classNames(
                  'w-full rounded-xl border px-3.5 py-3 text-right transition duration-150 ease-out active:scale-[0.99]',
                  customMode
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/25'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:border-slate-400',
                )}
              >
                <Text as="p" fontSize="sm" fontWeight="bold" className="text-slate-900">
                  تعداد دلخواه
                </Text>
              </button>

              {customMode && (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg font-bold text-slate-700 active:scale-95"
                    onClick={() => {
                      const next = Math.max(minSmsCount, smsCount - 50);
                      setSmsCount(next);
                      setCustomDraft(String(next));
                    }}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={minSmsCount}
                    inputMode="numeric"
                    className="min-w-0 flex-1 border-0 bg-transparent text-center text-base font-bold text-slate-900 outline-none"
                    value={customDraft}
                    onChange={e => {
                      const raw = e.target.value;
                      setCustomDraft(raw);
                      const n = Number(raw);
                      if (Number.isFinite(n) && n >= minSmsCount) setSmsCount(Math.trunc(n));
                    }}
                    onBlur={() => {
                      const next = Math.max(
                        minSmsCount,
                        Math.trunc(Number(customDraft)) || minSmsCount,
                      );
                      setSmsCount(next);
                      setCustomDraft(String(next));
                    }}
                  />
                  <button
                    type="button"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg font-bold text-slate-700 active:scale-95"
                    onClick={() => {
                      const next = smsCount + 50;
                      setSmsCount(next);
                      setCustomDraft(String(next));
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3">
              <Text as="span" fontSize="sm" className="text-slate-500">
                مبلغ قابل پرداخت
              </Text>
              <Text as="span" fontSize="sm" fontWeight="bold" className="text-slate-900">
                {amount > 0 ? formatToman(amount) : '—'}
              </Text>
            </div>

            <div className="mt-5 flex w-full flex-col gap-1.5">
              <Button
                className="w-full"
                onClick={startCheckout}
                loading={isSubmitting}
                disabled={isSubmitting || !canCheckout}
              >
                ادامه و پرداخت
              </Button>
              {!canCheckout && amount > 0 && amount < minAmountIrr && (
                <Text as="p" fontSize="xs" className="text-center text-amber-700">
                  حداقل مبلغ شارژ ۱۰۰ تومان است.
                </Text>
              )}
              <Button
                variant="text"
                className="w-full !text-slate-500 hover:!text-slate-700"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                انصراف
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {phase === 'applying' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-7 shadow-xl">
            <Loading />
            <Text as="p" fontSize="sm" className="text-slate-600">
              در حال اعمال شارژ…
            </Text>
          </div>
        </div>
      )}

      <Payment
        app_key={RASAN_APP_KEY}
        app_name="رسان"
        ref={paymentRef}
        onSuccess={({ receipt_id }) => {
          void applyCredit(receipt_id);
        }}
        onCancel={() => {
          replyToWidget('HAMDAST_RASAN_CHARGE_CANCEL');
          closeAll();
        }}
        onError={({ message }) => {
          toast.error(message || 'خطا در پرداخت');
          replyToWidget('HAMDAST_RASAN_CHARGE_ERROR', { message });
          closeAll();
        }}
      />
    </>
  );
};
