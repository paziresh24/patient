import { isDoctorHomeRedirectPath } from './doctorHomePaths';
import { clearDoctorShellCache, ensureDoctorShellCache, prefetchDoctorShellDocuments } from './doctorShellCache';

export const DOCTOR_DEVICE_CACHE_EVENT = 'p24:doctor-device-cache';
export const DOCTOR_DEVICE_CACHE_KEY = 'doctor-home-device';

const notifyDoctorDeviceCache = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(DOCTOR_DEVICE_CACHE_EVENT));
};
/** Set on <html> before React so CSS can hide boot loading without hydration mismatch. */
export const DOCTOR_DEVICE_DOM_ATTR = 'data-doctor-device';

const syncDoctorDeviceDomAttr = (enabled: boolean) => {
  if (typeof document === 'undefined') return;
  try {
    if (enabled) document.documentElement.setAttribute(DOCTOR_DEVICE_DOM_ATTR, '1');
    else document.documentElement.removeAttribute(DOCTOR_DEVICE_DOM_ATTR);
  } catch {
    // ignore
  }
};

export const setDoctorDeviceCache = () => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOCTOR_DEVICE_CACHE_KEY, '1');
  syncDoctorDeviceDomAttr(true);
  ensureDoctorShellCache();
  prefetchDoctorShellDocuments();
  notifyDoctorDeviceCache();
};

export const clearDoctorDeviceCache = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DOCTOR_DEVICE_CACHE_KEY);
  syncDoctorDeviceDomAttr(false);
  void clearDoctorShellCache();
  notifyDoctorDeviceCache();
};

export const isDoctorDeviceCached = () =>
  typeof window !== 'undefined' && localStorage.getItem(DOCTOR_DEVICE_CACHE_KEY) === '1';

export const isDoctorDeviceMarkedInDom = () =>
  typeof document !== 'undefined' && document.documentElement.getAttribute(DOCTOR_DEVICE_DOM_ATTR) === '1';

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

/** Marks <html data-doctor-device="1"> before React when LS flag is set (all paths). */
export const DOCTOR_HOME_INLINE_DEVICE_MARK_SCRIPT =
  "(function(){try{var k='" +
  DOCTOR_DEVICE_CACHE_KEY +
  "';if(localStorage.getItem(k)==='1')document.documentElement.setAttribute('" +
  DOCTOR_DEVICE_DOM_ATTR +
  "','1');}catch(e){}})();";

/** Runs before React hydrates — mobile only; handles trailingSlash (/apphome/). */
export const DOCTOR_HOME_INLINE_REDIRECT_SCRIPT =
  "(function(){try{var k='" +
  DOCTOR_DEVICE_CACHE_KEY +
  "';if(localStorage.getItem(k)!=='1')return;if(!window.matchMedia('(max-width:767px)').matches)return;var p=location.pathname;if(p.length>1&&p.charAt(p.length-1)==='/')p=p.slice(0,-1);if(!p)p='/';if(p!=='/'&&p!=='/apphome')return;var h='/_/';try{var l=document.createElement('link');l.rel='prefetch';l.href=h;document.head.appendChild(l);}catch(e){}try{var hn=location.hostname;if(hn!=='localhost'&&hn!=='127.0.0.1'&&hn!=='local.paziresh24.com'&&'serviceWorker' in navigator){navigator.serviceWorker.register('/doctor-shell-sw.js',{scope:'/'}).catch(function(){});}}catch(e){}location.replace(h);}catch(e){}})();";
