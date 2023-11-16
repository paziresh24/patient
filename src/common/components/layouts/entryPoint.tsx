import { useGetUser } from '@/common/apis/services/auth/getUser';
import { useGetMe } from '@/common/apis/services/auth/me';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useProviders } from '@/modules/profile/apis/providers';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ReactElement, useEffect } from 'react';
import { growthbook } from 'src/pages/_app';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const logout = useUserInfoStore(state => state.logout);
  const shouldCheckCertificate = useFeatureIsOn('login:certificate-check');

  const getUser = useGetUser();
  const getMe = useGetMe();
  const getProvider = useProviders();

  useEffect(() => {
    if (growthbook.ready) handleUserLogin();
  }, [growthbook.ready]);

  const handleUserLogin = async () => {
    try {
      if (!getCookie('certificate') && shouldCheckCertificate) {
        removeInfo();
        setPending(false);
        return;
      }

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
          logout();
          setPending(false);
        }
      }
    }
  };

  return <>{children}</>;
};
