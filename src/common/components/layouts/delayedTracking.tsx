import { useDelayedTracking } from '@/common/hooks/useDelayedTracking';
import { useEffect } from 'react';

export const DelayedTracking = () => {
  const shouldLoad = useDelayedTracking();

  useEffect(() => {
    if (!shouldLoad || typeof window === 'undefined') return;
  }, [shouldLoad]);

  return null;
};

