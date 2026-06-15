import GoogleCalendarIcon from '@/common/components/icons/googleCalendar';
import { apiGatewayClient } from '@/common/apis/client';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ADD_EVENT_API_PATH } from './constants';
import { GoogleCalendarEmailModal } from './GoogleCalendarEmailModal';
import styles from './googleCalendarAddEvent.module.css';
import { getLastUsedEmail, isValidEmail, saveLastUsedEmail } from './utils';

type IconStatus = 'idle' | 'loading' | 'success';

export interface GoogleCalendarAddEventProps {
  bookId: string;
  centerId: string;
}

export const GoogleCalendarAddEvent = ({ bookId, centerId }: GoogleCalendarAddEventProps) => {
  const userEmail = useUserInfoStore(state => state.info?.email);
  const { handleOpen, handleClose, modalProps } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef(true);
  const iconStatusRef = useRef<IconStatus>('idle');

  const [iconStatus, setIconStatus] = useState<IconStatus>('idle');
  const [email, setEmail] = useState('');

  iconStatusRef.current = iconStatus;

  const handleModalClose = useCallback(() => {
    if (iconStatusRef.current === 'loading') {
      return;
    }

    saveLastUsedEmail(inputRef.current?.value ?? '');
    handleClose();
  }, [handleClose]);

  useEffect(() => {
    isActiveRef.current = true;

    return () => {
      isActiveRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!modalProps.isOpen) {
      return;
    }

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleModalClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleModalClose, modalProps.isOpen]);

  const sendToCalendar = useCallback(
    async (targetEmail: string) => {
      setIconStatus('loading');

      try {
        await apiGatewayClient.post(ADD_EVENT_API_PATH, {
          email: targetEmail,
          book_id: bookId,
          center_id: centerId,
        });

        if (!isActiveRef.current) {
          return;
        }

        saveLastUsedEmail(targetEmail);
        setIconStatus('success');
        handleClose();
        toast.success('نوبت به Google Calendar اضافه شد');
      } catch {
        if (!isActiveRef.current) {
          return;
        }

        setIconStatus('idle');
        toast.error('افزودن به تقویم انجام نشد. لطفا دوباره تلاش کنید');
      }
    },
    [bookId, centerId, handleClose],
  );

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (iconStatus === 'loading') {
      return;
    }

    setEmail(getLastUsedEmail(userEmail));
    handleOpen();
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      inputRef.current?.focus();
      return;
    }

    sendToCalendar(trimmedEmail);
  };

  const iconClassName = classNames(styles.icon, {
    [styles.iconLoading]: iconStatus === 'loading',
    [styles.iconSuccess]: iconStatus === 'success',
  });

  const triggerTitle =
    iconStatus === 'success'
      ? 'نوبت به Google Calendar اضافه شده'
      : 'برای افزودن نوبت به Google Calendar کلیک کنید';

  return (
    <>
      <div className={styles.root}>
        <button
          type="button"
          aria-label={triggerTitle}
          title={triggerTitle}
          aria-busy={iconStatus === 'loading'}
          aria-expanded={modalProps.isOpen}
          className={styles.trigger}
          onClick={handleIconClick}
          disabled={iconStatus === 'loading'}
        >
          <GoogleCalendarIcon className={iconClassName} aria-hidden />
        </button>
      </div>

      <GoogleCalendarEmailModal
        isOpen={modalProps.isOpen}
        isLoading={iconStatus === 'loading'}
        email={email}
        inputRef={inputRef}
        onClose={handleModalClose}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default GoogleCalendarAddEvent;
