import { useGetUser } from '@/common/apis/services/auth/getUser';
import { useGetMe } from '@/common/apis/services/auth/me';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useProviders } from '@/modules/profile/apis/providers';
import { getCookie } from 'cookies-next';
import config from 'next/config';
import { ReactElement, useEffect } from 'react';

const { publicRuntimeConfig } = config();

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const setPending = useUserInfoStore(state => state.setPending);

  const getUser = useGetUser();
  const getDoctorProfile = useGetDoctorProfile();
  const getMe = useGetMe();
  const getProvider = useProviders({ user_id: getMe?.data?.id }, { enabled: !!getMe?.data?.id });

  useEffect(() => {
    handleUserLogin();
  }, []);

  const handleUserLogin = async () => {
    if (getCookie('certificate')) {
      setPending(true);
      const { data } = await getUser.mutateAsync();
      await getMe.mutateAsync();
      if (data.status === ClinicStatus.EXPIRED_CERTIFICATE) {
        setPending(false);
        removeInfo();
        return;
      }
      return;
    }
    setPending(false);
    removeInfo();
  };

  useEffect(() => {
    if (getProvider.isSuccess && getUser.isSuccess && getMe.isSuccess) {
      setUserInfo({
        provider: getProvider.data?.data?.providers?.[0],
        image: getUser.data?.data?.result?.image,
        ...getMe.data,
      });
      setPending(false);
    }
  }, [getProvider.status]);

  return <>{children}</>;
};
