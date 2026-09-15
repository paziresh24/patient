import useCustomize from '@/common/hooks/useCustomize';
import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

/** Every doctor (non-partner) gets the new doctor home. No flags. */
export const useIsNewDoctorLauncherEnabled = () => {
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const customize = useCustomize(state => state.customize);
  const deviceCached = useDoctorDeviceCached();

  if (customize.partnerKey) return false;

  return hasDoctorIdentity(user, deviceCached) && (isLogin || deviceCached);
};

export const useIsNewDoctorLauncherLoading = () => {
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pending = useUserInfoStore(state => state.pending);
  const doctorProfilePending = useUserInfoStore(state => state.doctorProfilePending);
  const customize = useCustomize(state => state.customize);
  const deviceCached = useDoctorDeviceCached();

  if (customize.partnerKey) return false;

  if (hasDoctorIdentity(user, deviceCached)) return false;

  return (pending || doctorProfilePending) && (isLogin || deviceCached);
};
