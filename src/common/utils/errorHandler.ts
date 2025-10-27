import axios from 'axios';
import { isTokenExpired } from './tokenValidator';

export const isAuthenticationError = (error: any): boolean => {
  if (!axios.isAxiosError(error)) return false;
  
  const status = error.response?.status;
  if (status !== 401) return false;
  
  const errorData = error.response?.data;
  const errorMessage = (errorData?.message || '').toLowerCase();
  
  // بررسی کلمات کلیدی که نشان‌دهنده authentication error واقعی هستند
  const authKeywords = [
    'token',
    'expired',
    'invalid',
    'unauthorized',
    'authentication',
    'login',
    'credential',
    'session'
  ];
  
  const hasAuthKeyword = authKeywords.some(keyword => errorMessage.includes(keyword));
  
  // اگر token واقعاً منقضی شده، authentication error است
  const tokenExpired = isTokenExpired();
  
  return hasAuthKeyword || tokenExpired;
};

export const getErrorMessage = (error: any): string => {
  // اگر error یک string باشد
  if (typeof error === 'string') {
    return error;
  }

  // اگر error یک object باشد و message داشته باشد
  if (error && typeof error === 'object') {
    // بررسی message در error
    if (error.message) {
      return error.message;
    }

    // بررسی message در response.data
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // بررسی details در response.data
    if (error.response?.data?.details) {
      const details = error.response.data.details;
      if (typeof details === 'string') {
        return details;
      }
      if (typeof details === 'object') {
        // اگر details یک object باشد، اولین value را برمی‌گردانیم
        const firstDetail = Object.values(details)[0];
        if (typeof firstDetail === 'string') {
          return firstDetail;
        }
      }
    }

    // بررسی status code های مختلف
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      
      switch (status) {
        case 400:
          return 'درخواست نامعتبر است. لطفاً اطلاعات را بررسی کنید.';
        case 401:
          return 'احراز هویت ناموفق بود. لطفاً دوباره تلاش کنید.';
        case 403:
          return 'دسترسی غیرمجاز است.';
        case 404:
          return 'منبع مورد نظر یافت نشد.';
        case 408:
          return 'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.';
        case 429:
          return 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً کمی صبر کنید.';
        case 500:
          return 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.';
        case 502:
        case 503:
        case 504:
          return 'سرور در دسترس نیست. لطفاً بعداً تلاش کنید.';
        default:
          if (error.code === 'ERR_NETWORK') {
            return 'خطا در اتصال به اینترنت. لطفاً اتصال خود را بررسی کنید.';
          }
          if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
            return 'زمان درخواست به پایان رسید. لطفاً دوباره تلاش کنید.';
          }
          break;
      }
    }
  }

  // پیام پیش‌فرض
  return 'خطایی پیش آمده است. لطفاً دوباره تلاش کنید.';
};
