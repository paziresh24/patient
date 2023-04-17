import { useGetUser } from '@/common/apis/services/auth/me';
import { useGetDoctorProfile } from '@/common/apis/services/doctor/profile';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { getCookie } from 'cookies-next';
import config from 'next/config';
import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';

const { publicRuntimeConfig } = config();

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const router = useRouter();
  const userInfo = useUserInfoStore(state => state.info);
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const setPending = useUserInfoStore(state => state.setPending);
  const { handleOpen, handleClose, modalProps } = useModal();

  const getUser = useGetUser();
  const getDoctorProfile = useGetDoctorProfile();

  useEffect(() => {
    handleUserLogin();
  }, []);

  const handleUserLogin = async () => {
    if (getCookie('certificate')) {
      setPending(true);
      const { data } = await getUser.mutateAsync();

      if (data.status === ClinicStatus.EXPIRED_CERTIFICATE) {
        setPending(false);
        removeInfo();
        return;
      }

      let profile = {};
      if (data.isDoctor) {
        try {
          const { data } = await getDoctorProfile.mutateAsync();
          profile = data.data;
        } catch (error) {
          console.error(error);
        }
      }

      setUserInfo({
        is_doctor: data.isDoctor,
        profile,
        ...data.result,
      });
      if (data.isDoctor) handleOpen();
      setPending(false);

      return;
    }
    setPending(false);
    removeInfo();
  };

  return <>{children}</>;
};
