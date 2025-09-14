// useModal.ts
import { useCallback, useEffect, useState } from 'react';
import useLockScroll from './useLockScroll';
import useVirtualBack from './useVirtualBack';

type OnClose = () => void;
type ModalProps = { isOpen: boolean; onClose: () => void };
type HookProps = { onClose?: OnClose };

export const useModal = (props?: HookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { lockScroll, openScroll } = useLockScroll();

  const { neutralizeBack, programmaticBack, cleanupWithoutBack } = useVirtualBack({
    handleClose: () => {
      // این فقط در popstate صدا می‌خورد (back واقعی یا back برنامه‌ای)
      setIsOpen(false);
      openScroll();
    },
  });

  useEffect(() => {
    return () => {
      // اگر آن‌ماونت شد و مودال هنوز باز بود، بدون back فقط تمیز کن
      if (isOpen) {
        openScroll();
        cleanupWithoutBack();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    lockScroll();
    neutralizeBack();
  }, [lockScroll, neutralizeBack]);

  const handleClose = useCallback(() => {
    // ⚠️ دیگر setIsOpen/openScroll اینجا نزن!
    // فقط back بزن تا popstate بیاید و بالایی بسته شود.
    programmaticBack();
    props?.onClose?.();
  }, [programmaticBack, props]);

  return {
    handleOpen,
    handleClose,
    modalProps: {
      isOpen,
      onClose: handleClose, // همان
    } as ModalProps,
  };
};

export default useModal;
