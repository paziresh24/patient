import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import { splunkInstance } from '@/common/services/splunk';
import GoldButton from '@/modules/bamdad/components/goldButton';
import { useRouter } from 'next/router';

export const DoctorTagsFallback = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full p-4 space-y-4 bg-white">
      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-s-1">
          <DiamondIcon className="text-amber-500" />
          <Text fontWeight="bold">خلاصه نظرات کاربران</Text>
        </div>
        <div className="p-4 text-sm font-medium rounded-lg bg-amber-50">
          کاربرانی که اشتراک طلایی پذیرش24 را تهیه کرده اند، با مشاهده خلاصه نظرات کاربران و خصوصیات مثبت و منفی پزشک می توانند تصمیم گیری
          بهتری برای انتخاب پزشک معالج خود داشته باشند.
        </div>
      </div>

      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-s-1">
          <DiamondIcon className="text-amber-500" />
          <Text fontWeight="bold">دلایل مراجعه سایر بیماران به پزشک</Text>
        </div>
        <div className="p-4 text-sm font-medium rounded-lg bg-amber-50">
          کاربران دارای اشتراک طلایی میتوانند دلایل مراجعه سایر بیماران به پزشک را ببینند و بسته به نوع بیماری و نیاز خود، بهترین درمانگر را
          انتخاب کنند.
        </div>
      </div>

      <Text fontSize="sm" fontWeight="medium" className="text-center text-slate-500">
        برای دسترسی به این ویژگی ها، اشتراک طلایی دریافت کنید
      </Text>
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

export default DoctorTagsFallback;
