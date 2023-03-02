import classNames from '@/common/utils/classNames';
import { useEffect, useState } from 'react';
import HeaderLogo from './header/components/logo/logo';

export const Splash = ({ partnerLogo }: { partnerLogo: string }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 500);
  }, []);

  if (!show) return null;
  return (
    <div
      className={classNames('fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center h-screen bg-white z-infinity', {
        'md:hidden': !partnerLogo,
      })}
    >
      <HeaderLogo showPartnerLogo={!!partnerLogo} partnerLogo={partnerLogo} brandType="compact" size="desktop" />
    </div>
  );
};

export default Splash;
