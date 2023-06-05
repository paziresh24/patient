import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import { splunkInstance } from '@/common/services/splunk';
import { checkPremiumUser } from '@/modules/bamdad/utils/checkPremiumUser';
import Link from 'next/link';
import { useUserInfoStore } from '../../login/store/userInfo';
import { getPremiumDuration } from '../utils/getPremiumDuration';

export const CreditDuration = () => {
  const userInfo = useUserInfoStore(state => state.info);

  return (
    <>
      {checkPremiumUser(userInfo.vip) && (
        <Link href="/patient/premium">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-center py-3 rounded-lg space-s-2 bg-amber-50">
              <DiamondIcon className="w-5 h-5 text-amber-500" />
              <Text fontSize="xs" className="text-black">
                شماره دارای اشتراک طلایی هستید.
              </Text>
            </div>
            <div className="flex self-center space-s-1">
              <Text fontSize="sm" className="opacity-80">
                مدت اعتبار:
              </Text>
              <Text fontSize="sm" fontWeight="medium">
                {getPremiumDuration(userInfo.vip)} روز
              </Text>
            </div>
          </div>
        </Link>
      )}
      {!checkPremiumUser(userInfo.vip) && (
        <Link
          href="/patient/premium"
          className="flex items-center space-s-2"
          onClick={() => {
            splunkInstance().sendEvent({
              group: 'bamdad',
              type: 'patient_profile_button',
            });
          }}
        >
          <DiamondIcon className="text-amber-500" />
          <Text fontWeight="medium" fontSize="sm">
            اشتراک طلایی
          </Text>
        </Link>
      )}
    </>
  );
};

export default CreditDuration;
