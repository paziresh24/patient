import { useEffect, useState } from 'react';
import useLockScroll from './useLockScroll';
import useVirtualBack from './useVirtualBack';

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lockScroll, openScroll } = useLockScroll();

  useEffect(() => {
    return () => {
      document.querySelectorAll('#modal').length === 0 && openScroll();
      removeBack();
    };
  });

  const handleOpen = () => {
    setIsOpen(true);
    lockScroll();
    neutralizeBack();
  };
  const handleClose = () => {
    setIsOpen(false);
    document.querySelectorAll('#modal').length === 1 && openScroll();
    removeBack();
  };

  const { neutralizeBack, removeBack } = useVirtualBack({
    handleClose,
  });

  return {
    handleOpen,
    handleClose,
    modalProps: {
      isOpen: isOpen,
      onClose: handleClose,
    },
  };
};

export default useModal;
