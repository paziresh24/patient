import { useCallback } from 'react';

let scrollLockCount = 0;

const applyScrollLock = () => {
  document.documentElement.classList.add('overflow-hidden');
  document.body.classList.add('overflow-hidden');
  document.body.classList.add('md:pr-[0.3rem]');
};

const releaseScrollLock = () => {
  document.documentElement.classList.remove('overflow-hidden');
  document.body.classList.remove('overflow-hidden');
  document.body.classList.remove('md:pr-[0.3rem]');
};

export const useLockScroll = () => {
  const lockScroll = useCallback(() => {
    if (scrollLockCount === 0) {
      applyScrollLock();
    }
    scrollLockCount += 1;
  }, []);

  const openScroll = useCallback(() => {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount === 0) {
      releaseScrollLock();
    }
  }, []);

  return { lockScroll, openScroll };
};

export default useLockScroll;
