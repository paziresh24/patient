import useResponsive from './useResponsive';

export const useVirtualBack = ({ handleClose }: { handleClose: () => void }) => {
  const { isMobile } = useResponsive();

  const neutralizeBack = () => {
    if (isMobile) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.onpopstate = () => {
          return;
        };
        handleClose();
      };
    }
  };

  const removeBack = () => {
    if (isMobile) {
      window.onpopstate = () => {
        return;
      };
    }
  };

  return { neutralizeBack, removeBack };
};

export default useVirtualBack;
