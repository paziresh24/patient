import Chips from '@/common/components/atom/chips';
import Text from '@/common/components/atom/text';
import { useGetRecentSearch } from '../../hooks/useGetRecentSearch';

export const RecentSearch = () => {
  const recent = useGetRecentSearch();
  if (!recent.length) return null;
  return (
    <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row w-full lg:w-[50rem] md:overflow-auto items-center">
      <Text fontWeight="semiBold" className="whitespace-nowrap">
        آخرین جستجوهای شما
      </Text>

      <div className="relative flex space-s-3 mr-2 overflow-auto w-full">
        {recent.map((item: any, index) => (
          <Chips key={index} className="cursor-pointer">
            {item.name}
          </Chips>
        ))}
      </div>
    </div>
  );
};

export default RecentSearch;
