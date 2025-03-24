import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export const HamdastWidget = ({ app_id, app_name, iframeRef }: { app_id: string; app_name: string; iframeRef: any }) => {
  const [id, setId] = useState(null);
  const { handleClose, handleOpen, modalProps } = useModal({
    onClose: () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_PAYMENT_CANCEL',
            action: 'forwardToApp',
            hash_id: id,
          },
        },
        '*',
      );
    },
  });
  const { isLogin } = useUserInfoStore();
  const hashId = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      console.log(messageEvent.data?.hamdast);

      if (messageEvent.data?.hamdast?.event === 'HAMDAST_WIDGET_ADD_TO_PROFILE') {
        hashId.current = messageEvent.data?.hamdast?.hash_id;
        handleOpen();
      }
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_WIDGET_REMOVE_FROM_PROFILE') {
        hashId.current = messageEvent.data?.hamdast?.hash_id;
        remove();
      }
    };
    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  const accept = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        'https://hamdast.paziresh24.com/api/v1/widgets/',
        {
          app_id: app_id,
        },
        { withCredentials: true },
      );
      handleClose();
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'ACCEPTED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } catch (error) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'CANCELED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } finally {
      handleClose();
      setIsLoading(false);
    }
  };

  const cancel = async () => {
    setIsCancelLoading(true);
    try {
      await axios.delete('https://hamdast.paziresh24.com/api/v1/widgets/', {
        data: {
          app_id: app_id,
        },
        withCredentials: true,
      });
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'CANCELED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } catch (error) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'CANCELED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } finally {
      handleClose();
      setIsCancelLoading(false);
    }
  };

  const remove = async () => {
    try {
      await axios.delete('https://hamdast.paziresh24.com/api/v1/widgets/', {
        data: {
          app_id: app_id,
        },
        withCredentials: true,
      });
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_REMOVE_FROM_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'REMOVED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } catch (error) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_REMOVE_FROM_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'REMOVED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    }
  };

  return (
    <div>
      <Modal noHeader {...modalProps} bodyClassName="gap-2 flex flex-col">
        <span className="text-sm">
          ابزارک <b>{app_name}</b> قصد دارد ویجتی را به پروفایل شما اضافه کند.
        </span>
        <span className="text-xs font-medium">آیا مایل به ادامه و افزودن آن به پروفایل خود هستید؟</span>
        <div className="flex gap-3">
          <Button loading={isLoading} className="w-full" onClick={accept}>
            افزودن
          </Button>
          <Button loading={isCancelLoading} className="w-full" variant="secondary" onClick={cancel}>
            انصراف
          </Button>
        </div>
      </Modal>
    </div>
  );
};
