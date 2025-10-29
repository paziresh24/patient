import { GoogleTagManager } from '@next/third-parties/google';
import { useEffect, useState } from 'react';

const LazyGoogleTagManager = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // تاخیر در بارگذاری GTM تا بعد از بارگذاری اولیه صفحه
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return <GoogleTagManager gtmId="GTM-P5RPLDP" />;
};

export default LazyGoogleTagManager;
