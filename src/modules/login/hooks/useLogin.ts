import { useLogin as useLoginRequest } from '@/common/apis/services/auth/login';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useServerQuery from '@/common/hooks/useServerQuery';
import { dayToSecond } from '@/common/utils/dayToSecond';
import axios from 'axios';
import { setCookie } from 'cookies-next';
import { useUserInfoStore } from '../store/userInfo';

export const useLogin = () => {
  const loginRequest = useLoginRequest();
  const university = useServerQuery(state => state.queries.university);
  const getDoctorProfile = useGetDoctorProfile();
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);

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

        if (university || process.env.NODE_ENV === 'development')
          setCookie('token', data.token, {
            path: '/',
            maxAge: dayToSecond(365),
          });

        if (window?.Android) window.Android.login(data.certificate);

        let profile = {};
        if (data.is_doctor) {
          try {
            const { data } = await getDoctorProfile.mutateAsync();
            profile = data.data;
          } catch (error) {
            console.error(error);
          }
        }

        const info = {
          is_doctor: data.is_doctor,
          profile,
          ...data.result,
        };

        setUserInfo(info);

        return Promise.resolve(info);
      }
      return Promise.reject(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        return Promise.reject(error.response?.data);
      }
    }
  };

  return { login: handleLogin, isLoading: loginRequest.isLoading || getDoctorProfile.isLoading };
};
