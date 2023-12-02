import config from 'next/config';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

export const RaviAuthIframe = () => {
  const { isLogin, userInfo } = useUserInfoStore(state => ({
    isLogin: state.isLogin
  }));
  const { publicRuntimeConfig } = config();
  return <iframe src={`${publicRuntimeConfig.RAVI_BASE_URL}/auth/oauth2_basic`} className="hidden" key={isLogin ? 1 : 0} />;
};

export default RaviAuthIframe;
