import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useEffectOnce } from 'react-use';

export const HamdastPayment = ({ app_key, iframeRef }: { app_key: string; iframeRef: any }) => {
  const { handleClose, handleOpen, modalProps } = useModal({
    onClose: () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_PAYMENT_CANCEL',
            action: 'forwardToApp',
            data: {
              event: 'HAMDAST_PAYMENT_CANCEL',
              payload: paymentData.current?.payload,
              product_key: paymentData.current?.product_key,
            },
            hash_id: paymentData.current?.hash_id,
          },
        },
        '*',
      );
    },
  });
  const { isLogin, info } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();

  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const intervalCloseRef = useRef<any>();

  const paymentData = useRef<any>({});

  const openAndCreateReceipt = () => {
    deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
    handleOpen();
    axios
      .post(
        `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/payment/`,
        {
          product_key: paymentData.current?.product_key,
          ...(paymentData.current?.payload && { payload: paymentData.current?.payload }),
        },
        {
          withCredentials: true,
        },
      )
      .then(data => {
        setId(data.data?.receipt_id);
        paymentData.current = {
          ...paymentData.current,
          receipt_id: data.data?.receipt_id,
        };
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_payment',
          type: 'show_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
            },
          },
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let gatewayWindow: any;
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_PAYMENT_PAY') {
        setFullScreen(false);
        setIsLoading(true);
        paymentData.current = {
          hash_id: messageEvent.data?.hamdast?.hash_id,
          product_key: messageEvent.data?.hamdast?.data?.product_key,
          payload: messageEvent.data?.hamdast?.data?.payload,
        };

        if (!isLogin) {
          return handleOpenLoginModal({
            state: true,
            postLogin(userInfo) {
              return openAndCreateReceipt();
            },
            onClose: () => {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_CANCEL',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_CANCEL',
                      payload: paymentData.current?.payload,
                      product_key: paymentData.current?.product_key,
                    },
                    hash_id: paymentData.current?.hash_id,
                  },
                },
                '*',
              );
            },
          });
        }

        openAndCreateReceipt();
      }

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_CANCEL') {
        clearInterval(intervalCloseRef.current);
        deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_payment',
          type: 'cancel_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
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
                payload: paymentData.current?.payload,
                product_key: paymentData.current?.product_key,
              },
              hash_id: paymentData.current?.hash_id,
            },
          },
          '*',
        );
        handleClose();
      }

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_SUCCESS') {
        clearInterval(intervalCloseRef.current);
        deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
        if (gatewayWindow) {
          gatewayWindow?.close();
        }
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_payment',
          type: 'success_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
            },
          },
        });
        iframeRef.current?.contentWindow?.postMessage(
          {
            hamdast: {
              event: 'HAMDAST_PAYMENT_SUCCESS',
              action: 'forwardToApp',
              data: {
                event: 'HAMDAST_PAYMENT_SUCCESS',
                payload: paymentData.current?.payload,
                product_key: paymentData.current?.product_key,
                receipt_id: paymentData.current?.receipt_id,
              },
              hash_id: paymentData.current?.hash_id,
            },
          },
          '*',
        );
        handleClose();
      }

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_ERROR') {
        clearInterval(intervalCloseRef.current);
        deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
        if (gatewayWindow) {
          gatewayWindow?.close();
        }
        toast.error(messageEvent.data?.payman?.data?.message);
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_payment',
          type: 'error_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
              message: messageEvent.data?.payman?.data?.message,
            },
          },
        });
        iframeRef.current?.contentWindow?.postMessage(
          {
            hamdast: {
              event: 'HAMDAST_PAYMENT_ERROR',
              action: 'forwardToApp',
              data: {
                event: 'HAMDAST_PAYMENT_ERROR',
                payload: paymentData.current?.payload,
                product_key: paymentData.current?.product_key,
                message: messageEvent.data?.payman?.data?.message,
              },
              hash_id: paymentData.current?.hash_id,
            },
          },
          '*',
        );
        handleClose();
      }

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_OPEN_GATEWAY') {
        const gatewayLink = messageEvent.data?.payman?.data?.gateway_link || '';
        if (gatewayLink) {
          gatewayWindow = window.open(gatewayLink, '_blank');
          setFullScreen(true);
          splunkInstance('dashboard').sendEvent({
            group: 'hamdast_payment',
            type: 'open_gateway',
            event: {
              is_doctor: info?.is_doctor,
              user_id: info?.id,
              meta_data: {
                app_key: app_key,
                product_key: paymentData.current?.product_key,
                receipt_id: paymentData.current?.receipt_id,
              },
            },
          });

          intervalCloseRef.current = setInterval(() => {
            if (!getCookie('payment_state', { domain: '.paziresh24.com', path: '/' })) return;
            const status = getCookie('payment_state', { domain: '.paziresh24.com', path: '/' })?.toString().includes('SUCCESS');

            if (status) {
              splunkInstance('dashboard').sendEvent({
                group: 'hamdast_payment',
                type: 'success_receipt',
                event: {
                  is_doctor: info?.is_doctor,
                  user_id: info?.id,
                  meta_data: {
                    app_key: app_key,
                    product_key: paymentData.current?.product_key,
                    receipt_id: paymentData.current?.receipt_id,
                  },
                },
              });
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_SUCCESS',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_SUCCESS',
                      payload: paymentData.current?.payload,
                      product_key: paymentData.current?.product_key,
                      receipt_id: paymentData.current?.receipt_id,
                    },
                    hash_id: paymentData.current?.hash_id,
                  },
                },
                '*',
              );
            }

            if (!status) {
              toast.error(messageEvent.data?.payman?.data?.message);
              splunkInstance('dashboard').sendEvent({
                group: 'hamdast_payment',
                type: 'error_receipt',
                event: {
                  is_doctor: info?.is_doctor,
                  user_id: info?.id,
                  meta_data: {
                    app_key: app_key,
                    product_key: paymentData.current?.product_key,
                    receipt_id: paymentData.current?.receipt_id,
                    message: messageEvent.data?.payman?.data?.message,
                  },
                },
              });
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_ERROR',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_ERROR',
                      payload: paymentData.current?.payload,
                      product_key: paymentData.current?.product_key,
                    },
                    hash_id: paymentData.current?.hash_id,
                  },
                },
                '*',
              );
            }

            handleClose();
            deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
            clearInterval(intervalCloseRef.current);
          }, 1000);
        }
      }
    };
    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  return (
    <div>
      <Modal
        noHeader
        bodyClassName="px-3 justify-center flex items-center h-[22.5rem]"
        {...modalProps}
        fullScreen={fullScreen}
        onClose={fullScreen ? () => {} : modalProps.onClose}
      >
        {isLoading && <Loading />}
        {!isLoading && <iframe className="w-full h-[22.5rem]" src={`https://pay.paziresh24.com/${id}?embeded=true`} />}
      </Modal>
    </div>
  );
};
