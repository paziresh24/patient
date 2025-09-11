import { useCallback, useRef } from 'react';

type UseVirtualBackArgs = { handleClose: () => void };

const useVirtualBack = ({ handleClose }: UseVirtualBackArgs) => {
  const activeRef = useRef(false);
  const skipBackOnProgrammaticCloseRef = useRef(false);

  const onPopState = useCallback(() => {
    if (!activeRef.current) return;
    skipBackOnProgrammaticCloseRef.current = true;
    activeRef.current = false;
    handleClose();
  }, [handleClose]);

  const neutralizeBack = useCallback(() => {
    if (typeof window === 'undefined' || activeRef.current) return;
    window.history.pushState({ __modal: true }, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    activeRef.current = true;
  }, [onPopState]);

  const removeBack = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (activeRef.current) {
      window.removeEventListener('popstate', onPopState);
      activeRef.current = false;
      if (!skipBackOnProgrammaticCloseRef.current) {
        window.history.back();
      }
    }
    skipBackOnProgrammaticCloseRef.current = false;
  }, [onPopState]);

  return { neutralizeBack, removeBack };
};

export default useVirtualBack;
