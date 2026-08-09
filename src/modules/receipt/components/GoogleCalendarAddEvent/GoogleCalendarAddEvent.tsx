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
  const user_id = useUserInfoStore(state => state.info?.id?.toString());
  const { handleOpen, handleClose, modalProps } = useModal();
  const inputRef = useRef<HTMLInputElement>(null);
  const isActiveRef = useRef(true);
  const isSubmittingRef = useRef(false);
  const autoSyncAttemptedRef = useRef(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data: preference } = useGhandonPreference(isLogin);
  const savePreference = useSaveGhandonPreference();

  const [localBackup, setLocalBackup] = useState<{ autoSync: boolean; email: string } | null>(null);
  const [sessionPref, setSessionPref] = useState<{ autoSync: boolean; email: string } | null>(null);

  useEffect(() => {
    if (user_id && typeof window !== 'undefined') {
      const storedSync = localStorage.getItem(`ghandon_auto_sync_${user_id}`);
      const storedEmail = localStorage.getItem(`ghandon_email_${user_id}`);

      console.info(`[Ghandon-Front] Loading localStorage backup for User ID [${user_id}]:`, {
        storedSync,
        storedEmail,
      });

      if (storedSync !== null) {
        setLocalBackup({
          autoSync: storedSync === 'true',
          email: storedEmail || '',
        });
      }
    }
  }, [user_id]);

  const serverAutoSync = Boolean(preference?.auto_sync && preference.email);
  const serverEmail = preference?.email?.trim() ?? '';

  const activeAutoSyncEnabled = sessionPref?.autoSync ?? localBackup?.autoSync ?? serverAutoSync;
  const activePreferenceEmail = sessionPref?.email ?? localBackup?.email ?? serverEmail;

  const [iconStatus, setIconStatus] = useState<IconStatus>(() => {
    const isSubmitted = getSubmittedEmail(normalizedCenterId, normalizedBookId);
    console.info(`[Ghandon-Front] Initializing button state for Book ID [${normalizedBookId}]. Submitted Email: ${isSubmitted || 'None'}`);
    return isSubmitted ? 'success' : 'idle';
  });

  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [autoSync, setAutoSync] = useState(false);
  const [initialAutoSync, setInitialAutoSync] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(() => getSubmittedEmail(normalizedCenterId, normalizedBookId));

  const handleModalClose = useCallback(() => {
    console.info(`[Ghandon-Front] Closing Modal for Book ID [${normalizedBookId}]. Reverting temporary states.`);
    const savedSubmittedEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);

    if (savedSubmittedEmail || activeAutoSyncEnabled) {
      setEmail(savedSubmittedEmail || activePreferenceEmail);
      setSubmittedEmail(savedSubmittedEmail);
      setIsEditing(false);
      setAutoSync(activeAutoSyncEnabled);
      setInitialAutoSync(activeAutoSyncEnabled);
    }

    handleClose();
  }, [activeAutoSyncEnabled, handleClose, normalizedBookId, normalizedCenterId, activePreferenceEmail]);

  useEffect(() => {
    isActiveRef.current = true;
    console.info(`[Ghandon-Front] Component Mounted for Book ID: ${normalizedBookId}`);
    return () => {
      isActiveRef.current = false;
      console.info(`[Ghandon-Front] Component Unmounted for Book ID: ${normalizedBookId}`);
    };
  }, [normalizedBookId]);

  useEffect(() => {
    console.info(`[Ghandon-Front] Book changed to [${normalizedBookId}]. Refreshing local states.`);
    autoSyncAttemptedRef.current = false;
    const savedSubmittedEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);

    setSubmittedEmail(savedSubmittedEmail);
    setIconStatus(savedSubmittedEmail ? 'success' : 'idle');
    setIsEditing(false);
    setAutoSync(false);
    setInitialAutoSync(false);
  }, [normalizedBookId, normalizedCenterId]);

  useEffect(() => {
    if (!activeAutoSyncEnabled || !activePreferenceEmail) {
      return;
    }

    console.info(`[Ghandon-Front] Auto-Sync preference detected active for email: ${activePreferenceEmail}`);
    setAutoSync(true);
    setInitialAutoSync(true);

    if (getSubmittedEmail(normalizedCenterId, normalizedBookId)) {
      setIconStatus(prev => (prev === 'loading' ? prev : 'success'));
    }
  }, [activeAutoSyncEnabled, normalizedBookId, normalizedCenterId, activePreferenceEmail]);

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
        console.warn(`[Ghandon-Front] Aborting sendToCalendar. Validation failed:`, {
          bookId: normalizedBookId,
          centerId: normalizedCenterId,
          email: targetEmail,
        });
        return;
      }

      console.info(
        `[Ghandon-Front] Dispatching 'create_event' request to backend for Email: ${targetEmail} (Silent: ${Boolean(options?.silent)})`,
      );
      setIconStatus('loading');

      try {
        const payload = {
          action: 'create_event',
          user_id: user_id,
          email: targetEmail.trim(),
          book_id: normalizedBookId,
          center_id: normalizedCenterId,
        };

        const response = await apiGatewayClient.post(ADD_EVENT_API_PATH, payload, {
          baseURL: process.env.NEXT_PUBLIC_GHANDON_API_BASE_URL,
          withCredentials: true,
        });

        console.info(`[Ghandon-Front] Backend response for 'create_event' received successfully:`, response.data);

        if (!isActiveRef.current) {
          console.warn(`[Ghandon-Front] Component unmounted before request finished. Dropping state update.`);
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
      } catch (error: any) {
        console.error(`[Ghandon-Front] Error encountered in sendToCalendar:`, error);

        if (!isActiveRef.current) {
          return;
        }

        if (options?.silent) {
          autoSyncAttemptedRef.current = false;
        }

        const wasSubmitted = Boolean(getSubmittedEmail(normalizedCenterId, normalizedBookId));
        setIconStatus(wasSubmitted ? 'success' : 'idle');

        if (!options?.silent) {
          const backendErrorMessage = error?.response?.data?.message || 'افزودن به تقویم انجام نشد. لطفا دوباره تلاش کنید';
          console.error(`[Ghandon-Front] Extracted backend error message: ${backendErrorMessage}`);
          toast.error(backendErrorMessage);
        }
      }
    },
    [normalizedBookId, normalizedCenterId, user_id],
  );

  useEffect(() => {
    if (!activeAutoSyncEnabled || !activePreferenceEmail || autoSyncAttemptedRef.current) {
      return;
    }

    if (getSubmittedEmail(normalizedCenterId, normalizedBookId)) {
      return;
    }

    console.info(`[Ghandon-Front] Triggering automated background sync for Book ID: ${normalizedBookId}`);
    autoSyncAttemptedRef.current = true;
    sendToCalendar(activePreferenceEmail, { silent: true });
  }, [activeAutoSyncEnabled, normalizedBookId, normalizedCenterId, activePreferenceEmail, sendToCalendar]);

  const handleIconClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    console.info(`[Ghandon-Front] Calendar icon clicked. Status: ${iconStatus}`);

    if (iconStatus === 'loading') {
      return;
    }

    const savedSubmittedEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);
    setSubmittedEmail(savedSubmittedEmail);

    const initialEmail = savedSubmittedEmail || activePreferenceEmail || getLastUsedEmail(userEmail);
    console.info(`[Ghandon-Front] Opening Modal form with initial email prefill: ${initialEmail}`);
    setEmail(initialEmail);

    setIsEditing(!savedSubmittedEmail);

    setAutoSync(activeAutoSyncEnabled);
    setInitialAutoSync(activeAutoSyncEnabled);

    handleOpen();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      console.warn(`[Ghandon-Front] Form submit aborted. Invalid email formatting: "${trimmedEmail}"`);
      inputRef.current?.focus();
      return;
    }

    const savedBookEmail = getSubmittedEmail(normalizedCenterId, normalizedBookId);
    const isLockedComponent = Boolean(submittedEmail) && !isEditing;

    const hasPreferenceChanges = autoSync !== initialAutoSync || trimmedEmail !== activePreferenceEmail;
    const shouldSavePreference = isLogin && hasPreferenceChanges;
    const shouldAddEvent = !isLockedComponent && (!savedBookEmail || trimmedEmail !== savedBookEmail);

    console.info(`[Ghandon-Front] Form submitted. Evaluation:`, {
      email: trimmedEmail,
      isLocked: isLockedComponent,
      shouldSavePreference,
      shouldAddEvent,
    });

    isSubmittingRef.current = true;
    setIsSaving(true);
    saveLastUsedEmail(trimmedEmail);

    try {
      if (shouldSavePreference) {
        console.info(`[Ghandon-Front] Preference change detected. Saving 'save_settings' on backend.`);
        try {
          await Promise.all([
            apiGatewayClient.post(
              ADD_EVENT_API_PATH,
              {
                action: 'save_settings',
                user_id: user_id,
                email: trimmedEmail,
              },
              {
                baseURL: process.env.NEXT_PUBLIC_GHANDON_API_BASE_URL,
                withCredentials: true,
              },
            ),
            savePreference
              .mutateAsync({
                email: trimmedEmail,
                auto_sync: autoSync,
              })
              .then(() => {
                console.info(`[Ghandon-Front] Paziresh24 core preference sync completed successfully.`);
              })
              .catch(prefError => {
                console.warn('[Ghandon-Front] Paziresh24 core preference save failed, skipping local error:', prefError);
              }),
          ]);

          if (user_id) {
            localStorage.setItem(`ghandon_auto_sync_${user_id}`, String(autoSync));
            localStorage.setItem(`ghandon_email_${user_id}`, trimmedEmail);
          }

          setSessionPref({ autoSync, email: trimmedEmail });
          setLocalBackup({ autoSync, email: trimmedEmail });
          setInitialAutoSync(autoSync);

          if (autoSync && !initialAutoSync) {
            toast.success('از این پس نوبت‌ها به‌صورت خودکار به تقویم اضافه می‌شوند');
          } else if (!autoSync && initialAutoSync) {
            toast.success('افزودن خودکار به تقویم غیرفعال شد');
          }
        } catch (error: any) {
          console.error(`[Ghandon-Front] Backend error during 'save_settings':`, error);
          const settingsErrorMessage = error?.response?.data?.message || 'ذخیره تنظیمات انجام نشد. لطفا دوباره تلاش کنید';
          toast.error(settingsErrorMessage);
          return;
        }
      }

      setIsEditing(false);
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
    console.info(`[Ghandon-Front] Manual email edit mode activated.`);
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
      : activeAutoSyncEnabled && iconStatus === 'success'
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
