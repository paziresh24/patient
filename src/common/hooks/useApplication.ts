import { isPWA } from '../utils/isPwa';

export const useApplication = () => {
  if (typeof window === 'undefined') return false;

  return isPWA();
};

export default useApplication;
