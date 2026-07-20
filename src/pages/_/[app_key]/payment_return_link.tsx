import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Loading from '@/common/components/atom/loading';
import Text from '@/common/components/atom/text';
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PaymentReturnLink() {
  const { query, isReady } = useRouter();
  const [showButton, setShowButton] = useState(false);
  const status = typeof query?.status === 'string' ? query.status : undefined;

  useEffect(() => {
    if (!isReady || !status) return;

    // Parent payment modals poll this cookie, then close the popup.
    setCookie('payment_state', status, { path: '/', sameSite: 'lax' });

    // Popup opened via window.open can close itself; keep a fallback button.
    const closeTimer = window.setTimeout(() => {
      window.close();
    }, 400);

    const buttonTimer = window.setTimeout(() => {
      setShowButton(true);
    }, 3000);

    return () => {
      window.clearTimeout(closeTimer);
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
            <Button size="sm" block onClick={() => window.close()}>
              پرداخت را انجام دادم
            </Button>
          ) : (
            <Button size="sm" block onClick={() => window.close()}>
              پرداخت را لغو کردم
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
