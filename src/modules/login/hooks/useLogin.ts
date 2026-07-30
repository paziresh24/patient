import { useLogin as useLoginRequest } from '@/common/apis/services/auth/login';
import { useGetMe } from '@/common/apis/services/auth/me';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { getErrorMessage } from '@/common/utils/errorHandler';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useUserInfoStore } from '../store/userInfo';

export const useLogin = () => {
  const loginRequest = useLoginRequest();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const getMe = useGetMe();

  const handleLogin = async ({ username, password, force }: { username: string; password: string; force?: boolean }) => {
    try {
      const { data } = await loginRequest.mutateAsync({
        username: +username,
        password,
        ...(force !== undefined && { force }),
      });

      if (data.status === ClinicStatus.SUCCESS) {
        if (data.token) {
          setCookie('token', data.token, {
            path: '/',
            maxAge: dayToSecond(365),
          });
        }

        const userData = await getMe.mutateAsync();

        if (window?.Android) window.Android.login(data.certificate);

        setUserInfo({
          ...userData,
        });

        return Promise.resolve({ ...userData });
      }
      return Promise.reject(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        // استفاده از helper function برای نمایش پیام مناسب
        const errorMessage = getErrorMessage(error);
        return Promise.reject({ message: errorMessage });
      }
      // برای خطاهای غیر axios
      const errorMessage = getErrorMessage(error);
      return Promise.reject({ message: errorMessage });
    }
  };

  return { login: handleLogin, isLoading: loginRequest.isLoading || getMe.isLoading };
};
