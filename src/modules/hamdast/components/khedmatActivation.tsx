import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import Card from '.plasmic/Card';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HamdastSubscriptionPayment, HamdastSubscriptionPaymentRef } from './subscription-payment';

// کارت فعال‌سازی «خدمات و تعرفه‌ها» برای وقتی که ویجت برای بیماران خاموش است.
// فقط خود پزشک آن را می‌بیند (والد این را چک می‌کند) و پرداخت همین‌جا روی پروفایل انجام می‌شود.
// بعد از پرداخت موفق پزشک به پنل ابزارک فرستاده می‌شود، چون دسترسی ابزارک فقط با ورود خود پزشک
// به ابزارک صادر می‌شود.

const APP_KEY = 'khedmat';
const APP_NAME = 'خدمات و تعرفه‌ها';
const LOG_URL = 'https://n8n.hosseinzr.ir/webhook/log-webhook';
const SERVICES_URL = 'https://n8n.hosseinzr.ir/webhook/servises';
// خدمات را فقط با user_id برمی‌گرداند؛ ردیف‌های پزشکی که هرگز نخریده center_id ندارند و
// `/servises` برایشان خالی است. تا وقتی این endpoint ساخته نشده، به `/servises` برمی‌گردیم.
const OWNER_PREVIEW_URL = 'https://n8n.hosseinzr.ir/webhook/servises-owner-preview';
const LAUNCHER_URL = 'https://www.paziresh24.com/_/khedmat/launcher/?direct=true';
// لانچر پارامترهای اضافه را به خود ابزارک می‌دهد؛ ابزارک با after_pay صفحه‌ی «پرداخت موفق» را نشان می‌دهد.
const AFTER_PAY_URL = `${LAUNCHER_URL}&after_pay=1`;
const REDIRECT_SECONDS = 3;
const HAMDAST_BILLING = `https://hamdast.paziresh24.com/api/v1/apps/${APP_KEY}/billing`;

type Duration = 'monthly' | 'quarterly';
// فقط یک پلن برای هر مدت فروخته می‌شود (پلن کامل)؛ انتخاب جداگانه‌ای در پاپ‌آپ نیست.
const PLAN_KEYS: Record<Duration, string> = {
  monthly: 'hydwltqmnkhz1qq',
  quarterly: '13ybb2fnk281zis',
};
// به تومان؛ اگر دریافت پلن‌ها از همدست شکست بخورد همین‌ها نمایش داده می‌شوند.
const FALLBACK_PRICES: Record<string, number> = {
  hydwltqmnkhz1qq: 387000,
  '13ybb2fnk281zis': 895000,
};


const toFa = (n: number) => Number(n).toLocaleString('fa-IR');

const formatPrice = (item: any) => {
  const min = Number(item.price_min).toLocaleString('en-US');
  return item.price_max == null || item.price_max === '' ? min : `${min} تا ${Number(item.price_max).toLocaleString('en-US')}`;
};

const fetchServices = async (userId: string, centerId?: string) => {
  try {
    const { data } = await axios.get(OWNER_PREVIEW_URL, { params: { user_id: userId } });
    if (Array.isArray(data) && data.length) return data;
  } catch {}
  if (!centerId) return [];
  try {
    const { data } = await axios.get(SERVICES_URL, { params: { center_id: centerId, user_id: userId } });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4 4L19 7" />
  </svg>
);


interface KhedmatActivationProps {
  profileData: Record<string, any>;
  centerId?: string;
  /** خدماتی که والد از قبل دارد؛ اگر نباشد خودش می‌گیرد. */
  services?: any[];
}

export const KhedmatActivation = ({ profileData, centerId, services: givenServices }: KhedmatActivationProps) => {
  const userInfo = useUserInfoStore(state => state.info);
  const userId = String(profileData?.user_id ?? '');
  const [services, setServices] = useState<any[] | null>(givenServices?.length ? givenServices : null);
  // null = هنوز معلوم نیست؛ پزشکی که اشتراک فعال دارد این کارت را نمی‌بیند.
  const [subscription, setSubscription] = useState<{ active: boolean; hadBefore: boolean } | null>(null);
  const [prices, setPrices] = useState<Record<string, number>>(FALLBACK_PRICES);
  const [duration, setDuration] = useState<Duration>('monthly');
  const [paymentMounted, setPaymentMounted] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [activated, setActivated] = useState(false);
  // null = انتقالی در کار نیست؛ عدد = ثانیه‌های مانده تا انتقال به پنل ابزارک
  const [redirectIn, setRedirectIn] = useState<number | null>(null);
  const paymentRef = useRef<HamdastSubscriptionPaymentRef>(null);
  const noIframe = useRef(null);
  const viewLogged = useRef(false);
  const planSheet = useModal();
  const successSheet = useModal();

  const variant: 'never_paid' | 'expired' = subscription?.hadBefore ? 'expired' : 'never_paid';
  const planKey = PLAN_KEYS[duration];

  const log = (event_group: string, detail?: string) => {
    try {
      fetch(LOG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          event_group,
          doctor_user_id: profileData?.user_id,
          doctor_slug: profileData?.seo?.slug,
          user_id: userInfo?.id,
          terminal_id: getCookie('terminal_id'),
          // ستون service در جدول لاگ از فیلد «sevice» (با همین املا) پر می‌شود.
          sevice: detail,
        }),
      }).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    if (!givenServices?.length) {
      fetchServices(userId, centerId).then(list => {
        if (!cancelled) setServices(list);
      });
    }
    axios
      .get(`${HAMDAST_BILLING}/subscriptions`, { withCredentials: true })
      .then(({ data }) => {
        if (cancelled) return;
        setSubscription({ active: !!data?.has_active_subscription, hadBefore: (data?.history ?? []).length > 0 });
      })
      .catch(() => !cancelled && setSubscription({ active: false, hadBefore: false }));
    axios
      .get(`${HAMDAST_BILLING}/plans/`, { withCredentials: true })
      .then(({ data }) => {
        if (cancelled) return;
        const fromHamdast: Record<string, number> = {};
        for (const plan of data?.items ?? []) {
          // همدست مبلغ را به ریال می‌دهد
          if (plan?.amount) fromHamdast[plan.key || plan.id] = plan.amount / 10;
        }
        setPrices(prev => ({ ...prev, ...fromHamdast }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, centerId]);

  const sortedServices = useMemo(
    () => [...(services ?? [])].sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)),
    [services],
  );

  const visible = !!subscription && !subscription.active && !activated && sortedServices.length > 0;

  useEffect(() => {
    if (visible && !viewLogged.current) {
      viewLogged.current = true;
      log('khedmat_activation_view', variant);
    }
  }, [visible]);

  const openPlanSheet = () => {
    log('khedmat_click_activation', variant);
    setPaymentMounted(true);
    planSheet.handleOpen();
  };

  const openEditor = (from: string) => {
    log('khedmat_activation_edit', from);
    window.open(LAUNCHER_URL, '_blank');
  };

  const pay = async () => {
    log('khedmat_activation_pay', planKey);
    setIsPaying(true);
    planSheet.handleClose();
    try {
      const result = await paymentRef.current?.open(planKey);
      if (result?.success) {
        log('khedmat_activation_paid', planKey);
        setActivated(true);
        successSheet.handleOpen();
        setRedirectIn(REDIRECT_SECONDS);
      }
    } finally {
      setIsPaying(false);
    }
  };

  const goToPanel = () => {
    window.location.href = AFTER_PAY_URL;
  };

  useEffect(() => {
    if (redirectIn === null) return;
    if (redirectIn <= 0) {
      goToPanel();
      return;
    }
    const timer = setTimeout(() => setRedirectIn(redirectIn - 1), 1000);
    return () => clearTimeout(timer);
  }, [redirectIn]);

  const priceOf = (d: Duration) => prices[PLAN_KEYS[d]];

  const buttonText = variant === 'expired' ? 'برای فعال‌سازی دوباره کلیک کنید' : 'برای فعال‌سازی کلیک کنید';

  return (
    <>
      {visible && (
        // طرح اصلی: خدمات واقعی پزشک سیاه‌وسفید و قابل اسکرول، با دکمه‌ی فعال‌سازی شناور وسطشان.
        // کلیک روی دکمه پاپ‌آپ انتخاب پلن را باز می‌کند و پرداخت همین‌جا روی پروفایل انجام می‌شود.
        <div dir="rtl" className="relative w-full my-2">
          <div style={{ filter: 'grayscale(100%)' }}>
            <div className="flex gap-[7px] w-full overflow-x-auto items-stretch py-1">
              {sortedServices.map((item, index) => (
                <div key={item.id ?? index} className="w-[220px] min-w-[220px] shrink-0 pointer-events-none" aria-hidden="true">
                  <Card
                    tiile={item.service}
                    priceMin={formatPrice(item)}
                    attributes={item.attributes}
                    // «SUPPORT» نشانه‌ی «عکس توسط پشتیبانی» است، نه آدرس عکس
                    imageLink={typeof item.image_link === 'string' && item.image_link.startsWith('http') ? item.image_link : undefined}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* دکمه‌ی شناور؛ لایه‌اش pointer-events ندارد تا اسکرول به کارت‌های زیر برسد */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={openPlanSheet}
              disabled={isPaying}
              className="pointer-events-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#00966d] hover:bg-[#007f5c] text-white text-[15px] font-bold rounded-full border-[3px] border-white shadow-[0_8px_24px_-2px_rgba(0,0,0,0.3),0_4px_12px_-2px_rgba(0,150,109,0.4)] transition-all duration-200 hover:scale-105 active:scale-95 select-none disabled:opacity-70"
            >
              <CheckIcon className="w-[18px] h-[18px] shrink-0" />
              <span>{buttonText}</span>
            </button>
          </div>
        </div>
      )}

      <Modal noHeader {...planSheet.modalProps}>
        <div dir="rtl" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-extrabold text-lg">نمایش خدمات به بیماران</span>
            <span className="text-sm text-slate-600 leading-7">بعد از پرداخت، خدماتی که ثبت کرده‌اید در پروفایلتان به بیماران نمایش داده می‌شود.</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-bold text-slate-700">مدت اشتراک</span>
            <div className="grid grid-cols-2 gap-2.5">
              {(['monthly', 'quarterly'] as Duration[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={classNames('flex flex-col items-center gap-1 py-3.5 px-2 rounded-xl border-2 min-h-[72px]', {
                    'border-primary bg-primary/5': duration === d,
                    'border-slate-200 bg-white': duration !== d,
                  })}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="font-extrabold">{d === 'monthly' ? '۱ ماهه' : '۳ ماهه'}</span>
                    {d === 'quarterly' && <span className="bg-red-100 text-red-700 text-[10px] font-extrabold rounded-full px-2 py-0.5">۲۰٪ تخفیف</span>}
                  </span>
                  <span className="text-sm text-slate-700">{toFa(priceOf(d))} تومان</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 font-medium">مبلغ قابل پرداخت</span>
            <span className="text-xl font-extrabold text-primary">{toFa(prices[planKey])} تومان</span>
          </div>

          <Button block onClick={pay} loading={isPaying} className="!font-extrabold">
            پرداخت و نمایش خدمات
          </Button>
          <button type="button" onClick={() => openEditor('plan_sheet')} className="text-sm font-medium text-primary py-1">
            اول خدماتم را ویرایش می‌کنم
          </button>
        </div>
      </Modal>

      <Modal noHeader {...successSheet.modalProps}>
        <div dir="rtl" className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckIcon className="text-green-700 w-8 h-8" />
          </div>
          <span className="font-extrabold text-lg">پرداخت شما با موفقیت انجام شد</span>
          <span className="text-sm text-slate-600 leading-7">
            خدمات شما فعال شد. برای تکمیل فعال‌سازی، تا {toFa(Math.max(redirectIn ?? 0, 0))} ثانیه‌ی دیگر به پنل خدمات و تعرفه‌ها منتقل می‌شوید.
          </span>
          <Button block onClick={goToPanel} className="!font-extrabold">
            ادامه
          </Button>
        </div>
      </Modal>

      {/* فقط بعد از کلیک پزشک mount می‌شود؛ این کامپوننت به پیام‌های پرداخت همه‌ی iframeهای صفحه گوش می‌دهد
          و نباید روی پروفایل همیشه روشن باشد. */}
      {paymentMounted && <HamdastSubscriptionPayment ref={paymentRef} app_key={APP_KEY} app_name={APP_NAME} icon="" iframeRef={noIframe} />}
    </>
  );
};

export default KhedmatActivation;
