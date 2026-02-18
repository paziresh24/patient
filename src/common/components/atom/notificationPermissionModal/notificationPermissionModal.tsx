import Modal from '../modal';
import Button from '../button';
import { useNotificationPermission } from '@/common/hooks/useNotificationPermission';
import { NotificationPermissionDeniedModal } from './notificationPermissionDeniedModal';

interface NotificationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const NotificationPermissionModal = ({ isOpen, onClose, onSuccess }: NotificationPermissionModalProps) => {
  const { isLoading, showDeniedModal, requestPermission, closeModal, dismissModal } = useNotificationPermission({
    autoSubscribe: false,
    onSuccess: () => {
      onSuccess?.();
      onClose();
    },
  });

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} noHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1 items-start">
              <h3 className="font-bold text-slate-800">اعلان‌ها را فعال کنید</h3>
              <p className="text-slate-600 text-sm">
                برای اطلاع فوری از نوبت‌ها، پیام‌ها و تسویه‌حساب‌ها، اعلان‌ها را روشن کنید.              </p>
            </div>
          </div>

          {/* <div className="w-full space-y-3 text-right">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">اطلاع از نوبت‌های جدید</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">اطلاع از پیام های جدید</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">اطلاع از نظرات جدید</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">اطلاع از تسویه حساب خودکار</p>
              </div>
            </div>
          </div> */}

          <div className="w-full flex flex-col gap-1">
            <Button onClick={requestPermission} loading={isLoading}>
              فعال‌سازی
            </Button>
            <Button
              onClick={() => {
                dismissModal();
                onClose();
              }}
              disabled={isLoading}
              variant="text"
            >
              فعلاً نه
            </Button>
          </div>
        </div>
      </Modal>

      <NotificationPermissionDeniedModal isOpen={showDeniedModal} onClose={closeModal} />
    </>
  );
};

export default NotificationPermissionModal;
