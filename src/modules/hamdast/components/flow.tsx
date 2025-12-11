import Loading from '@/common/components/atom/loading';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const HamdastFlow = ({ iframeRef }: { iframeRef: any }) => {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_FLOW') {
        console.log('HAMDAST_FLOW', messageEvent.data?.hamdast);

        const flowKey = messageEvent.data?.hamdast?.data?.flow_key;
        const { medical_center_id, appointment_id } = router.query;

        // بررسی وجود پارامترهای لازم در URL
        if (!medical_center_id || !appointment_id) {
          return;
        }

        // بررسی flowKey و هدایت کاربر
        if (flowKey === 'BOOKING.RECEIPT') {
          setIsRedirecting(true);
          router.replace(`/receipt/${medical_center_id}/${appointment_id}/`);
        } else if (flowKey === 'BOOKING.ONLINE_VISIT_CHANNEL') {
          setIsRedirecting(true);
          router.replace(`/receipt/${medical_center_id}/${appointment_id}/?action=open_channel`);
        }
      }
    };

    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [router, iframeRef]);

  // نمایش لودینگ هنگام هدایت
  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <Loading />
      </div>
    );
  }

  return null;
};
