import { useCallback } from 'react';
import { isRetryableError } from '@/common/utils/retryHandler';
import { toast } from 'react-hot-toast';

export const useNetworkErrorHandler = () => {
  const handleNetworkError = useCallback((error: any, retryFn?: () => void) => {
    if (!isRetryableError(error)) {
      return false; // خطا قابل retry نیست
    }
    
    const errorMessage = getNetworkErrorMessage(error);
    toast.error(errorMessage, {
      duration: 5000
    });
    
    return true; // خطا handle شده
  }, []);
  
  return { handleNetworkError };
};

const getNetworkErrorMessage = (error: any): string => {
  if (error.code === 'ERR_NETWORK') {
    return 'خطا در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.';
  }
  
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.';
  }
  
  if (error.response?.status === 429) {
    return 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.';
  }
  
  if (error.response?.status >= 500 && error.response?.status < 600) {
    return 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.';
  }
  
  return 'خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.';
};
