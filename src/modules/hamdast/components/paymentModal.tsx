import { splunkInstance } from '@/common/services/splunk';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect, useRef } from 'react';
import Payment from './payment';

export const HamdastPayment = ({ app_key, app_name, icon, iframeRef }: { app_key: string; app_name: string; icon?: string; iframeRef: any }) => {
  const { isLogin, info } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();
  const hashId = useRef<any>(null)
  const payment = useRef<any>(null)


  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_PAYMENT_PAY') {
        hashId.current = messageEvent.data?.hamdast?.hash_id


        if (!isLogin) {
          return handleOpenLoginModal({
            state: true,
            postLogin(userInfo) {
              return payment?.current?.open({
                product_key: messageEvent.data?.hamdast?.data?.product_key,
                payload: messageEvent.data?.hamdast?.data?.payload,
                receipt_id: messageEvent.data?.hamdast?.data?.receipt_id,
              })
            },
            onClose: () => {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_CANCEL',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_CANCEL',
                      product_key: messageEvent.data?.hamdast?.data?.product_key,
                      payload: messageEvent.data?.hamdast?.data?.payload,
                      receipt_id: messageEvent.data?.hamdast?.data?.receipt_id,
                    },
                    hash_id: hashId.current,
                  },
                },
                '*',
              );
            },
          });
        }

        payment?.current?.open({
          product_key: messageEvent.data?.hamdast?.data?.product_key,
          payload: messageEvent.data?.hamdast?.data?.payload,
          receipt_id: messageEvent.data?.hamdast?.data?.receipt_id,
        })
      }
    };
    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);






  const handlePayment = async ({ receipt_id, center_id, product_key, payload }: any) => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event: 'HAMDAST_PAYMENT_SUCCESS',
          action: 'forwardToApp',
          data: {
            event: 'HAMDAST_PAYMENT_SUCCESS',
            payload: payload,
            product_key: product_key,
            receipt_id: receipt_id,
          },
          hash_id: hashId.current,
        },
      },
      '*',
    );
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'success_receipt',
      event: {
        is_doctor: info?.is_doctor,
        user_id: info?.id,
        meta_data: {
          app_key: app_key,
          product_key: product_key,
          receipt_id: receipt_id,
          center_id: center_id
        },
      },
    });

  };

  const handleCancelPayment = ({ receipt_id, center_id, product_key, payload }: any) => {
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'cancel_receipt',
      event: {
        is_doctor: info?.is_doctor,
        user_id: info?.id,
        meta_data: {
          app_key: app_key,
          product_key: product_key,
          receipt_id: receipt_id,
          center_id: center_id
        },
      },
    });
    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event: 'HAMDAST_PAYMENT_CANCEL',
          action: 'forwardToApp',
          data: {
            event: 'HAMDAST_PAYMENT_CANCEL',
            payload: payload,
            product_key: product_key,
          },
          hash_id: hashId.current,
        },
      },
      '*',
    );
  }

  const handleError = ({ message, receipt_id, center_id, product_key }: any) => {
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'error_receipt',
      event: {
        is_doctor: info?.is_doctor,
        user_id: info?.id,
        meta_data: {
          app_key: app_key,
          product_key: product_key,
          receipt_id: receipt_id,
          message: message,
          center_id: center_id
        },
      },
    });
  }

  return (
    <Payment app_key={app_key} app_name={app_name} icon={icon} onSuccess={handlePayment} onCancel={handleCancelPayment} onError={handleError} ref={payment} />
  );
};
