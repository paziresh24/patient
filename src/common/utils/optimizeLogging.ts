type LogFunction = () => void;

const DEFAULT_TIMEOUT = 0;

export const optimizeLogging = (logFunction: LogFunction, timeout: number = DEFAULT_TIMEOUT): void => {
  const run = () => {
    try {
      const result = logFunction() as unknown;
      // sendEvent returns a Promise; swallow HEC/JSON parse failures.
      Promise.resolve(result).catch(() => undefined);
    } catch {
      // ignore sync logging failures
    }
  };

  if (typeof window === 'undefined') {
    run();
    return;
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        setTimeout(run, timeout);
      },
      { timeout: 5000 },
    );
  } else {
    setTimeout(run, timeout);
  }
};

export default optimizeLogging;
