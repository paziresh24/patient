import { splunkInstance } from '@/common/services/splunk';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureValue } from '@growthbook/growthbook-react';

export const SupportButtonBamdad = () => {
  const userInfo = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const phoneNumber = useFeatureValue('premium.support_phone_number', '');

  if (!checkPremiumUser(userInfo.vip) || !phoneNumber || !isLogin) return null;
  return (
    <a
      href={`tel:${phoneNumber}`}
      onClick={() =>
        splunkInstance('doctor-profile').sendEvent({
          group: 'bamdad',
          type: 'support_call',
        })
      }
      className="p-1 px-2 text-sm font-semibold border rounded-md border-amber-500"
    >
      پشتیبانی ویژه
    </a>
  );
};

export default SupportButtonBamdad;
