import { ReactNode, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Modal from '../components/atom/modal';
import { ModalProps } from '../components/atom/modal/modal';
import useModal from './useModal';

export const useSetupAppBridge = () => {
  const { handleOpen, handleClose, modalProps } = useModal();
  const modalChildren = useRef('');
  const modalTtile = useRef('');
  const modalNoHeader = useRef(false);

  const modal = {
    open: ({ title, children }: { title: string; children: string }) => {
      handleClose();
      modalChildren.current = children ?? '';
      modalTtile.current = title ?? '';
      if (!title) {
        modalNoHeader.current = true;
      }
      setTimeout(() => {
        handleOpen();
      }, 100);
    },
    close: handleClose,
  };

  const appBridge = {
    toast: toast,
    modal: modal,
  };

  useEffect(() => {
    window.paziresh24 = appBridge;
  }, []);

  return {
    modalProps: {
      noHeader: modalNoHeader.current,
      children: modalChildren.current,
      title: modalTtile.current,
      ...modalProps,
    } as ModalProps,
  };
};

export const AppBridge = ({ modalProps, children }: { children: ReactNode; modalProps: ModalProps }) => {
  return (
    <>
      {children}
      <Modal {...modalProps} bodyClassName="p-0">
        <div dangerouslySetInnerHTML={{ __html: modalProps.children as string }}></div>
      </Modal>
    </>
  );
};
