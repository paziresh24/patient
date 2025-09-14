import { useCallback, useRef } from 'react';

let lockCount = 0; // شمارنده‌ی سراسری

export const useLockScroll = () => {
  const lockedRef = useRef(false);

  const lockScroll = useCallback(() => {
    if (!lockedRef.current) {
      lockedRef.current = true;
      lockCount += 1;
      if (lockCount === 1) {
        document.body.classList.add('overflow-hidden');
        document.body.classList.add('md:pr-[0.3rem]');
      }
    }
  }, []);

  const openScroll = useCallback(() => {
    if (lockedRef.current) {
      lockedRef.current = false;
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove('overflow-hidden');
        document.body.classList.remove('md:pr-[0.3rem]');
      }
    }
  }, []);

  return { lockScroll, openScroll };
};

export default useLockScroll;
