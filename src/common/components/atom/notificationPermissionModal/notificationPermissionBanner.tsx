import { useState } from 'react';
import { useNotificationPermission } from '@/common/hooks/useNotificationPermission';
import { NotificationPermissionModal } from './notificationPermissionModal';

interface NotificationPermissionBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export const NotificationPermissionBanner = ({ onDismiss, className = '' }: NotificationPermissionBannerProps) => {
  const { isSupported, hasPermission, showModal, openModal, closeModal, checkPermission } = useNotificationPermission({
    autoSubscribe: false,
  });
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleSuccess = () => {
    checkPermission();
    setIsDismissed(true);
  };

  if (!isSupported || hasPermission || isDismissed) {
    return null;
  }

  return (
    <>
      <div className={`bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="bg-primary rounded-full p-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 mb-1">از نوبت‌های خود با خبر شوید</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              با فعال‌سازی نوتیفیکشن، یادآوری نوبت‌ها و اطلاع از تغییرات را دریافت کنید.
            </p>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={openModal}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
            >
              فعال‌سازی
            </button>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-600 p-2 transition-colors"
              aria-label="بستن"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <NotificationPermissionModal isOpen={showModal} onClose={closeModal} onSuccess={handleSuccess} />
    </>
  );
};

export default NotificationPermissionBanner;
