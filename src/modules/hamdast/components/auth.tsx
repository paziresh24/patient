import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useCallback, useEffect, useRef } from 'react';
import { useEffectOnce } from 'react-use';

export const HamdastAuth = ({ app_key, iframeRef }: { app_key: string; iframeRef: any }) => {
  const { handleOpenLoginModal } = useLoginModalContext();
  const { isLogin } = useUserInfoStore();

  const paymentData = useRef<{ hash_id?: string }>({});

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_AUTH_LOGIN') {
        paymentData.current = {
          hash_id: messageEvent.data?.hamdast?.hash_id,
        };

        if (isLogin) {
          return iframeRef.current?.contentWindow?.postMessage(
            {
              hamdast: {
                event: 'HAMDAST_AUTH_SUCCESS',
                action: 'forwardToApp',
                data: {
                  event: 'HAMDAST_AUTH_SUCCESS',
                },
                hash_id: paymentData.current?.hash_id,
              },
            },
            '*',
          );
        }

        handleOpenLoginModal({
          state: true,
          postLogin(userInfo) {
            return iframeRef.current?.contentWindow?.postMessage(
              {
                hamdast: {
                  event: 'HAMDAST_AUTH_SUCCESS',
                  action: 'forwardToApp',
                  data: {
                    event: 'HAMDAST_AUTH_SUCCESS',
                  },
                  hash_id: paymentData.current?.hash_id,
                },
              },
              '*',
            );
          },
          onClose: () => {
            iframeRef.current?.contentWindow?.postMessage(
              {
                hamdast: {
                  event: 'HAMDAST_AUTH_CANCEL',
                  action: 'forwardToApp',
                  data: {
                    event: 'HAMDAST_AUTH_CANCEL',
                  },
                  hash_id: paymentData.current?.hash_id,
                },
              },
              '*',
            );
          },
        });
      }
    };

    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  return (
    <div>
      {/* <Modal
        noHeader
        bodyClassName="px-3 justify-center flex items-center h-[22.5rem]"
        {...modalProps}
        fullScreen={fullScreen}
        onClose={fullScreen ? () => {} : modalProps.onClose}
      >
        {isLoading && <Loading />}
        {!isLoading && <iframe className="w-full h-[22.5rem]" src={`https://pay.paziresh24.com/${id}?embeded=true`} />}
      </Modal> */}
    </div>
  );
};
