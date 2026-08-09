/**
 * Previously redirected /_/ → / when store mode was "patient".
 * That broke desktop: opening /_/ with a stale patient sessionStorage bounced to home.
 *
 * Navigation is owned by DoctorViewSwitcher (SPA router.replace).
 * URL is source of truth; do not auto-bounce away from /_/.
 */
export const useDoctorViewRouteGuard = () => {
  // no-op — kept for call-site compatibility
};
