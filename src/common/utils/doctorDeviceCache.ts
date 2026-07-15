import { isDoctorHomeRedirectPath } from './doctorHomePaths';

export const DOCTOR_DEVICE_CACHE_KEY = 'doctor-home-device';

export const setDoctorDeviceCache = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOCTOR_DEVICE_CACHE_KEY, '1');
};

export const clearDoctorDeviceCache = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DOCTOR_DEVICE_CACHE_KEY);
};

export const isDoctorDeviceCached = () =>
  typeof window !== 'undefined' && localStorage.getItem(DOCTOR_DEVICE_CACHE_KEY) === '1';

/** Mobile cold load / refresh only — desktop never auto-redirects. */
export const shouldRedirectCachedDoctorHome = () => {
  if (typeof window === 'undefined') return false;
  if (!isDoctorDeviceCached()) return false;
  if (!window.matchMedia('(max-width: 767px)').matches) return false;
  return isDoctorHomeRedirectPath(window.location.pathname);
};

export const redirectCachedDoctorHome = () => {
  if (!shouldRedirectCachedDoctorHome()) return false;
  window.location.replace('/_/');
  return true;
};

/** Runs before React hydrates — mobile only; handles trailingSlash (/apphome/). */
export const DOCTOR_HOME_INLINE_REDIRECT_SCRIPT =
  "(function(){try{var k='" +
  DOCTOR_DEVICE_CACHE_KEY +
  "';if(localStorage.getItem(k)!=='1')return;if(!window.matchMedia('(max-width:767px)').matches)return;var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);if(!p)p='/';if(p==='/'||p==='/apphome')location.replace('/_/');}catch(e){}})();";
