import Text from '@/common/components/atom/text/text';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import GoldButton from './goldButton';

export const OnlineVisitDiscountFallback = ({ className }: { className: string }) => {
  const router = useRouter();
  const discountPercentage = useFeatureValue('premium.online_visit_discount_percentage', 0);
  const copywriting = useFeatureValue<Record<string, any>>('premium.copywriting', {});
  const texts = copywriting?.[router.pathname]?.onlineVisit ?? {};

  return (
    <div className={classNames('flex flex-col items-center space-y-2 bg-white', className)}>
      <div className="w-full p-3 text-center rounded-lg bg-amber-50">
        <Text fontSize="sm" fontWeight="medium">
          {texts.description?.replace?.('{{online_visit_discount_percentage}}', discountPercentage)}
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
