export const DOCTOR_DEVICE_CACHE_KEY = 'doctor-home-device';

const REDIRECT_PATHS = ['/', '/apphome'];

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

export const shouldRedirectCachedDoctorHome = () => {
  if (typeof window === 'undefined') return false;
  if (!isDoctorDeviceCached()) return false;
  if (!window.matchMedia('(max-width: 767px)').matches) return false;
  return REDIRECT_PATHS.includes(window.location.pathname);
};

export const redirectCachedDoctorHome = () => {
  if (!shouldRedirectCachedDoctorHome()) return false;
  window.location.replace('/_');
  return true;
};

/** Runs before React hydrates — must stay in sync with helpers above. */
export const DOCTOR_HOME_INLINE_REDIRECT_SCRIPT = `(function(){try{var k='${DOCTOR_DEVICE_CACHE_KEY}';if(localStorage.getItem(k)!=='1')return;if(!window.matchMedia('(max-width:767px)').matches)return;var p=location.pathname;if(p==='/'||p==='/apphome')location.replace('/_');}catch(e){}})();`;
