import { memo, useEffect, useState } from 'react';

interface IframeHamdastProps {
  appId: string;
  pageId: string;
  src: string;
}

export const IframeHamdast = memo(({ appId, pageId, src }: IframeHamdastProps) => {
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);

  if (!src && !render) return null;

  return <iframe src={`https://hamdast.paziresh24.com/bridge/?app=${appId}&page=${pageId}&src=${encodeURIComponent(src)}`} />;
});

export default IframeHamdast;
