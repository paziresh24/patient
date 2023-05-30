import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
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
          شما با دسترسی به نسخه خلاصه شده نظرات کاربران، می توانید تصمیم آگاهانه تری بگیرید و پزشک مناسبی را برای درمان خود انتخاب کنید.
        </div>
      </div>

      <div className="flex flex-col w-full space-y-3">
        <div className="flex items-center space-s-1">
          <DiamondIcon className="text-amber-500" />
          <Text fontWeight="bold">دلایل مراجعه سایر بیماران به پزشک</Text>
        </div>
        <div className="p-4 text-sm font-medium rounded-lg bg-amber-50">
          با بررسی دلایلی که سایر بیماران برای مراجعه به یک پزشک داشته‌اند، شما قادر به شناسایی پزشک مناسب برای درمان خود خواهید بود.
        </div>
      </div>

      <Text fontSize="sm" fontWeight="medium" className="text-slate-500">
        شما می توانید برای دسترسی به این ویژگی ها، از اشتراک طلایی پذیرش24 استفاده کنید.
      </Text>
      <Button
        onClick={() => router.push('/patient/premium')}
        variant="secondary"
        icon={<DiamondIcon className="text-yellow-600" />}
        className="text-yellow-600 border-yellow-500 shadow-md shadow-amber-700/10 hover:bg-amber-50/50"
      >
        مشاهده اشتراک طلایی
      </Button>
    </div>
  );
};

export default DoctorTagsFallback;
