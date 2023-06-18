export const isPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    document.referrer.includes('android-app://') ||
    document.referrer.includes('ios-app://')
  );
};
