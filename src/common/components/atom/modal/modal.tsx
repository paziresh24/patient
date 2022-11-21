import useResponsive from '@/common/hooks/useResponsive';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import CloseIcon from '../../icons/close';
import ClientOnlyPortal from '../../layouts/clientOnlyPortal';
const Transition = dynamic(() => import('../transition'));

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
    onClose(false);
    removeOverflowHidden();
  };

  const removeOverflowHidden = () => {
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('md:pr-[0.3rem]');
    if (isMobile) {
      window.onpopstate = () => {
        return;
      };
    }
  };

  const neutralizeBack = () => {
    if (isMobile) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.onpopstate = () => {
          return;
        };
        removeOverflowHidden();
        onClose(false);
      };
    }
  };

  useEffect(() => {
    if (isOpen) {
      neutralizeBack();
      document.body.classList.add('md:pr-[0.3rem]');
      return document.body.classList.add('overflow-hidden');
    } else {
      handleClose();
    }

    return () => removeOverflowHidden();
  }, [isOpen]);

  return (
    <ClientOnlyPortal selector="body">
      <Transition
        match={isOpen}
        animation="fade"
        className="fixed top-0 bottom-0 left-0 right-0 flex items-end md:pb-14 z-infinity md:pt-20 md:justify-center md:items-start bg-slate-900 bg-opacity-60"
        onClick={handleClose}
      >
        <Transition
          match={isOpen}
          animation={fullScreen && isMobile ? 'right' : 'bottom'}
          duration={300}
          className={clsx('bg-white w-full rounded-tr-xl rounded-tl-xl md:!rounded-lg md:w-[28rem] max-h-screen overflow-auto', {
            'h-full overflow-hidden rounded-tr-none rounded-tl-none': fullScreen,
          })}
          onClick={e => e.stopPropagation()}
        >
          {noHeader && <div className="h-1 mx-auto mt-4 rounded-full w-11 md:hidden bg-slate-300" />}
          {!noHeader && (
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="font-bold line-clamp-1">{title}</span>
              <CloseIcon onClick={handleClose} />
            </div>
          )}
          <div className={clsx('p-5 h-full overflow-auto no-scroll', bodyClassName)}>{children}</div>
        </Transition>
      </Transition>
    </ClientOnlyPortal>
  );
};

export default Modal;
