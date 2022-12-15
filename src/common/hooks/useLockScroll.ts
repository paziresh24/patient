export const useLockScroll = () => {
  const lockScroll = () => {
    console.log('hiiiiiiiiiiiii');
    document.body.classList.add('overflow-hidden');
    document.body.classList.add('md:pr-[0.3rem]');
  };

  const openScroll = () => {
    console.log('bye');
    document.body.classList.remove('overflow-hidden');
    document.body.classList.remove('md:pr-[0.3rem]');
  };

  return { lockScroll, openScroll };
};

export default useLockScroll;
