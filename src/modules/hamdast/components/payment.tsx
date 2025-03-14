import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
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
  const { isLogin } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();

  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);

  const paymentData = useRef<any>({});

  const openAndCreateReceipt = () => {
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
        handleClose();
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
      }

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_SUCCESS') {
        if (gatewayWindow) {
          gatewayWindow?.close();
        }
        axios.post(
          `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/payment/verify/`,
          {
            receipt_id: paymentData.current?.receipt_id,
          },
          {
            withCredentials: true,
          },
        );
        handleClose();
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

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_ERROR') {
        if (gatewayWindow) {
          gatewayWindow?.close();
        }
        handleClose();
        toast.error(messageEvent.data?.payman?.data?.message);
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
      }

      if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_OPEN_GATEWAY') {
        const gatewayLink = messageEvent.data?.payman?.data?.gateway_link || '';
        if (gatewayLink) {
          gatewayWindow = window.open(gatewayLink, '_blank');
          setFullScreen(true);
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
