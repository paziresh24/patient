import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useApplication = () => {
  const { query } = useRouter();
  const isApplication = useMemo(() => query.application ?? window.matchMedia('(display-mode: standalone)')?.matches, []);

  return isApplication;
};

export default useApplication;
