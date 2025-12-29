import Alert from '@/common/components/atom/alert';
import Button from '@/common/components/atom/button/button';
import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import TextField from '@/common/components/atom/textField';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import axios from 'axios';
import { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface HamdastSupportRef {
  open: () => void;
  close: () => void;
}

interface HamdastSupportProps {
  app_key: string;
  iframeRef: any;
  app_name: string;
}

export const HamdastSupport = forwardRef<HamdastSupportRef, HamdastSupportProps>(({ app_key, iframeRef, app_name }, ref) => {
  const { handleOpen, handleClose, modalProps } = useModal();
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportLink, setSupportLink] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('لطفاً مشکل یا درخواست خود را وارد کنید');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('message', message.trim());

      const response = await axios.post(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/support`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.status === 'SUCCESS' && response.data?.data?.url) {
        toast.success('درخواست شما با موفقیت ثبت شد');
        setMessage('');
        handleClose();
        window.open(response.data.data.url, '_blank');
      } else {
        toast.success('درخواست شما با موفقیت ثبت شد');
        setMessage('');
        handleClose();
      }
    } catch (error: any) {
      console.error('Error submitting support request:', error);
      toast.error(error?.response?.data?.message || 'خطا در ارسال درخواست. لطفاً دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchSupportLink = async () => {
      if (!app_key) return;

      try {
        const response = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/support`, {
          withCredentials: true,
        });

        if (response.data?.id && response.data?.link) {
          setSupportLink(response.data.link);
        }
      } catch (error) {
        console.error('Error fetching support link:', error);
      }
    };

    if (modalProps.isOpen) {
      fetchSupportLink();
    }
  }, [app_key, modalProps.isOpen]);

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_SUPPORT') {
        if (!isLogin) {
          handleOpenLoginModal({
            state: true,
            postLogin: () => {
              handleOpen();
            },
          });
          return;
        }
        handleOpen();
      }
    };

    window.addEventListener('message', handleEventFunction);
    return () => window.removeEventListener('message', handleEventFunction);
  }, [isLogin, handleOpen, handleOpenLoginModal]);

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: handleClose,
    }),
    [handleOpen, handleClose],
  );

  return (
    <Modal {...modalProps} title={'پشتیبانی ابزارک ' + app_name}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">مشکل یا درخواست خود را شرح دهید:</span>
          <TextField
            multiLine
            className="h-36"
            placeholder="مشکل یا درخواست خود را اینجا بنویسید..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Alert severity="info" className="p-2">
          <span className="text-xs font-medium text-blue-600">
            لطفا موضوع را به صورت دقیق و کامل توضیح دهید. اغلب برای پاسخگویی به سوالات ناقص و کوتاه زمان بیشتری نیاز است.
          </span>
        </Alert>

        <div className="flex flex-col gap-3">
          <Button block onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting || !message.trim()}>
            ارسال درخواست
          </Button>
          {supportLink && (
            <Button
              variant="secondary"
              block
              onClick={() => {
                window.open(supportLink, '_blank');
              }}
              disabled={isSubmitting}
            >
              مشاهده گفتگوهای قبلی
            </Button>
          )}
          <Button variant="secondary" block onClick={handleClose} disabled={isSubmitting}>
            انصراف
          </Button>
        </div>
      </div>
    </Modal>
  );
});

HamdastSupport.displayName = 'HamdastSupport';
