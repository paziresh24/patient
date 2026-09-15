import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

/** Logged-in chrome/API: one identity for nav, launcher, dashboard, Plasmic. */
export const useIsDoctor = () => {
  const user = useUserInfoStore(state => state.info);
  return hasDoctorIdentity(user, useDoctorDeviceCached());
};
