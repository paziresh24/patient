import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Loading from '@/common/components/atom/loading';
import Text from '@/common/components/atom/text';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';

export const PAYMENT_STATE_COOKIE = 'payment_state';
export const PAYMENT_STATE_STORAGE_KEY = 'hamdast_payment_state';
export const PAYMENT_STATE_MESSAGE = 'hamdast_payment_state';

/**
 * Gateway may rewrite/append `status` (e.g. status=true), or strip our query.
 * Prefer hamdast_status (stable), then common gateway keys.
 */
function resolvePaymentStatus(query: Record<string, unknown>): 'success' | 'cancel' | undefined {
  const rawCandidates = [
    query.hamdast_status,
    query.status,
    query.Status,
    query.payment_status,
    query.result,
    query.Result,
    query.state,
    query.State,
  ];

  const values = rawCandidates
    .flatMap(raw => (Array.isArray(raw) ? raw : raw != null ? [raw] : []))
    .map(v => String(v).trim().toLowerCase())
    .filter(Boolean);

  if (
    values.some(
      v =>
        v.includes('success') ||
        v === 'true' ||
        v === 'ok' ||
        v === 'paid' ||
        v === '1' ||
        v === 'done' ||
        v === 'complete' ||
        v === 'completed',
    )
  ) {
    return 'success';
  }

  if (
    values.some(
      v =>
        v.includes('cancel') ||
        v === 'false' ||
        v === 'failed' ||
        v === 'fail' ||
        v === '0' ||
        v.includes('error'),
    )
  ) {
    return 'cancel';
  }

  // Hash fallback: /payment_return_link/#success
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#/, '').toLowerCase();
    if (hash.includes('success') || hash === 'true' || hash === 'ok') return 'success';
    if (hash.includes('cancel') || hash === 'false' || hash.includes('fail')) return 'cancel';
  }

  return undefined;
}

function persistAndNotify(status: 'success' | 'cancel') {
  setCookie(PAYMENT_STATE_COOKIE, status, { path: '/', sameSite: 'lax' });

  try {
    localStorage.setItem(
      PAYMENT_STATE_STORAGE_KEY,
      JSON.stringify({ status, at: Date.now() }),
    );
  } catch {
    // private mode / blocked storage
  }

  try {
    window.opener?.postMessage({ type: PAYMENT_STATE_MESSAGE, status }, '*');
  } catch {
    // opener may be cross-origin or closed
  }
}

function tryClosePopup() {
  try {
    window.close();
  } catch {
    // Browsers may block close; parent also polls storage/cookie.
  }
}

export default function PaymentReturnLink() {
  const { query, isReady } = useRouter();
  const [showButton, setShowButton] = useState(false);
  const status = useMemo(
    () => (isReady ? resolvePaymentStatus(query as Record<string, unknown>) : undefined),
    [isReady, query],
  );

  useEffect(() => {
    if (!isReady) return;

    if (status) {
      persistAndNotify(status);
      tryClosePopup();
      const closeTimer = window.setTimeout(tryClosePopup, 300);
      const closeRetry = window.setTimeout(tryClosePopup, 1200);
      const notifyRetry = window.setTimeout(() => persistAndNotify(status), 200);
      const buttonTimer = window.setTimeout(() => setShowButton(true), 2500);

      return () => {
        window.clearTimeout(closeTimer);
        window.clearTimeout(closeRetry);
        window.clearTimeout(notifyRetry);
        window.clearTimeout(buttonTimer);
      };
    }

    // Unknown status from gateway — still let user confirm manually.
    const buttonTimer = window.setTimeout(() => setShowButton(true), 1500);
    return () => window.clearTimeout(buttonTimer);
  }, [isReady, status]);

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-screen w-full">
      <div className="flex flex-col justify-center items-center gap-2">
        <Loading />
        <span className="text-sm font-medium">کمی منتظر بمانید</span>
        {!status && showButton && (
          <Text fontSize="xs" className="text-center text-slate-500 max-w-xs">
            وضعیت پرداخت از درگاه مشخص نشد. نتیجه را دستی انتخاب کنید.
          </Text>
        )}
      </div>
      {showButton && (
        <div className="flex flex-col gap-3 w-60">
          <Divider />
          <Text fontSize="xs" className="text-center">
            اگر هنوز منتقل نشدید، روی دکمه زیر بزنید.
          </Text>
          <Button
            size="sm"
            block
            onClick={() => {
              persistAndNotify('success');
              tryClosePopup();
            }}
          >
            پرداخت را انجام دادم
          </Button>
          <Button
            size="sm"
            block
            variant="text"
            onClick={() => {
              persistAndNotify('cancel');
              tryClosePopup();
            }}
          >
            پرداخت را لغو کردم
          </Button>
        </div>
      )}
    </div>
  );
}
