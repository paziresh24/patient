import useResponsive from '@/common/hooks/useResponsive';
import CloseIcon from '@/components/icons/close';
import clsx from 'clsx';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: (_?: any) => void;
  children: React.ReactNode;
  title?: string;
  fullScreen?: boolean;
  bodyClassName?: string;
  noHeader?: boolean;
}

export const Modal = (props: ModalProps) => {
  const { title, isOpen, onClose, children, fullScreen, bodyClassName, noHeader = false } = props;
  const { isMobile } = useResponsive();

  const handleClose = () => {
    onClose();
  };

  const neutralizeBack = () => {
    if (isMobile) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.onpopstate = () => {
          return;
        };
        document.body.classList.remove('overflow-hidden');
        onClose(false);
      };
    }
  };

  useEffect(() => {
    if (isOpen) {
      neutralizeBack();
      return document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      if (isMobile) {
        window.onpopstate = () => {
          return;
        };
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return createPortal(
    <div
      className="fixed top-0 overflow-auto left-0 right-0 bottom-0 md:pb-14 z-infinity pt-8 md:pt-20 flex items-end md:justify-center md:items-start bg-slate-800 bg-opacity-30"
      onClick={handleClose}
    >
      <div
        className={clsx('bg-white w-full rounded-tr-xl rounded-tl-xl md:rounded-lg md:w-[28rem]', {
          'h-full overflow-hidden': fullScreen,
        })}
        onClick={e => e.stopPropagation()}
      >
        {noHeader && <div className="w-11 h-1 md:hidden rounded-full bg-slate-200 mx-auto mt-4" />}
        {!noHeader && (
          <div className="p-4 flex justify-between items-center">
            <span className="font-bold line-clamp-1">{title}</span>
            <CloseIcon onClick={handleClose} />
          </div>
        )}
        <div className={clsx('p-6 pt-0 h-full overflow-auto', bodyClassName)}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
