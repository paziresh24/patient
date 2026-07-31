import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { isDoctorDeviceCached } from '@/common/utils/doctorDeviceCache';
import type { UserInfo } from '@/modules/login/store/userInfo';

/**
 * Visibility gate for Arash voice chrome only (FAB / VoiceCallHost).
 * Must NOT be used for doctor-home redirect, launcher, or other product surfaces.
 *
 * Survives transient empty `provider.centers` during background sync after getMe.
 */
export function isArashEligibleDoctor(user: UserInfo): boolean {
  if (isDoctorUser(user)) return true;
  if (user?.provider?.job_title === 'doctor') return true;
  if (typeof window !== 'undefined' && isDoctorDeviceCached()) return true;
  return false;
}
