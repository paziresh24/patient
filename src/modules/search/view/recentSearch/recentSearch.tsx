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
    <div className="flex w-full">
      <ScrollContainer className="relative flex items-center w-full overflow-auto select-none no-scroll space-s-3">
        <Text fontWeight="semiBold" fontSize="sm" className="whitespace-nowrap">
          {t('recentSearchTitle')}
        </Text>

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
