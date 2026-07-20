import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import ChatIcon from '@/common/components/icons/chat';
import CloseIcon from '@/common/components/icons/close';
import useModal from '@/common/hooks/useModal';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios, { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

type EnsureResponse = {
  activated?: boolean;
  was_created?: boolean;
  credit?: number;
};

type SmsActivateEvent =
  | 'HAMDAST_SMS_ACTIVATE_SUCCESS'
  | 'HAMDAST_SMS_ACTIVATE_CANCEL'
  | 'HAMDAST_SMS_ACTIVATE_ERROR';

export const HamdastSmsActivate = ({
  app_name,
  iframeRef,
}: {
  app_name?: string;
  iframeRef: any;
}) => {
  const { isLogin } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();
  const hashId = useRef<string | number | null>(null);
  const repliedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const { handleClose, handleOpen, modalProps } = useModal();

  const replyToWidget = (event: SmsActivateEvent, data: Record<string, unknown> = {}) => {
    if (repliedRef.current) {
      return;
    }
    repliedRef.current = true;

    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event,
          action: 'forwardToApp',
          data: {
            event,
            ...data,
          },
          hash_id: hashId.current,
        },
      },
      '*',
    );
  };

  const handleCancel = () => {
    replyToWidget('HAMDAST_SMS_ACTIVATE_CANCEL');
    handleClose();
  };

  const ensureSmsAccount = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<EnsureResponse>(
        'https://apigw.paziresh24.com/open-platform/v1/rasan/account/ensure',
        undefined,
        { withCredentials: true },
      );

      const payload = response.data || {};
      const wasCreated = Boolean(payload.was_created);

      replyToWidget('HAMDAST_SMS_ACTIVATE_SUCCESS', {
        activated: true,
        was_created: wasCreated,
        credit: payload.credit ?? 0,
      });
      handleClose();
      toast.success(wasCreated ? 'پیامک فعال شد' : 'پیامک از قبل فعال است');
    } catch (error) {
      const message =
        (isAxiosError(error) &&
          (error.response?.data?.error?.message || error.response?.data?.message)) ||
        'فعال‌سازی انجام نشد. دوباره تلاش کنید.';

      replyToWidget('HAMDAST_SMS_ACTIVATE_ERROR', {
        message: String(message),
      });
      handleClose();
      toast.error(String(message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event !== 'HAMDAST_SMS_ACTIVATE') {
        return;
      }

      hashId.current = messageEvent.data?.hamdast?.hash_id ?? null;
      repliedRef.current = false;

      if (!isLogin) {
        return handleOpenLoginModal({
          state: true,
          postLogin() {
            handleOpen();
          },
          onClose: () => {
            replyToWidget('HAMDAST_SMS_ACTIVATE_CANCEL');
          },
        });
      }

      handleOpen();
    };

    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  const description = app_name
    ? `«${app_name}» برای ارسال پیامک به بیمارانتان، به تأیید شما نیاز دارد.`
    : 'برای ارسال پیامک به بیمارانتان، به تأیید شما نیاز دارد.';

  return (
    <Modal
      {...modalProps}
      onClose={() => {
        if (!repliedRef.current) {
          handleCancel();
          return;
        }
        handleClose();
      }}
      noHeader
      noLine
      bodyClassName="!p-0 overflow-hidden"
      className="md:!w-[22rem]"
    >
      <div className="relative flex flex-col items-center px-6 pt-7 pb-5 text-center">
        <CloseIcon
          className="absolute top-3.5 left-3.5 h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-slate-600 active:scale-[0.97]"
          onClick={() => !isLoading && handleCancel()}
        />

        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ChatIcon className="h-7 w-7" />
        </div>

        <Text fontWeight="bold" fontSize="lg" className="text-slate-900">
          فعال‌سازی پیامک
        </Text>

        <Text fontSize="sm" className="mt-2 max-w-[17rem] leading-6 text-slate-500">
          {description}
        </Text>

        <div className="mt-6 flex w-full flex-col gap-1.5">
          <Button className="w-full" onClick={ensureSmsAccount} loading={isLoading}>
            تأیید و فعال‌سازی
          </Button>
          <Button
            variant="text"
            className="w-full !text-slate-500 hover:!text-slate-700"
            onClick={handleCancel}
            disabled={isLoading}
          >
            بعداً
          </Button>
        </div>
      </div>
    </Modal>
  );
};
