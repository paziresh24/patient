import { useEffect } from 'react';

export const HAMDAST_CLOSE_MESSAGE_EVENT = 'HAMDAST_CLOSE';
export const HAMDAST_CLOSE_VARDAST_EVENT = 'hamdast:close-vardast';

export const dispatchHamdastCloseVardast = () => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(HAMDAST_CLOSE_VARDAST_EVENT));
};

export const HamdastClose = ({
  onClose,
  closeVardast = false,
}: {
  onClose?: () => void;
  closeVardast?: boolean;
}) => {
  useEffect(() => {
    const handleMessage = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event !== HAMDAST_CLOSE_MESSAGE_EVENT) return;

      onClose?.();

      if (closeVardast) {
        dispatchHamdastCloseVardast();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [closeVardast, onClose]);

  return null;
};

export default HamdastClose;
