import config from 'next/config';

export const RaviAuthIframe = ({ key }: { key: number }) => {
  const { publicRuntimeConfig } = config();
  return <iframe src={`${publicRuntimeConfig.RAVI_BASE_URL}/auth/oauth2_basic`} className="hidden" key={key} />;
};

export default RaviAuthIframe;
