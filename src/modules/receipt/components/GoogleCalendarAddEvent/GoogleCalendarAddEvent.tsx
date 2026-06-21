import { useGhandonPreference, useSaveGhandonPreference } from '@/common/apis/services/ghandon/preference';
import { apiGatewayClient } from '@/common/apis/client';
import GoogleCalendarIcon from '@/common/components/icons/googleCalendar';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ADD_EVENT_API_PATH } from './constants';
import { GoogleCalendarEmailModal } from './GoogleCalendarEmailModal';
import styles from './googleCalendarAddEvent.module.css';
import { getLastUsedEmail, getSubmittedEmail, isValidEmail, saveLastUsedEmail, saveSubmittedEmail } from './utils';

type IconStatus = 'idle' | 'loading' | 'success';

export interface GoogleCalendarAddEventProps {
  bookId: string;
  centerId: string;
}

export const GoogleCalendarAddEvent = ({ bookId, centerId }: GoogleCalendarAddEventProps) => {
  const normalizedBookId = bookId?.trim() ?? '';
  const normalizedCenterId = centerId?.trim() ?? '';

  const userEmail = useUserInfoStore(state => state.info?.email);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpen, handleClose, modalProps } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef(true);
  const isSubmittingRef = useRef(false);
  const autoSyncAttemptedRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: preference } = useGhandonPreference(isLogin);
  const savePreference = useSaveGhandonPreference();

  const autoSyncEnabled = Boolean(preference?.auto_sync && preference.email);
  const preferenceEmail = preference?.email?.trim() ?? '';

  const [iconStatus, setIconStatus] = useState<IconStatus>(() => {
    if (getSubmittedEmail(normalizedCenterId, normalizedBookId)) {
      return 'success';
    }

    return 'idle';
  });
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [initialAutoSync, setInitialAutoSync] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(() => getSubmittedEmail(normalizedCenterId, normalizedBookId));

  const handleModalClose = useCallback(() => {
    const savedSubmittedEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);

    if (savedSubmittedEmail || autoSyncEnabled) {
      setEmail(savedSubmittedEmail || preferenceEmail);
      setSubmittedEmail(savedSubmittedEmail);
      setIsEditing(false);
      setAutoSync(autoSyncEnabled);
      setInitialAutoSync(autoSyncEnabled);
    }

    handleClose();
  }, [autoSyncEnabled, handleClose, normalizedBookId, normalizedCenterId, preferenceEmail]);

  useEffect(() => {
    isActiveRef.current = true;

    return () => {
      isActiveRef.current = false;
    };
  }, []);

  useEffect(() => {
    autoSyncAttemptedRef.current = false;
    const savedSubmittedEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);

    setSubmittedEmail(savedSubmittedEmail);
    setIconStatus(savedSubmittedEmail ? 'success' : 'idle');
    setIsEditing(false);
    setAutoSync(false);
    setInitialAutoSync(false);
  }, [normalizedBookId, normalizedCenterId]);

  useEffect(() => {
    if (!autoSyncEnabled || !preferenceEmail) {
      return;
    }

    setAutoSync(true);
    setInitialAutoSync(true);

    if (getSubmittedEmail(normalizedCenterId, normalizedBookId)) {
      setIconStatus(prev => (prev === 'loading' ? prev : 'success'));
    }
  }, [autoSyncEnabled, normalizedBookId, normalizedCenterId, preferenceEmail]);

  useEffect(() => {
    if (!modalProps.isOpen) {
      return;
    }

    const shouldFocus = !submittedEmail || isEditing;
    const focusTimer = shouldFocus ? window.setTimeout(() => inputRef.current?.focus(), 80) : undefined;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleModalClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      if (focusTimer) {
        window.clearTimeout(focusTimer);
      }
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleModalClose, isEditing, modalProps.isOpen, submittedEmail]);

  const sendToCalendar = useCallback(
    async (targetEmail: string, options?: { silent?: boolean }) => {
      if (!normalizedBookId || !normalizedCenterId || !isValidEmail(targetEmail)) {
        return;
      }

      setIconStatus('loading');

      try {
        await apiGatewayClient.post(ADD_EVENT_API_PATH, {
          email: targetEmail.trim(),
          book_id: normalizedBookId,
          center_id: normalizedCenterId,
        });

        if (!isActiveRef.current) {
          return;
        }

        saveLastUsedEmail(targetEmail);
        saveSubmittedEmail(normalizedCenterId, normalizedBookId, targetEmail);
        setSubmittedEmail(targetEmail.trim());
        setIsEditing(false);
        setIconStatus('success');

        if (!options?.silent) {
          toast.success('نوبت به Google Calendar اضافه شد');
        }
      } catch {
        if (!isActiveRef.current) {
          return;
        }

        if (options?.silent) {
          autoSyncAttemptedRef.current = false;
        }

        const wasSubmitted = Boolean(getSubmittedEmail(normalizedCenterId, normalizedBookId));
        setIconStatus(wasSubmitted ? 'success' : 'idle');

        if (!options?.silent) {
          toast.error('افزودن به تقویم انجام نشد. لطفا دوباره تلاش کنید');
        }
      }
    },
    [normalizedBookId, normalizedCenterId],
  );

  useEffect(() => {
    if (!autoSyncEnabled || !preferenceEmail || autoSyncAttemptedRef.current) {
      return;
    }

    if (getSubmittedEmail(normalizedCenterId, normalizedBookId)) {
      return;
    }

    autoSyncAttemptedRef.current = true;
    sendToCalendar(preferenceEmail, { silent: true });
  }, [autoSyncEnabled, normalizedBookId, normalizedCenterId, preferenceEmail, sendToCalendar]);

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (iconStatus === 'loading') {
      return;
    }

    const savedSubmittedEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);
    setSubmittedEmail(savedSubmittedEmail);

    if (savedSubmittedEmail) {
      setEmail(savedSubmittedEmail);
      setIsEditing(false);
      setAutoSync(autoSyncEnabled);
      setInitialAutoSync(autoSyncEnabled);
    } else if (autoSyncEnabled && preferenceEmail) {
      setEmail(preferenceEmail);
      setIsEditing(false);
      setAutoSync(true);
      setInitialAutoSync(true);
    } else {
      setEmail(getLastUsedEmail(userEmail));
      setIsEditing(true);
      setAutoSync(false);
      setInitialAutoSync(false);
    }

    handleOpen();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      inputRef.current?.focus();
      return;
    }

    const savedBookEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);
    const isLocked = Boolean(submittedEmail) && !isEditing;
    const hasPreferenceChanges = autoSync !== initialAutoSync;
    const shouldSavePreference =
      isLogin && (hasPreferenceChanges || (autoSync && trimmedEmail !== preferenceEmail));
    const shouldAddEvent = !isLocked && (!savedBookEmail || trimmedEmail !== savedBookEmail);

    isSubmittingRef.current = true;
    setIsSaving(true);
    saveLastUsedEmail(trimmedEmail);

    try {
      if (shouldSavePreference) {
        try {
          await savePreference.mutateAsync({
            email: trimmedEmail,
            auto_sync: autoSync,
          });
          setInitialAutoSync(autoSync);

          if (autoSync && !initialAutoSync) {
            toast.success('از این پس نوبت‌ها به‌صورت خودکار به تقویم اضافه می‌شوند');
          } else if (!autoSync && initialAutoSync) {
            toast.success('افزودن خودکار به تقویم غیرفعال شد');
          }
        } catch {
          toast.error('ذخیره تنظیمات انجام نشد. لطفا دوباره تلاش کنید');
          return;
        }
      }

      handleClose();

      if (shouldAddEvent) {
        await sendToCalendar(trimmedEmail);
      }
    } finally {
      isSubmittingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 80);
  }, []);

  if (!normalizedBookId || !normalizedCenterId) {
    return null;
  }

  const isLocked = Boolean(submittedEmail) && !isEditing;

  const iconClassName = classNames(styles.icon, {
    [styles.iconLoading]: iconStatus === 'loading',
    [styles.iconSuccess]: iconStatus === 'success',
  });

  const triggerTitle =
    iconStatus === 'loading'
      ? 'در حال ارسال دعوتنامه...'
      : autoSyncEnabled && iconStatus === 'success'
        ? 'نوبت‌ها به‌صورت خودکار به Google Calendar اضافه می‌شوند'
        : iconStatus === 'success'
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
          className={classNames(styles.trigger, {
            [styles.triggerLoading]: iconStatus === 'loading',
          })}
          onClick={handleIconClick}
          disabled={iconStatus === 'loading'}
        >
          <GoogleCalendarIcon className={iconClassName} width={26} height={26} aria-hidden />
        </button>
      </div>

      <GoogleCalendarEmailModal
        isOpen={modalProps.isOpen}
        isSaving={isSaving}
        email={email}
        isLocked={isLocked}
        autoSync={autoSync}
        initialAutoSync={initialAutoSync}
        showAutoSyncOption={isLogin}
        inputRef={inputRef}
        onClose={handleModalClose}
        onEdit={handleEdit}
        onAutoSyncChange={setAutoSync}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default GoogleCalendarAddEvent;
