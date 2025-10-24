import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { isAuthenticationError } from '@/common/utils/errorHandler';
import { useCallback } from 'react';

export const useAuthErrorHandler = () => {
  const logout = useUserInfoStore(state => state.logout);
  
  const handleAuthError = useCallback((error: any) => {
    console.log('Auth error handler called:', {
      isAuthError: isAuthenticationError(error),
      status: error?.response?.status,
      message: error?.response?.data?.message,
      url: error?.config?.url,
      timestamp: new Date().toISOString()
    });
    
    // فقط در صورت واقعی authentication error، logout کنیم
    if (isAuthenticationError(error)) {
      console.log('Real authentication error detected, logging out user');
      logout();
      return true; // نشان می‌دهد که logout انجام شده
    }
    
    return false; // نشان می‌دهد که logout انجام نشده
  }, [logout]);
  
  return { handleAuthError };
};
