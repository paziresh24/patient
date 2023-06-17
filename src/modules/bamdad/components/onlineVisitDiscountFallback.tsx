import Text from '@/common/components/atom/text/text';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import GoldButton from './goldButton';

export const OnlineVisitDiscountFallback = ({ className }: { className: string }) => {
  const router = useRouter();
  const discountPercentage = useFeatureValue('premium.online_visit_discount_percentage', 0);

  return (
    <div className={classNames('flex flex-col items-center space-y-2 bg-white', className)}>
      <div className="w-full p-3 text-center rounded-lg bg-amber-50">
        <Text fontSize="sm" fontWeight="medium">
          شما می توانید با فعال سازی اشتراک ماهانه طلایی، از تخفیف {discountPercentage}% نامحدود در ویزیت های آنلاین استفاده کنید.
        </Text>
      </div>
      <GoldButton
        onClick={() => {
          splunkInstance().sendEvent({
            group: 'bamdad',
            type: 'doctor_profile_button',
          });
          router.push('/patient/premium');
        }}
      >
        مشاهده اشتراک طلایی
      </GoldButton>
    </div>
  );
};

export default OnlineVisitDiscountFallback;
