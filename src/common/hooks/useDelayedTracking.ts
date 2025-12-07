import { useEffect, useState } from 'react';

export const useDelayedTracking = () => {
  const [shouldLoadTracking, setShouldLoadTracking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadTracking = () => {
      setShouldLoadTracking(true);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadTracking, { timeout: 5000 });
    } else {
      setTimeout(loadTracking, 5000);
    }
  }, []);

  return shouldLoadTracking;
};

export const loadScriptOnce = (
  src: string,
  id?: string,
  options?: { async?: boolean; defer?: boolean; onLoad?: () => void },
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const existingScript = id
      ? document.getElementById(id)
      : document.querySelector(`script[src="${src}"]`);

    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    if (id) script.id = id;
    script.src = src;
    script.async = options?.async ?? true;
    script.defer = options?.defer ?? false;

    script.onload = () => {
      options?.onLoad?.();
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });
};

export const loadInlineScriptOnce = (
  code: string,
  id: string,
  options?: { onLoad?: () => void },
): void => {
  if (typeof window === 'undefined') return;

  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.innerHTML = code;
  script.async = true;

  script.onload = () => {
    options?.onLoad?.();
  };

  document.head.appendChild(script);
};

