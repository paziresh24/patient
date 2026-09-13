import { UserInfo } from '@/modules/login/store/userInfo';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { getDoctorSlug } from '../utils/centers';

export const useDoctorHomeContext = (user?: UserInfo) => {
  const isDoctor = hasDoctorIdentity(user, useDoctorDeviceCached());
  const slug = getDoctorSlug(user);

  return { isDoctor, slug };
};
