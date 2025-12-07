type LogFunction = () => void;

const DEFAULT_TIMEOUT = 0;

export const optimizeLogging = (logFunction: LogFunction, timeout: number = DEFAULT_TIMEOUT): void => {
  if (typeof window === 'undefined') {
    logFunction();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        setTimeout(logFunction, timeout);
      },
      { timeout: 5000 },
    );
  } else {
    setTimeout(logFunction, timeout);
  }
};

export default optimizeLogging;
