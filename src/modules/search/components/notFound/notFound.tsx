import Text from '@/common/components/atom/text';

export const NotFound = () => {
  return (
    <div className="flex flex-col p-5 space-y-2 bg-orange-100 border border-orange-300 border-dashed rounded-lg">
      <Text fontWeight="bold">نتیجه ای مرتبط با جستجوی شما پیدا نکردیم.</Text>
      <Text fontWeight="medium" fontSize="sm" className="!mt-4">
        پیشنهادهای بهبود جستجو در پذیرش24:
      </Text>
      <ul className="pr-5 leading-8 list-disc">
        <li>
          <Text>لطفا از جستجوی پیشرفته برای جستجو در نتایج و یافتن بهترین درمانگر استفاده کنید.</Text>
        </li>
        <li>
          <Text>لطفا املای نام تخصص، بیماری، پزشک یا مرکز درمانی مورد نظر خود را بررسی کنید.</Text>
        </li>
        <li>
          <Text>لطفا کلمات کلیدی تری را برای جستجو امتحان کنید.</Text>
        </li>
      </ul>
    </div>
  );
};

export default NotFound;
