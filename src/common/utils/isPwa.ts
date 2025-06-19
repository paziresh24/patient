export const isPWA = () => {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      document.referrer.includes('android-app://') ||
      document.referrer.includes('ios-app://'))
  );
};
