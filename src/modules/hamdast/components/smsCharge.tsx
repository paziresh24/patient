import Button from '@/common/components/atom/button';
import Loading from '@/common/components/atom/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import ChatIcon from '@/common/components/icons/chat';
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
  currency: string;
};

type Phase = 'select' | 'paying' | 'applying';

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
  const amount = useMemo(
    () => (unitPrice > 0 && smsCount > 0 ? smsCount * unitPrice : 0),
    [smsCount, unitPrice],
  );

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
      setSmsCount(first);
      setCustomDraft(String(Math.max(first + 100, 200)));
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

  const selectPackage = (pack: number) => {
    setCustomMode(false);
    setSmsCount(pack);
  };

  const enableCustom = () => {
    setCustomMode(true);
    const next = Math.max(1, Number(customDraft) || 1);
    setSmsCount(next);
  };

  const startCheckout = async () => {
    if (smsCount < 1) {
      toast.error('تعداد پیامک معتبر نیست');
      return;
    }

    setIsSubmitting(true);
    try {
      // Server owns unit price + receipt amount — frontend only sends sms_count.
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
        {
          receipt_id,
          sms_count: pending.sms_count,
        },
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

  return (
    <>
      <Modal {...modalProps} title="شارژ پیامک" onClose={handleCancel} bodyClassName="!p-0">
        {isLoadingPricing || !pricing ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Loading />
            <Text fontSize="sm" className="text-slate-500">
              در حال بارگذاری تعرفه…
            </Text>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="bg-gradient-to-l from-primary/10 via-primary/5 to-transparent px-5 pt-5 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                  <ChatIcon width={22} height={22} />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <Text fontSize="sm" fontWeight="bold" className="text-slate-900">
                    افزایش موجودی پیامک
                  </Text>
                  <Text fontSize="sm" className="leading-6 text-slate-600">
                    بسته را انتخاب کنید یا تعداد دلخواه بسازید. تعرفه از سرور اعمال می‌شود.
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 px-5 py-4">
              <div>
                <Text fontSize="sm" className="mb-2 block text-slate-500">
                  بسته‌های پیشنهادی
                </Text>
                <div className="grid grid-cols-3 gap-2">
                  {packages.map(pack => {
                    const selected = !customMode && smsCount === pack;
                    const packAmount = pack * unitPrice;
                    return (
                      <button
                        key={pack}
                        type="button"
                        onClick={() => selectPackage(pack)}
                        className={classNames(
                          'rounded-2xl border px-2 py-3 text-center transition duration-150 ease-out active:scale-[0.97]',
                          selected
                            ? 'border-primary bg-primary text-white shadow-md shadow-primary/20'
                            : 'border-slate-200 bg-white text-slate-800 hover:border-primary/40 hover:bg-slate-50',
                        )}
                      >
                        <div className={classNames('text-base font-extrabold', selected ? 'text-white' : 'text-slate-900')}>
                          {pack.toLocaleString('fa-IR')}
                        </div>
                        <div className={classNames('mt-0.5 text-[11px]', selected ? 'text-white/85' : 'text-slate-500')}>
                          پیامک
                        </div>
                        <div className={classNames('mt-2 text-[11px] font-medium', selected ? 'text-white/90' : 'text-slate-600')}>
                          {formatToman(packAmount)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={enableCustom}
                  className={classNames(
                    'w-full rounded-2xl border px-4 py-3 text-right transition duration-150 ease-out active:scale-[0.99]',
                    customMode
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                      : 'border-dashed border-slate-300 bg-slate-50/80 hover:border-primary/40',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Text fontSize="sm" fontWeight="bold" className="text-slate-800">
                        تعداد دلخواه
                      </Text>
                      <Text fontSize="sm" className="mt-0.5 text-slate-500">
                        خودتان تعداد پیامک را تنظیم کنید
                      </Text>
                    </div>
                    <span
                      className={classNames(
                        'rounded-full px-2.5 py-1 text-[11px] font-medium',
                        customMode ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-slate-200',
                      )}
                    >
                      سفارشی
                    </span>
                  </div>
                </button>

                {customMode && (
                  <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-700 active:scale-95"
                      onClick={() => {
                        const next = Math.max(1, smsCount - 50);
                        setSmsCount(next);
                        setCustomDraft(String(next));
                      }}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      inputMode="numeric"
                      className="min-w-0 flex-1 border-0 bg-transparent text-center text-lg font-bold text-slate-900 outline-none"
                      value={customDraft}
                      onChange={e => {
                        const raw = e.target.value;
                        setCustomDraft(raw);
                        const n = Number(raw);
                        if (Number.isFinite(n) && n >= 1) setSmsCount(Math.trunc(n));
                      }}
                    />
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-700 active:scale-95"
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

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <Text fontSize="sm" className="text-slate-500">
                      مبلغ قابل پرداخت
                    </Text>
                    <Text fontSize="sm" className="mt-1 text-slate-600">
                      {smsCount.toLocaleString('fa-IR')} پیامک × {unitPrice.toLocaleString('fa-IR')} ریال
                    </Text>
                  </div>
                  <Text fontSize="lg" fontWeight="bold" className="text-slate-900">
                    {amount > 0 ? formatToman(amount) : '—'}
                  </Text>
                </div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
              <Button variant="secondary" className="flex-1" onClick={handleCancel} disabled={isSubmitting}>
                انصراف
              </Button>
              <Button className="flex-[1.4]" onClick={startCheckout} loading={isSubmitting} disabled={isSubmitting || amount <= 0}>
                ادامه و پرداخت
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {phase === 'applying' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-7 shadow-xl">
            <Loading />
            <Text fontSize="sm" className="text-slate-700">
              در حال اعمال شارژ پیامک…
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
