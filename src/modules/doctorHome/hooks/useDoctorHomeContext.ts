import { UserInfo } from '@/modules/login/store/userInfo';
import { getDoctorSlug } from '../utils/centers';

export const useDoctorHomeContext = (user?: UserInfo) => {
  const isDoctor = !!user?.is_doctor && user?.provider?.job_title === 'doctor';
  const slug = getDoctorSlug(user);

  return { isDoctor, slug };
};
