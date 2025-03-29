import { useGetUser } from '@/common/apis/services/auth/getUser';
import { useGetMe } from '@/common/apis/services/auth/me';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useProviders } from '@/modules/profile/apis/providers';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ReactElement, useEffect } from 'react';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const logout = useUserInfoStore(state => state.logout);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const info = useUserInfoStore(state => state.info);
  const autoLoginToGozargah = useFeatureIsOn('auto-login-to-gozargah');

  const getUser = useGetUser();
  const getMe = useGetMe();
  const getProvider = useProviders();

  useEffect(() => {
    handleUserLogin();
  }, []);

  const handleUserLogin = async () => {
    try {
      setPending(true);
      const userData = await getMe.mutateAsync();
      const { data } = await getUser.mutateAsync();
      const providerData = await getProvider.mutateAsync({ user_id: userData?.id });

      setUserInfo({
        image: data?.result?.image,
        provider: providerData,
        ...userData,
      });

      setPending(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          setPending(false);
        }
      }
    }
  };

  return (
    <>
      {children}
      {isLogin &&
        info?.id &&
        autoLoginToGozargah &&
        window.location.pathname != '/login/oauthEmbed/' &&
        info?.id != getCookie('gozargah_logged_in_user_id') && (
          <iframe
            src={`https://user.paziresh24.com/realms/paziresh24/protocol/openid-connect/auth?client_id=p24&redirect_uri=https://local.paziresh24.com/login/oauthEmbed/&response_type=code&scope=openid&kc_idp_hint=gozar&skip_prompt=true`}
            hidden
            className="absolute top-0 w-0 h-0 hidden"
          ></iframe>
        )}
    </>
  );
};
