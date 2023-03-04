import Chips from '@/common/components/atom/chips';
import Text from '@/common/components/atom/text';
import useTranslation from 'next-translate/useTranslation';
import ScrollContainer from 'react-indiana-drag-scroll';
import { useRecentSearch } from '../../hooks/useRecentSearch';
import { useSearchStore } from '../../store/search';

export const RecentSearch = () => {
  const { t } = useTranslation('search');
  const { recent } = useRecentSearch();
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);

  const handleChangeSearchInput = (text: string) => {
    setUserSearchValue(text);
    setIsOpenSuggestion(true);
  };

  return (
    <div className="flex flex-col space-y-5 md:space-y-0 md:space-s-2 md:flex-row w-full lg:w-[50rem] md:overflow-auto items-center">
      <Text fontWeight="semiBold" className="whitespace-nowrap">
        {t('recentSearchTitle')}
      </Text>

      <ScrollContainer className="relative flex w-full overflow-auto no-scroll space-s-3 select-none">
        {recent.map((item: any, index) => (
          <Chips key={index} className="cursor-pointer !text-slate-500" onClick={() => handleChangeSearchInput(item.name)}>
            {item.name}
          </Chips>
        ))}
      </ScrollContainer>
    </div>
  );
};

export default RecentSearch;
