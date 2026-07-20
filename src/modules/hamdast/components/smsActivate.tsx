import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import ChatIcon from '@/common/components/icons/chat';
import CloseIcon from '@/common/components/icons/close';
import Loading from '@/common/components/atom/loading';
import useModal from '@/common/hooks/useModal';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios, { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const RASAN_ENSURE_URL = 'https://hamdast.paziresh24.com/api/v1/rasan/account/ensure';
const RASAN_BALANCE_URL = 'https://hamdast.paziresh24.com/api/v1/rasan/balance';

type BalanceResponse = {
  credit?: number;
  unit?: string;
};

type EnsureResponse = {
  activated?: boolean;
  credit?: number;
};

type RasanActivateEvent =
  | 'HAMDAST_RASAN_ACTIVATE_SUCCESS'
  | 'HAMDAST_RASAN_ACTIVATE_CANCEL'
  | 'HAMDAST_RASAN_ACTIVATE_ERROR';

type Phase = 'checking' | 'confirm';

export const HamdastRasanActivate = ({
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
  const [phase, setPhase] = useState<Phase>('checking');
  const [isActivating, setIsActivating] = useState(false);
  const { handleClose, handleOpen, modalProps } = useModal();

  const replyToWidget = (event: RasanActivateEvent, data: Record<string, unknown> = {}) => {
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
    replyToWidget('HAMDAST_RASAN_ACTIVATE_CANCEL');
    handleClose();
  };

  const checkSmsAccount = async () => {
    setPhase('checking');
    try {
      const response = await axios.get<BalanceResponse>(RASAN_BALANCE_URL, {
        withCredentials: true,
      });

      replyToWidget('HAMDAST_RASAN_ACTIVATE_SUCCESS', {
        activated: true,
        credit: response.data?.credit ?? 0,
      });
      handleClose();
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      const code =
        isAxiosError(error) &&
        (error.response?.data?.code || error.response?.data?.error?.code);

      if (status === 409 || code === 'SMS_NOT_ACTIVATED') {
        setPhase('confirm');
        return;
      }

      const message =
        (isAxiosError(error) &&
          (error.response?.data?.error?.message || error.response?.data?.message)) ||
        'بررسی وضعیت پیامک انجام نشد. دوباره تلاش کنید.';

      replyToWidget('HAMDAST_RASAN_ACTIVATE_ERROR', {
        message: String(message),
      });
      handleClose();
      toast.error(String(message));
    }
  };

  const activateSmsAccount = async () => {
    setIsActivating(true);
    try {
      const response = await axios.post<EnsureResponse>(
        RASAN_ENSURE_URL,
        undefined,
        { withCredentials: true },
      );

      const payload = response.data || {};

      replyToWidget('HAMDAST_RASAN_ACTIVATE_SUCCESS', {
        activated: true,
        credit: payload.credit ?? 0,
      });
      handleClose();
      toast.success('پیامک فعال شد');
    } catch (error) {
      const message =
        (isAxiosError(error) &&
          (error.response?.data?.error?.message || error.response?.data?.message)) ||
        'فعال‌سازی انجام نشد. دوباره تلاش کنید.';

      replyToWidget('HAMDAST_RASAN_ACTIVATE_ERROR', {
        message: String(message),
      });
      handleClose();
      toast.error(String(message));
    } finally {
      setIsActivating(false);
    }
  };

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event !== 'HAMDAST_RASAN_ACTIVATE') {
        return;
      }

      hashId.current = messageEvent.data?.hamdast?.hash_id ?? null;
      repliedRef.current = false;
      setPhase('checking');

      if (!isLogin) {
        return handleOpenLoginModal({
          state: true,
          postLogin() {
            handleOpen();
            void checkSmsAccount();
          },
          onClose: () => {
            replyToWidget('HAMDAST_RASAN_ACTIVATE_CANCEL');
          },
        });
      }

      handleOpen();
      void checkSmsAccount();
    };

    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  const description = app_name
    ? `«${app_name}» برای ارسال پیامک به بیمارانتان، به تأیید شما نیاز دارد.`
    : 'برای ارسال پیامک به بیمارانتان، به تأیید شما نیاز دارد.';

  const busy = phase === 'checking' || isActivating;

  return (
    <Modal
      {...modalProps}
      onClose={() => {
        if (busy) {
          return;
        }
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
      {phase === 'checking' ? (
        <div className="flex flex-col items-center justify-center px-6 py-12">
          <Loading />
        </div>
      ) : (
        <div className="relative flex flex-col items-center px-6 pt-7 pb-5 text-center">
          <CloseIcon
            className="absolute top-3.5 left-3.5 h-5 w-5 cursor-pointer text-slate-400 transition-colors hover:text-slate-600 active:scale-[0.97]"
            onClick={() => !isActivating && handleCancel()}
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
            <Button className="w-full" onClick={activateSmsAccount} loading={isActivating}>
              تأیید و فعال‌سازی
            </Button>
            <Button
              variant="text"
              className="w-full !text-slate-500 hover:!text-slate-700"
              onClick={handleCancel}
              disabled={isActivating}
            >
              بعداً
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
