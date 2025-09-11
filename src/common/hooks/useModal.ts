import { useCallback, useEffect, useState } from 'react';
import useLockScroll from './useLockScroll';
import useVirtualBack from './useVirtualBack';

type OnClose = () => void;
type ModalProps = { isOpen: boolean; onClose: OnClose };
type HookProps = { onClose?: OnClose };

export const useModal = (props?: HookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { lockScroll, openScroll } = useLockScroll();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (document.querySelectorAll('#modal').length === 1) {
      openScroll();
    }
    removeBack();
  }, [openScroll]);

  const { neutralizeBack, removeBack } = useVirtualBack({ handleClose });

  useEffect(() => {
    return () => {
      if (document.querySelectorAll('#modal').length === 0) {
        openScroll();
      }
      removeBack();
    };
  }, [openScroll, removeBack]);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    lockScroll();
    neutralizeBack();
  }, [lockScroll, neutralizeBack]);

  return {
    handleOpen,
    handleClose,
    modalProps: {
      isOpen,
      onClose: () => {
        handleClose();
        props?.onClose?.();
      },
    } as ModalProps,
  };
};

export default useModal;
