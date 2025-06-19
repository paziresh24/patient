import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import { splunkInstance } from '@/common/services/splunk';
import GoldButton from '@/modules/bamdad/components/goldButton';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';

export const DoctorTagsFallback = () => {
  const router = useRouter();
  const copywriting = useFeatureValue<Record<string, any>>('premium.copywriting', {});
  const summaryReviewsTexts = copywriting?.[router.pathname]?.summaryReviews ?? {};
  const symptomsTexts = copywriting?.[router.pathname]?.symptoms ?? {};

  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4 bg-white">
      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-s-1">
          <DiamondIcon className="text-amber-500" />
          <Text fontWeight="bold">{summaryReviewsTexts?.title}</Text>
        </div>
        <div className="p-4 text-sm font-medium rounded-lg bg-amber-50">{summaryReviewsTexts?.description}</div>
      </div>

      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-s-1">
          <DiamondIcon className="text-amber-500" />
          <Text fontWeight="bold">{symptomsTexts?.title}</Text>
        </div>
        <div className="p-4 text-sm font-medium rounded-lg bg-amber-50">{symptomsTexts?.description}</div>
      </div>

      <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-500">
        برای دسترسی به این ویژگی ها، اشتراک طلایی دریافت کنید
      </Text>
      <GoldButton
        onClick={() => {
          splunkInstance('doctor-profile').sendEvent({
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

export default DoctorTagsFallback;
