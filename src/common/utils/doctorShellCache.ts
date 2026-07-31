import { isLocalDevHost } from './isLocalDevHost';
import { isPWA } from './isPwa';

const SW_PATH = '/doctor-shell-sw.js';
const CACHE_NAME = 'p24-doctor-shell-v1';

const isServiceWorkerSupported = () => typeof window !== 'undefined' && 'serviceWorker' in navigator;

export const ensureDoctorShellCache = () => {
  if (!isServiceWorkerSupported() || isLocalDevHost() || !isPWA()) return;

  void navigator.serviceWorker.register(SW_PATH, { scope: '/' }).catch(() => undefined);
};

export const clearDoctorShellCache = async () => {
  if (!isServiceWorkerSupported()) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter(registration => registration.active?.scriptURL.includes('doctor-shell-sw.js'))
      .map(registration => registration.unregister()),
  );

  if ('caches' in window) {
    await caches.delete(CACHE_NAME);
  }
};

export const prefetchDoctorShellDocuments = () => {
  if (typeof window === 'undefined') return;

  ['/apphome/', '/_/'].forEach(path => {
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    } catch {
      // ignore
    }
  });
};
