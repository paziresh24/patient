/** Patient home routes that mobile doctors auto-redirect away from (unless SPA patient switch). */
export const DOCTOR_HOME_REDIRECT_PATHS = ['/', '/apphome'] as const;

export const normalizeHomePathname = (pathname: string) => {
  const withoutTrailing = pathname.replace(/\/$/, '');
  return withoutTrailing === '' ? '/' : withoutTrailing;
};

export const isDoctorHomeRedirectPath = (pathname: string) =>
  (DOCTOR_HOME_REDIRECT_PATHS as readonly string[]).includes(normalizeHomePathname(pathname));

export const isAppHomePath = (pathname: string) => normalizeHomePathname(pathname) === '/apphome';
