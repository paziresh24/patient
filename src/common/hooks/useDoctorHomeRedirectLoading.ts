import { useClientMounted } from '@/common/hooks/useClientMounted';
import { isMobileViewport } from '@/common/hooks/useResponsive';
import { isDoctorDeviceCached } from '@/common/utils/doctorDeviceCache';
import { isDoctorHomeRedirectPath } from '@/common/utils/doctorHomePaths';
import { isPatientViewModeStored } from '@/modules/doctorHome/store/viewMode';
import { useSpaPatientViewStore } from '@/modules/doctorHome/utils/spaPatientView';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';
import { isDoctorUser } from './useDoctorHomeRedirect';

export const useDoctorHomeRedirectLoading = () => {
  const router = useRouter();
  const mounted = useClientMounted();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pending = useUserInfoStore(state => state.pending);
  const doctorProfilePending = useUserInfoStore(state => state.doctorProfilePending);
  const userInfo = useUserInfoStore(state => state.info);
  const spaPatientView = useSpaPatientViewStore(state => state.active);
  const isCachedDoctor = mounted && isDoctorDeviceCached();

  const onRedirectPath = isDoctorHomeRedirectPath(router.pathname);
  const isPatientOptOut = spaPatientView || (mounted && isPatientViewModeStored());

  // Desktop never. Patient SPA switch never shows redirect loading.
  if (!mounted || !onRedirectPath || !isMobileViewport() || isPatientOptOut) return false;

  const isDoctor = isCachedDoctor || (isLogin && isDoctorUser(userInfo));

  if ((pending || doctorProfilePending) && isCachedDoctor) return true;

  return !pending && !doctorProfilePending && isDoctor;
};
