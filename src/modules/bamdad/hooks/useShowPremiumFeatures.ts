import useServerQuery from '@/common/hooks/useServerQuery';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { checkPremiumUser } from '../utils/checkPremiumUser';

export const useShowPremiumFeatures = () => {
  const gradualState = useFeatureIsOn('premium.is_enabled');
  const userInfo = useUserInfoStore(state => state.info);
  const university = useServerQuery(state => state.queries.university);

  return (!university && gradualState) || checkPremiumUser(userInfo.vip);
};
