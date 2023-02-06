import { useEffect, useState } from 'react';
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

  useEffect(() => {
    if (typeof window !== 'undefined') setIsClient(true);
  }, []);

  return {
    isDesktop: isClient ? isDesktop : false,
    isTablet: isClient ? isTablet : false,
    isMobile: isClient ? isMobile : false,
  };
};

export default useResponsive;
