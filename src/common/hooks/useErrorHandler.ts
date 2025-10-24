import { useCallback } from 'react';
import { useAuthErrorHandler } from './useAuthErrorHandler';
import { useNetworkErrorHandler } from './useNetworkErrorHandler';
import { getErrorMessage } from '@/common/utils/errorHandler';
import { toast } from 'react-hot-toast';

export const useErrorHandler = () => {
  const { handleAuthError } = useAuthErrorHandler();
  const { handleNetworkError } = useNetworkErrorHandler();
  
  const handleError = useCallback((error: any, options: {
    showToast?: boolean;
    retryFn?: () => void;
    customMessage?: string;
  } = {}) => {
    const { showToast = true, retryFn, customMessage } = options;
    
    // ابتدا authentication error را بررسی کنیم
    const wasLoggedOut = handleAuthError(error);
    
    // اگر logout شده، دیگر toast نشان ندهیم
    if (wasLoggedOut) {
      return;
    }
    
    // سپس network error را بررسی کنیم
    const wasNetworkError = handleNetworkError(error, retryFn);
    
    // اگر network error نبود و toast باید نشان داده شود
    if (!wasNetworkError && showToast) {
      const message = customMessage || getErrorMessage(error);
      toast.error(message);
    }
  }, [handleAuthError, handleNetworkError]);
  
  return { handleError };
};
