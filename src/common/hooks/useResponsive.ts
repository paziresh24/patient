import { useLayoutEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const useResponsive = () => {
  const [isClient, setIsClient] = useState(false);

  const isMobile = useMediaQuery({
    maxWidth: 767,
  });

  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });

  const isDesktop = useMediaQuery({
    minWidth: 992,
  });

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);

  return {
    isDesktop: isClient ? isDesktop : true,
    isTablet: isClient ? isTablet : false,
    isMobile: isClient ? isMobile : false,
  };
};

export default useResponsive;
