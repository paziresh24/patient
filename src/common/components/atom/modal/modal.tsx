import useResponsive from '@/common/hooks/useResponsive';
import classNames from '@/common/utils/classNames';
import dynamic from 'next/dynamic';
import CloseIcon from '../../icons/close';
import ClientOnlyPortal from '../../layouts/clientOnlyPortal';
const Transition = dynamic(() => import('../transition'));

export interface ModalProps {
  isOpen: boolean;
  onClose: (_?: any) => void;
  children: React.ReactNode;
  title?: string;
  fullScreen?: boolean;
  bodyClassName?: string;
  className?: string;
  noHeader?: boolean;
}

export const Modal = (props: ModalProps) => {
  const { title, isOpen, onClose, children, fullScreen, bodyClassName, className, noHeader = false } = props;
  const { isMobile } = useResponsive();

  return (
    <ClientOnlyPortal selector="body">
      <Transition
        match={isOpen}
        animation="fade"
        className="fixed top-0 bottom-0 left-0 right-0 flex items-end md:pb-14 z-infinity md:pt-20 md:justify-center md:items-start bg-slate-900 bg-opacity-60"
        onClick={onClose}
        id="modal"
      >
        <Transition
          match={isOpen}
          animation={fullScreen && isMobile ? 'right' : 'bottom'}
          duration={300}
          className={classNames(
            'bg-white w-full flex flex-col rounded-tr-xl rounded-tl-xl md:!rounded-lg md:w-[28rem] max-h-screen overflow-auto',
            {
              'h-full overflow-hidden rounded-tr-none rounded-tl-none': fullScreen,
            },
            className,
          )}
          onClick={e => e.stopPropagation()}
        >
          {noHeader && <div className="h-1 mx-auto mt-4 rounded-full w-11 md:hidden bg-slate-300" />}
          {!noHeader && (
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <span className="font-bold line-clamp-1">{title}</span>
              <CloseIcon onClick={onClose} className="cursor-pointer" />
            </div>
          )}
          <div className={classNames('p-5 flex-grow overflow-auto no-scroll', bodyClassName)}>{children}</div>
        </Transition>
      </Transition>
    </ClientOnlyPortal>
  );
};

export default Modal;
