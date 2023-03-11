import { useGetUser } from '@/common/apis/services/auth/me';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { getCookie } from 'cookies-next';
import { ReactElement, useEffect } from 'react';

export const EntryPoint = ({ children }: { children: ReactElement }) => {
  const setUserInfo = useUserInfoStore(state => state.setUserInfo);
  const removeInfo = useUserInfoStore(state => state.removeInfo);
  const setPending = useUserInfoStore(state => state.setPending);

  const getUser = useGetUser();

  useEffect(() => {
    handleUserLogin();
  }, []);

  const handleUserLogin = async () => {
    if (getCookie('certificate')) {
      setPending(true);
      const { data } = await getUser.mutateAsync();
      setPending(false);

      if (data.status === ClinicStatus.EXPIRED_CERTIFICATE) {
        removeInfo();
        return;
      }

      setUserInfo({
        is_doctor: data.is_doctor,
        ...data.result,
      });
      return;
    }
    setPending(false);
    removeInfo();
  };

  return <>{children}</>;
};
