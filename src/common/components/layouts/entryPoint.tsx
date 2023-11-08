import { useGetUser } from '@/common/apis/services/auth/getUser';
import { useGetMe } from '@/common/apis/services/auth/me';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useProviders } from '@/modules/profile/apis/providers';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { ReactElement, useEffect } from 'react';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const logout = useUserInfoStore(state => state.logout);

  const getUser = useGetUser();
  const getMe = useGetMe();
  const getProvider = useProviders();

  useEffect(() => {
    handleUserLogin();
  }, []);

  const handleUserLogin = async () => {
    try {
      if (getCookie('certificate')) {
        setPending(true);
        const { data } = await getUser.mutateAsync();
        const userData = await getMe.mutateAsync();
        const providerData = await getProvider.mutateAsync({ user_id: userData?.id });

        if (data.status === ClinicStatus.EXPIRED_CERTIFICATE) {
          setPending(false);
          removeInfo();
          return;
        }

        setUserInfo({
          image: data?.result?.image,
          provider: providerData,
          ...userData,
        });

        setPending(false);
        return;
      }
      setPending(false);
      removeInfo();
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
