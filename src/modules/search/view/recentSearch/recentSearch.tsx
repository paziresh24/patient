import Chips from '@/common/components/atom/chips';
import Text from '@/common/components/atom/text';
import useTranslation from 'next-translate/useTranslation';
import { useRecentSearch } from '../../hooks/useRecentSearch';
import { useSearchStore } from '../../store/search';

export const RecentSearch = () => {
  const { t } = useTranslation('search');
  const { recent } = useRecentSearch();
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);

  const handleChangeSearchInput = (text: string) => {
    setUserSearchValue(text);
  };

  if (!recent.length) return <div className="h-[68px] md:h-6"></div>;
  return (
    <div className="flex flex-col space-y-5 md:space-y-0 md:space-s-2 md:flex-row w-full lg:w-[50rem] md:overflow-auto items-center">
      <Text fontWeight="semiBold" className="whitespace-nowrap">
        {t('recentSearchTitle')}
      </Text>

      <div className="relative flex w-full overflow-auto space-s-3">
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
