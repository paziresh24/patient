import { useRouter } from 'next/router';
import suggestionEvents from '../functions/suggestionEvents';
import { useSearchStore } from '../store/search';
import { Item } from '../types/suggestion';
import { useRecentSearch } from './useRecentSearch';

export const useSuggestionItem = () => {
  const router = useRouter();
  const { setUserSearchValue, city, userSearchValue } = useSearchStore();
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { addRecentSearch } = useRecentSearch();

  const handleItemEvent = (item: Item, index: number) => {
    suggestionEvents.itemClick({
      cityName: city.name,
      index: index + 1,
      item,
      userSearchValue,
    });
  };

  const handleItemClick = (item: Item, index: number) => {
    handleItemEvent(item, index);
    addRecentSearch(item);
    if (item.use_suggestion) {
      setUserSearchValue(item?.name ?? '');
    } else if (item.absolute_url) {
      window.location.href = item.url ?? '#';
    } else {
      if (item.url?.startsWith('/dr')) {
        return (window.location.href = item.url ?? '#');
      }
      router.push(item.url ?? '/s', undefined, { ...(item.url?.startsWith('/s') && { shallow: true }), scroll: true });
      setIsOpenSuggestion(false);
      setTimeout(() => setUserSearchValue(''), 0);
    }
  };

  return { handleItemClick, handleItemEvent };
};
