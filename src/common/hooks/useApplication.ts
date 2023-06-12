import { useEffect, useState } from 'react';
import { isPWA } from '../utils/isPwa';

export const useApplication = () => {
  const [state, setState] = useState(false);

  useEffect(() => {
    setState(isPWA());
  }, []);

  return state;
};

export default useApplication;
