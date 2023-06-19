import { isPWA } from './isPwa';

export const isNativeWebView = () => {
  if (isPWA()) return false;
  const userAgent = window.navigator.userAgent.toLowerCase();

  return (userAgent.includes('android') && userAgent.includes('wv')) || (userAgent.includes('iphone') && !userAgent.includes('safari'));
};
