import Modal from '../modal';
import { getBrowserType, BROWSER_GUIDES } from './browserGuides';

interface NotificationPermissionDeniedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPermissionDeniedModal = ({ isOpen, onClose }: NotificationPermissionDeniedModalProps) => {
  const browser = getBrowserType();
  const guide = BROWSER_GUIDES[browser];

  return (
    <Modal isOpen={isOpen} onClose={onClose} noHeader noLine className="!max-w-md">
      <div className="flex flex-col items-center text-center space-y-6 py-4">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-slate-800">دسترسی نوتیفیکشن مسدود شده</h3>

        <p className="text-slate-600 leading-7 text-sm">
          قبلاً دسترسی اعلان‌ها را رد کرده‌اید. برای فعال‌سازی، طبق مراحل زیر در تنظیمات{' '}
          {browser === 'pwa-android' ? 'اندروید' : 'مرورگر'} عمل کنید:
        </p>

        <div className="w-full text-right bg-amber-50 rounded-lg p-4 border border-amber-100">
          <p className="text-amber-800 font-semibold text-sm mb-3">{guide.title}</p>
          <ol className="space-y-2">
            {guide.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="flex-shrink-0 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-bold text-xs">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-slate-500 text-xs">
          {browser === 'pwa-android'
            ? 'بعد از تغییر تنظیمات، اپ را کامل ببندید و دوباره باز کنید.'
            : 'بعد از انجام مراحل، صفحه را رفرش یا تب را دوباره باز کنید.'}
        </p>

        <button
          onClick={onClose}
          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-lg font-medium transition-colors"
        >
          متوجه شدم
        </button>
      </div>
    </Modal>
  );
};
