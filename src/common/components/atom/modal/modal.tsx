import CloseIcon from '@/components/icons/close';
import clsx from 'clsx';
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

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) return null;
  return createPortal(
    <div
      className="fixed top-0 left-0 right-0 bottom-0 z-50 pt-8 flex items-end md:justify-center md:items-center bg-slate-800 bg-opacity-30"
      onClick={handleClose}
    >
      <div
        className={clsx('bg-white w-full rounded-tr-lg rounded-tl-lg md:rounded-lg md:w-96', {
          'h-full': fullScreen,
        })}
        onClick={e => e.stopPropagation()}
      >
        {!noHeader && (
          <div className="p-4 flex justify-between items-center">
            <span className="font-bold line-clamp-1">{title}</span>
            <CloseIcon color="#000" onClick={handleClose} />
          </div>
        )}
        <div className={clsx('p-4 pt-0 overflow-auto', [bodyClassName])}>{children}</div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
