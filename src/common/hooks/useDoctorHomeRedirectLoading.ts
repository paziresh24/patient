import useCustomize from '@/common/hooks/useCustomize';
import { isMobileViewport } from '@/common/hooks/useResponsive';
import { isDoctorDeviceCached } from '@/common/utils/doctorDeviceCache';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { isDoctorUser } from './useDoctorHomeRedirect';

const REDIRECT_PATHS = ['/', '/apphome'];

export const useDoctorHomeRedirectLoading = () => {
  const router = useRouter();
  const customize = useCustomize(state => state.customize);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userInfo = useUserInfoStore(state => state.info);
  const launcherAsMainHome = useFeatureIsOn('launcher-as-main-home');
  const isCachedDoctor = isDoctorDeviceCached();

  return (
    !customize.partnerKey &&
    REDIRECT_PATHS.includes(router.pathname) &&
    isMobileViewport() &&
    (launcherAsMainHome || isCachedDoctor) &&
    (isCachedDoctor || (isLogin && isDoctorUser(userInfo)))
  );
};
