import Chips from '@/common/components/atom/chips';
import Text from '@/common/components/atom/text';
import { useRecentSearch } from '../../hooks/useRecentSearch';
import { useSearchStore } from '../../store/search';

export const RecentSearch = () => {
  const { recent } = useRecentSearch();
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);

  const handleChangeSearchInput = (text: string) => {
    setUserSearchValue(text);
  };

  if (!recent.length) return <div className="h-[68px] md:h-6"></div>;
  return (
    <div className="flex flex-col space-y-5 md:space-y-0 md:flex-row w-full lg:w-[50rem] md:overflow-auto items-center">
      <Text fontWeight="semiBold" className="whitespace-nowrap">
        آخرین جستجوهای شما
      </Text>

      <div className="relative flex space-s-3 mr-2 overflow-auto w-full">
        {recent.map((item: any, index) => (
          <Chips key={index} className="cursor-pointer" onClick={() => handleChangeSearchInput(item.name)}>
            {item.name}
          </Chips>
        ))}
      </div>
    </div>
  );
};

export default RecentSearch;
