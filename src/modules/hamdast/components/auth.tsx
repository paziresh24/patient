import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import { useEffect, useRef } from 'react';

export const HamdastAuth = ({ app_key, iframeRef }: { app_key: string; iframeRef: any }) => {
  const { handleOpenLoginModal } = useLoginModalContext();
  const { isLogin } = useUserInfoStore();

  const paymentData = useRef<{ hash_id?: string }>({});

  useEffect(() => {
    const postSessionTokenEvent = ({
      eventName,
      hash_id,
      data,
    }: {
      eventName: string;
      hash_id?: string;
      data: Record<string, any>;
    }) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: eventName,
            action: 'forwardToApp',
            data,
            hash_id,
          },
        },
        '*',
      );
    };

    const getSessionToken = async ({
      response_event,
      hash_id,
      scope,
    }: {
      response_event?: string;
      hash_id?: string;
      scope?: unknown;
    }) => {
      const responseEventName = response_event || 'HAMDAST_SDK_SESSION_TOKEN_RESPONSE';

      try {
        const response = await axios.post(
          `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/oauth/session_token`,
          {
            ...(scope ? { scope } : {}),
          },
          {
            withCredentials: true,
          },
        );

        return postSessionTokenEvent({
          eventName: responseEventName,
          hash_id,
          data: {
            ok: true,
            session_token: response.data?.session_token,
            expires_at: response.data?.expires_at,
          },
        });
      } catch (error: any) {
        const errorBody = error?.response?.data?.error;
        const errorCode = errorBody?.code || 'INTERNAL_ERROR';
        const errorMessage =
          errorBody?.message || 'خطا در دریافت session token رخ داده است.';

        return postSessionTokenEvent({
          eventName: responseEventName,
          hash_id,
          data: {
            ok: false,
            error: errorMessage,
            error_code: errorCode,
            details: errorBody?.details || null,
          },
        });
      }
    };

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

      if (messageEvent.data?.hamdast?.event === 'HAMDAST_GET_SESSION_TOKEN') {
        getSessionToken({
          response_event: messageEvent.data?.hamdast?.data?.response_event,
          hash_id: messageEvent.data?.hamdast?.hash_id,
          scope: messageEvent.data?.hamdast?.data?.scope,
        });
      }
    };

    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [app_key, handleOpenLoginModal, iframeRef, isLogin]);

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
