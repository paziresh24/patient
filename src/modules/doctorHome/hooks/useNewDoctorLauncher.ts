import useCustomize from '@/common/hooks/useCustomize';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { isDoctorUser } from '../store/viewMode';

export const useIsNewDoctorLauncherEnabled = () => {
  const user = useUserInfoStore(state => state.info);
  const customize = useCustomize(state => state.customize);
  const isEnabled = useFeatureIsOn('doctor-home:enable');

  if (customize.partnerKey || !isDoctorUser(user)) {
    return false;
  }

  return isEnabled;
};
