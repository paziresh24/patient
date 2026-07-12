import { useEffect, useState } from 'react';

export const useClientReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return isReady;
};

export default useClientReady;
