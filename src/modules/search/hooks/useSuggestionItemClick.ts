import { splunkSearchInstance } from '@/common/services/splunk';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { getCookie } from 'cookies-next';
import { useSearchStore } from '../store/search';
import { Item } from '../types/suggestion';
import { useRecentSearch } from './useRecentSearch';

export const useSuggestionItem = () => {
  const { setUserSearchValue, city, userSearchValue } = useSearchStore();
  const { addRecentSearch } = useRecentSearch();

  const handleItemEvent = (item: Item, index: number) => {
    splunkSearchInstance().sendEvent({
      group: 'suggestion_events',
      type: 'record_click',
      event: {
        data: {
          item: {
            ...item,
            title: removeHtmlTagInString(item.title!),
          },
          searched_text: userSearchValue ? userSearchValue : item.name,
          city,
          current_url: window.location.href,
          position: index + 1,
          terminal_id: getCookie('terminal_id'),
        },
      },
    });
  };

  const handleItemClick = (item: Item, index: number) => {
    handleItemEvent(item, index);
    if (item.use_suggestion) {
      setUserSearchValue(item?.name ?? '');
    } else {
      window.location.href = item.url ?? '#';
    }
    addRecentSearch(item);
  };

  return { handleItemClick, handleItemEvent };
};
