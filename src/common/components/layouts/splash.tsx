import { useEffect, useState } from 'react';
import Logo from '../atom/logo/logo';

export const Splash = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 500);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center h-screen bg-white md:hidden z-infinity">
      <Logo type="compact" />
    </div>
  );
};

export default Splash;
