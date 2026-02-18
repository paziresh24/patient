import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { subscribeNotification } from '@/common/apis/services/notifications/subscribe';

const NOTIFICATION_DISMISSED_KEY = 'notification_permission_dismissed_at';

const isSupported = () =>
  typeof window !== 'undefined' && window.rasan?.push?.isSupported() === true;

const hasPermission = async (): Promise<boolean> => {
  if (!isSupported()) return false;
  return window.rasan!.push.hasPermission();
};

const isDenied = () =>
  typeof Notification !== 'undefined' && Notification.permission === 'denied';

const saveDismissedTime = () => {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  localStorage.setItem(NOTIFICATION_DISMISSED_KEY, now.toString());
};

const clearDismissedTime = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(NOTIFICATION_DISMISSED_KEY);
};

const shouldShowModal = (): boolean => {
  if (typeof window === 'undefined') return true;
  const dismissedAt = localStorage.getItem(NOTIFICATION_DISMISSED_KEY);
  if (!dismissedAt) return true;
  
  const dismissedTime = parseInt(dismissedAt, 10);
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours
  
  return now - dismissedTime >= oneDayInMs;
};

export interface UseNotificationPermissionOptions {
  autoSubscribe?: boolean;
  onSuccess?: () => void;
}

export interface UseNotificationPermissionReturn {
  isSupported: boolean;
  hasPermission: boolean;
  isDenied: boolean;
  isLoading: boolean;
  showModal: boolean;
  showDeniedModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  dismissModal: () => void;
  requestPermission: () => Promise<void>;
  checkPermission: () => Promise<void>;
}

export const useNotificationPermission = (
  options?: UseNotificationPermissionOptions
): UseNotificationPermissionReturn => {
  const { autoSubscribe = true, onSuccess } = options || {};

  const [isSupportedState, setIsSupportedState] = useState(false);
  const [hasPermissionState, setHasPermissionState] = useState(false);
  const [isDeniedState, setIsDeniedState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeniedModal, setShowDeniedModal] = useState(false);

  const hasAutoSubscribedRef = useRef(false);

  const checkPermission = useCallback(async () => {
    const supported = isSupported();
    setIsSupportedState(supported);
    if (!supported) {
      setHasPermissionState(false);
      setIsDeniedState(false);
      return;
    }
    const permission = await hasPermission();
    setHasPermissionState(permission);
    setIsDeniedState(isDenied());
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!isSupported()) {
        toast.error('نوتیفیکشن در مرورگر شما پشتیبانی نمی‌شود');
        return;
      }
      if (isDenied()) {
        setShowModal(false);
        setShowDeniedModal(true);
        return;
      }

      const permissionResult = await window.rasan!.push.requestPermission();

      if (permissionResult?.device_token) {
        await subscribeNotification({
          device_token: permissionResult.device_token,
          platform: permissionResult.platform,
          os: permissionResult.os,
        });
        const hadPermission = await hasPermission();
        setHasPermissionState(hadPermission);
        if (hadPermission) {
          clearDismissedTime(); // Clear dismissed time when permission is granted
        }
        toast.success(hadPermission ? 'نوتیفیکشن فعال است' : 'دسترسی نوتیفیکشن با موفقیت فعال شد');
        onSuccess?.();
        setShowModal(false);
      } else {
        if (isDenied()) {
          setShowModal(false);
          setShowDeniedModal(true);
        } else {
          toast.error('دسترسی نوتیفیکشن رد شد');
        }
      }
    } catch {
      toast.error('خطا در فعال‌سازی نوتیفیکشن');
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess]);

  const autoSubscribeIfGranted = useCallback(async () => {
    if (!autoSubscribe || hasAutoSubscribedRef.current || !isSupported()) return;
    try {
      const permission = await hasPermission();
      if (permission) {
        hasAutoSubscribedRef.current = true;
        const permissionResult = await window.rasan!.push.requestPermission();
        if (permissionResult?.device_token) {
          await subscribeNotification({
            device_token: permissionResult.device_token,
            platform: permissionResult.platform,
            os: permissionResult.os,
          });
        }
      } else {
        hasAutoSubscribedRef.current = false;
      }
    } catch {}
  }, [autoSubscribe]);

  useEffect(() => {
    if (!hasPermissionState) hasAutoSubscribedRef.current = false;
  }, [hasPermissionState]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    if (hasPermissionState && autoSubscribe) autoSubscribeIfGranted();
  }, [hasPermissionState, autoSubscribe, autoSubscribeIfGranted]);

  const openModal = useCallback(() => {
    if (shouldShowModal()) {
      setShowModal(true);
    }
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setShowDeniedModal(false);
  }, []);

  const dismissModal = useCallback(() => {
    saveDismissedTime();
    closeModal();
  }, [closeModal]);

  return {
    isSupported: isSupportedState,
    hasPermission: hasPermissionState,
    isDenied: isDeniedState,
    isLoading,
    showModal,
    showDeniedModal,
    openModal,
    closeModal,
    dismissModal,
    requestPermission,
    checkPermission,
  };
};

export default useNotificationPermission;
