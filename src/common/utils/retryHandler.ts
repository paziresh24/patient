import axios from 'axios';

export interface RetryConfig {
  maxRetries?: number;
  retryDelay?: number;
  retryCondition?: (error: any) => boolean;
}

const defaultRetryConfig: Required<RetryConfig> = {
  maxRetries: 3,
  retryDelay: 1000,
  retryCondition: (error) => {
    // فقط برای خطاهای شبکه retry کنیم
    return (
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      error.message?.includes('timeout') ||
      (error.response?.status >= 500 && error.response?.status < 600)
    );
  }
};

export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> => {
  const { maxRetries, retryDelay, retryCondition } = { ...defaultRetryConfig, ...config };
  
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // اگر آخرین تلاش است یا شرط retry برقرار نیست، خطا را throw کنیم
      if (attempt === maxRetries || !retryCondition(error)) {
        throw error;
      }
      
      // اگر خطای authentication است، retry نکنیم
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw error;
      }
      
      console.log(`Request failed, retrying... (attempt ${attempt + 1}/${maxRetries + 1})`);
      
      // انتظار قبل از retry
      await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
    }
  }
  
  throw lastError;
};

export const isRetryableError = (error: any): boolean => {
  if (!axios.isAxiosError(error)) return false;
  
  // خطاهای شبکه
  if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') return true;
  
  // خطاهای timeout
  if (error.message?.includes('timeout')) return true;
  
  // خطاهای سرور (5xx)
  if (error.response?.status >= 500 && error.response?.status < 600) return true;
  
  // خطاهای rate limiting (429)
  if (error.response?.status === 429) return true;
  
  return false;
};
