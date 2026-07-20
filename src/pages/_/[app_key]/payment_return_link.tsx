import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Loading from '@/common/components/atom/loading';
import Text from '@/common/components/atom/text';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

/**
 * Gateway may append its own `status` (e.g. status=true), producing
 * `?status=success&status=true` — Next then gives query.status as string[].
 */
function resolvePaymentStatus(raw: string | string[] | undefined): 'success' | 'cancel' | undefined {
  const values = (Array.isArray(raw) ? raw : raw ? [raw] : [])
    .map(v => String(v).trim().toLowerCase())
    .filter(Boolean);

  if (values.includes('success') || values.includes('true')) return 'success';
  if (values.includes('cancel') || values.includes('false')) return 'cancel';
  return undefined;
}

function tryClosePopup() {
  try {
    window.close();
  } catch {
    // Browsers may block close; parent also polls the cookie.
  }
}

export default function PaymentReturnLink() {
  const { query, isReady } = useRouter();
  const [showButton, setShowButton] = useState(false);
  const status = useMemo(() => resolvePaymentStatus(query?.status as string | string[] | undefined), [query?.status]);

  useEffect(() => {
    if (!isReady || !status) return;

    // Parent payment modals poll this cookie, then close the popup.
    setCookie('payment_state', status, { path: '/', sameSite: 'lax' });

    tryClosePopup();
    const closeTimer = window.setTimeout(tryClosePopup, 300);
    const closeRetry = window.setTimeout(tryClosePopup, 1200);

    const buttonTimer = window.setTimeout(() => {
      setShowButton(true);
    }, 2500);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearTimeout(closeRetry);
      window.clearTimeout(buttonTimer);
    };
  }, [isReady, status]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen w-full">
      <div className="flex flex-col justify-center items-center gap-2">
        <Loading />
        <span className="text-sm font-medium">کمی منتظر بمانید</span>
      </div>
      {showButton && (
        <div className="flex flex-col gap-3 w-60">
          <Divider />
          <Text fontSize="xs" className="text-center">
            اگر هنوز منتقل نشدید، روی دکمه زیر بزنید.
          </Text>
          {status === 'success' ? (
            <Button size="sm" block onClick={tryClosePopup}>
              پرداخت را انجام دادم
            </Button>
          ) : (
            <Button size="sm" block onClick={tryClosePopup}>
              پرداخت را لغو کردم
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
