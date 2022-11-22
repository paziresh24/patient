import { sendGaEvent } from '@/common/services/sendGaEvent';
import { splunkSearchInstance } from '@/common/services/splunk';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useSearchStore } from '../store/search';
import { Item } from '../types/suggestion';
import { useRecentSearch } from './useRecentSearch';

export const useSuggestionItem = () => {
  const router = useRouter();
  const { setUserSearchValue, city, userSearchValue } = useSearchStore();
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { addRecentSearch } = useRecentSearch();

  const handleItemEvent = (item: Item, index: number) => {
    sendGaEvent({
      action: 'Search Suggestion',
      category: 'Search Suggestion Click Result',
      label: `Search Suggestion ${item.formatted_title}`,
    });
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
    addRecentSearch(item);
    if (item.use_suggestion) {
      setUserSearchValue(item?.name ?? '');
    } else if (item.absolute_url) {
      window.location.href = item.url ?? '#';
    } else {
      router.push(item.url ?? '/s', undefined, { shallow: true, scroll: true });
      setIsOpenSuggestion(false);
      setTimeout(() => setUserSearchValue(''), 0);
    }
  };

  return { handleItemClick, handleItemEvent };
};
