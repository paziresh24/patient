import Button from '@/common/components/atom/button';
import Text from '@/common/components/atom/text';
import ErrorIcon from '@/common/components/icons/error';
import WarningIcon from '@/common/components/icons/warning';
import { useRouter } from 'next/router';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

interface ReceiptErrorProps {
  statusCode: number;
  message?: string;
  onRetry?: () => void;
}

const ReceiptError = ({ statusCode, message, onRetry }: ReceiptErrorProps) => {
  const router = useRouter();
  const { handleOpenLoginModal } = useLoginModalContext();
  const isLogin = useUserInfoStore(state => state.isLogin);

  const getErrorConfig = (code: number) => {
    switch (code) {
      case 400:
        return {
          icon: <ErrorIcon className="text-red-500 w-16 h-16" />,
          title: 'درخواست نامعتبر',
          description: 'اطلاعات ارسالی صحیح نیست. لطفاً دوباره تلاش کنید.',
          primaryAction: { text: 'تلاش مجدد', action: onRetry },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
      case 401:
        return {
          icon: <WarningIcon className="text-orange-500 w-16 h-16" />,
          title: 'نیاز به ورود',
          description: 'برای مشاهده رسید نوبت باید وارد حساب کاربری خود شوید.',
          primaryAction: { 
            text: 'ورود به حساب', 
            action: () => handleOpenLoginModal({ state: true }) 
          },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
      case 403:
        return {
          icon: <ErrorIcon className="text-red-500 w-16 h-16" />,
          title: 'عدم دسترسی',
          description: 'شما دسترسی لازم برای مشاهده این رسید را ندارید.',
          primaryAction: { text: 'بازگشت', action: () => router.push('/') },
          secondaryAction: { text: 'نوبت‌های من', action: () => router.push('/patient/appointments') },
        };
      case 404:
        return {
          icon: <ErrorIcon className="text-red-500 w-16 h-16" />,
          title: 'نوبت یافت نشد',
          description: 'رسید نوبت مورد نظر یافت نشد یا ممکن است حذف شده باشد.',
          primaryAction: { text: 'نوبت‌های من', action: () => router.push('/patient/appointments') },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
      case 409:
        return {
          icon: <WarningIcon className="text-orange-500 w-16 h-16" />,
          title: 'تداخل در اطلاعات',
          description: 'اطلاعات نوبت با داده‌های موجود تداخل دارد. لطفاً دوباره تلاش کنید.',
          primaryAction: { text: 'تلاش مجدد', action: onRetry },
          secondaryAction: { text: 'نوبت‌های من', action: () => router.push('/patient/appointments') },
        };
      case 422:
        return {
          icon: <ErrorIcon className="text-red-500 w-16 h-16" />,
          title: 'خطای اعتبارسنجی',
          description: 'اطلاعات ارسالی معتبر نیست. لطفاً اطلاعات را بررسی کنید.',
          primaryAction: { text: 'تلاش مجدد', action: onRetry },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
      case 429:
        return {
          icon: <WarningIcon className="text-orange-500 w-16 h-16" />,
          title: 'محدودیت درخواست',
          description: 'تعداد درخواست‌های شما از حد مجاز بیشتر است. لطفاً کمی صبر کنید.',
          primaryAction: { text: 'تلاش مجدد', action: onRetry },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          icon: <ErrorIcon className="text-red-500 w-16 h-16" />,
          title: 'خطای سرور',
          description: 'مشکلی در سرور رخ داده است. لطفاً بعداً دوباره تلاش کنید.',
          primaryAction: { text: 'تلاش مجدد', action: onRetry },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
      default:
        return {
          icon: <ErrorIcon className="text-red-500 w-16 h-16" />,
          title: 'خطای غیرمنتظره',
          description: message || 'مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
          primaryAction: { text: 'تلاش مجدد', action: onRetry },
          secondaryAction: { text: 'بازگشت', action: () => router.push('/') },
        };
    }
  };

  const errorConfig = getErrorConfig(statusCode);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-white rounded-lg shadow-card">
      <div className="flex flex-col items-center space-y-4 text-center">
        {errorConfig.icon}
        <Text fontWeight="bold" fontSize="lg" className="text-gray-800">
          {errorConfig.title}
        </Text>
        <Text fontSize="sm" className="text-gray-600 max-w-md">
          {errorConfig.description}
        </Text>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-sm">
          {errorConfig.primaryAction && (
            <Button 
              block 
              onClick={errorConfig.primaryAction.action}
              className="order-1 sm:order-1"
            >
              {errorConfig.primaryAction.text}
            </Button>
          )}
          {errorConfig.secondaryAction && (
            <Button 
              variant="secondary" 
              block 
              onClick={errorConfig.secondaryAction.action}
              className="order-2 sm:order-2"
            >
              {errorConfig.secondaryAction.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptError;
