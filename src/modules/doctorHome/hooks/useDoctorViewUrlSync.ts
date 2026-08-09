import { isAppHomePath, normalizeHomePathname } from '@/common/utils/doctorHomePaths';
import { type DoctorViewMode } from '../store/viewMode';

export const HOME_ROUTES = ['/', '/apphome'];
export const DOCTOR_HOME_ROUTES = ['/_', '/_/'];

export const modeFromPath = (pathname: string): DoctorViewMode | null => {
  const homePath = normalizeHomePathname(pathname);
  if (homePath === '/' || homePath === '/apphome') return 'patient';
  if (DOCTOR_HOME_ROUTES.includes(pathname) || pathname === '/_/') return 'doctor';
  return null;
};

export const normalizeDoctorHomePath = (pathname: string) => (pathname === '/_' ? '/_/' : pathname);

/** Patient home: / or /apphome depending on where the user entered from. */
export const getDoctorViewTargetPath = (mode: DoctorViewMode, currentPathname?: string) => {
  if (mode === 'doctor') return '/_/';
  if (currentPathname && isAppHomePath(currentPathname)) return '/apphome';
  return '/';
};

/**
 * Mode is owned by explicit switcher clicks (sessionStorage).
 * Do not sync store ← URL; that fought mobile redirect and caused bounce loops.
 */
export const useDoctorViewUrlSync = (_enabled: boolean) => {
  // no-op — active tab is derived from pathname in DoctorViewSwitcher
};
