import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNetworkState } from 'react-use';

const TOAST_ID = 'network-status';

export const useNetworkStatus = () => {
  const { online } = useNetworkState();

  useEffect(() => {
    if (!online) {
      toast.loading('ارتباط شما با اینترنت قطع شده است.', {
        id: TOAST_ID,
        duration: Infinity,
        position: 'top-center',
        className: '!bg-slate-900 !text-white',
      });
    } else {
      toast.dismiss(TOAST_ID);
    }
  }, [online]);
};
