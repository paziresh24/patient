import { useEffect, useState } from 'react';

/** True only after the client has mounted — use to gate localStorage/sessionStorage reads during render. */
export const useClientMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};
