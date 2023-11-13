import useCustomize from '@/common/hooks/useCustomize';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { checkPremiumUser } from '../utils/checkPremiumUser';

export const useShowPremiumFeatures = () => {
  const gradualState = useFeatureIsOn('premium.is_enabled');
  const userInfo = useUserInfoStore(state => state.info);
  const university = useCustomize(state => state.customize?.partnerKey);

  return (!university && gradualState) || checkPremiumUser(userInfo.vip);
};
