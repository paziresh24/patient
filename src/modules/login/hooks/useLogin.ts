import { useGetUser } from '@/common/apis/services/auth/getUser';
import { useLogin as useLoginRequest } from '@/common/apis/services/auth/login';
import { useGetMe } from '@/common/apis/services/auth/me';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useCustomize from '@/common/hooks/useCustomize';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { useProviders } from '@/modules/profile/apis/providers';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { useUserInfoStore } from '../store/userInfo';

export const useLogin = () => {
  const loginRequest = useLoginRequest();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const logout = useUserInfoStore(state => state.logout);
  const getMe = useGetMe();
  const getUser = useGetUser();
  const getProvider = useProviders({ user_id: getMe?.data?.id }, { enabled: !!getMe?.data?.id });
  const university = useCustomize(state => state.customize?.partnerKey);

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    try {
      const { data } = await loginRequest.mutateAsync({
        username: +username,
        password,
      });

      if (data.status === ClinicStatus.SUCCESS) {
        setCookie('certificate', data.certificate, {
          path: '/',
          maxAge: dayToSecond(365),
        });

        if (university)
          setCookie('token', data.token, {
            path: '/',
            maxAge: dayToSecond(365),
          });

        await getUser.mutateAsync();
        await getMe.mutateAsync();

        if (window?.Android) window.Android.login(data.certificate);

        return Promise.resolve({ ...getMe.data });
      }
      return Promise.reject(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        if (error.response?.status === 401 || error.response?.status === 400) {
          logout();
        }
        return Promise.reject(error.response?.data);
      }
    }
  };

  useEffect(() => {
    if (getProvider.isSuccess && getUser.isSuccess && getMe.isSuccess) {
      setUserInfo({
        provider: getProvider.data?.data?.providers?.[0],
        image: getUser.data?.data?.result?.image,
        ...getMe.data,
      });
    }
  }, [getProvider.status]);

  return { login: handleLogin, isLoading: loginRequest.isLoading || getUser.isLoading || getMe.isLoading };
};
