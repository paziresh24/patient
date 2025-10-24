import { getCookie } from 'cookies-next';

export interface TokenInfo {
  isValid: boolean;
  isExpired: boolean;
  expiresAt?: Date;
  timeUntilExpiry?: number;
}

export const validateToken = (): TokenInfo => {
  const token = getCookie('token');
  
  if (!token) {
    return {
      isValid: false,
      isExpired: true
    };
  }
  
  try {
    // JWT token را decode کنیم (بدون verification)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        isValid: false,
        isExpired: true
      };
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    const exp = payload.exp;
    
    if (!exp) {
      return {
        isValid: true,
        isExpired: false
      };
    }
    
    const expiresAt = new Date(exp * 1000);
    const timeUntilExpiry = exp - now;
    
    return {
      isValid: true,
      isExpired: exp < now,
      expiresAt,
      timeUntilExpiry
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      isValid: false,
      isExpired: true
    };
  }
};

export const isTokenExpired = (): boolean => {
  const tokenInfo = validateToken();
  return tokenInfo.isExpired;
};

export const getTokenExpiryInfo = (): { expiresAt?: Date; timeUntilExpiry?: number } => {
  const tokenInfo = validateToken();
  return {
    expiresAt: tokenInfo.expiresAt,
    timeUntilExpiry: tokenInfo.timeUntilExpiry
  };
};

export const shouldRefreshToken = (): boolean => {
  const tokenInfo = validateToken();
  
  if (!tokenInfo.isValid || tokenInfo.isExpired) {
    return false;
  }
  
  // اگر کمتر از 7 روز تا انقضا باقی مانده، refresh کنیم
  const sevenDaysInSeconds = 7 * 24 * 60 * 60;
  return (tokenInfo.timeUntilExpiry || 0) < sevenDaysInSeconds;
};
