import { useCallback, useRef } from 'react';
import { modalBackManager } from './modalBackManager';

type UseVirtualBackArgs = { handleClose: () => void };

const useVirtualBack = ({ handleClose }: UseVirtualBackArgs) => {
  const idRef = useRef<string | null>(null);

  const neutralizeBack = useCallback(() => {
    if (typeof window === 'undefined' || idRef.current) return;
    const { id } = modalBackManager.open(() => {
      idRef.current = null;
      handleClose();
    });
    idRef.current = id;
  }, [handleClose]);

  const programmaticBack = useCallback(() => {
    if (!idRef.current) return;
    modalBackManager.programmaticBack(idRef.current);
  }, []);

  const cleanupWithoutBack = useCallback(() => {
    if (!idRef.current) return;
    modalBackManager.programmaticBack(idRef.current); // برای وسطی‌ها فقط حذف می‌کند
    idRef.current = null;
  }, []);

  return { neutralizeBack, programmaticBack, cleanupWithoutBack };
};

export default useVirtualBack;
