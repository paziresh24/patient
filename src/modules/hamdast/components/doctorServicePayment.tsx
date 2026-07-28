import { splunkInstance } from '@/common/services/splunk';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect, useRef } from 'react';
import DoctorServicePaymentModal from './doctorServicePaymentModal';
import { getProfileDoctorInfo, getProfileWidgetName, resolveProviderUserId } from '../stores/profileDoctorInfo';

export const HamdastDoctorServicePayment = ({
  app_key,
  app_name,
  iframeRef,
}: {
  app_key: string;
  app_name: string;
  icon?: string;
  iframeRef: any;
}) => {
  const { isLogin } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();
  const hashId = useRef<any>(null);
  const payment = useRef<any>(null);

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_PAYMENT_DOCTOR_SERVICE_PAY') {
        hashId.current = messageEvent.data?.hamdast?.hash_id;

        const eventData = messageEvent.data?.hamdast?.data || {};
        const profileDoctor = getProfileDoctorInfo();
        const doctorUserId = resolveProviderUserId(eventData);
        const doctorName = eventData.doctor_name || profileDoctor?.displayName || '';
        const doctorImage = eventData.doctor_image || profileDoctor?.imageUrl || '';
        const widgetName = eventData.widget_name || getProfileWidgetName() || '';

        const openPayload = {
          amount: eventData.amount,
          doctor_user_id: doctorUserId,
          doctor_name: doctorName,
          doctor_image: doctorImage,
          widget_name: widgetName,
          payload: eventData.payload,
        };

        if (!doctorUserId) {
          console.error('[hamdast] doctor-service pay missing provider_user_id', {
            eventData,
            profileDoctor,
            windowDoctor: typeof window !== 'undefined' ? (window as any).doctor : null,
          });
        }

        if (!isLogin) {
          return handleOpenLoginModal({
            state: true,
            postLogin() {
              return payment?.current?.open(openPayload);
            },
            onClose: () => {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_CANCEL',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_CANCEL',
                    },
                    hash_id: hashId.current,
                  },
                },
                '*',
              );
            },
          });
        }

        payment?.current?.open(openPayload);
      }
    };
    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  const handlePayment = async ({ receipt_id, center_id }: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_SUCCESS',
          action: 'forwardToApp',
          data: {
            event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_SUCCESS',
            receipt_id: receipt_id,
          },
          hash_id: hashId.current,
        },
      },
      '*',
    );
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'success_doctor_service',
      event: {
        meta_data: {
          app_key: app_key,
          receipt_id: receipt_id,
          center_id: center_id,
        },
      },
    });
  };

  const handleCancelPayment = ({ receipt_id, center_id }: any) => {
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'cancel_doctor_service',
      event: {
        meta_data: {
          app_key: app_key,
          receipt_id: receipt_id,
          center_id: center_id,
        },
      },
    });
    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_CANCEL',
          action: 'forwardToApp',
          data: {
            event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_CANCEL',
          },
          hash_id: hashId.current,
        },
      },
      '*',
    );
  };

  const handleError = ({ message, receipt_id, center_id }: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_ERROR',
          action: 'forwardToApp',
          data: {
            event: 'HAMDAST_PAYMENT_DOCTOR_SERVICE_ERROR',
            receipt_id,
            message,
          },
          hash_id: hashId.current,
        },
      },
      '*',
    );
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'error_doctor_service',
      event: {
        meta_data: {
          app_key: app_key,
          receipt_id: receipt_id,
          message: message,
          center_id: center_id,
        },
      },
    });
  };

  return (
    <DoctorServicePaymentModal
      app_key={app_key}
      app_name={app_name}
      onSuccess={handlePayment}
      onCancel={handleCancelPayment}
      onError={handleError}
      ref={payment}
    />
  );
};
