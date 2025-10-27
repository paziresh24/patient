import { useLogin as useLoginRequest } from '@/common/apis/services/auth/login';
import { useGetMe } from '@/common/apis/services/auth/me';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import useCustomize from '@/common/hooks/useCustomize';
import { dayToSecond } from '@/common/utils/dayToSecond';
import { getErrorMessage } from '@/common/utils/errorHandler';
import { useFeatureValue } from '@growthbook/growthbook-react';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useUserInfoStore } from '../store/userInfo';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';

export const useLogin = () => {
  const loginRequest = useLoginRequest();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const logout = useUserInfoStore(state => state.logout);
  const getMe = useGetMe();
  const getDoctorProfile = useGetDoctorProfile();
  const university = useCustomize(state => state.customize?.partnerKey);
  const webPushNotificationUserList = useFeatureValue<{ ids: string[] }>('notification:web-push|enabled', { ids: [] });

  const handleLogin = async ({ username, password }: { username: string; password: string }) => {
    try {
      const { data } = await loginRequest.mutateAsync({
        username: +username,
        password,
      });

      if (data.status === ClinicStatus.SUCCESS) {
        if (university)
          setCookie('token', data.token, {
            path: '/',
            maxAge: dayToSecond(365),
          });

        const userData = await getMe.mutateAsync();
        const doctorProfileData = getDoctorProfile.mutateAsync().then(data => {
          setUserInfo({
            provider: data,
            ...userData,
          });
        });

        if (window?.Android) window.Android.login(data.certificate);

        setUserInfo({
          provider: doctorProfileData,
          ...userData,
        });

        return Promise.resolve({ provider: doctorProfileData, ...userData });
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

  return { login: handleLogin, isLoading: loginRequest.isLoading || getMe.isLoading || getDoctorProfile.isLoading };
};
