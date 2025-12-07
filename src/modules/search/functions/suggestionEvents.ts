import { sendGaEvent } from '@/common/services/sendGaEvent';
import { splunkInstance } from '@/common/services/splunk';
import optimizeLogging from '@/common/utils/optimizeLogging';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { getCookie } from 'cookies-next';
import { Item, Section } from '../types/suggestion';

type ItemClick = {
  userSearchValue: string;
  index: number;
  cityName: string;
  item: Item;
};

export const suggestionEvents = {
  itemClick: ({ userSearchValue, index, cityName, item }: ItemClick) => {
    const { name, title } = item;
    sendGaEvent({
      action: 'Search Suggestion',
      category: 'Search Suggestion Click Result',
      label: `Search Suggestion ${item.formatted_title}`,
    });
    optimizeLogging(() => {
      splunkInstance('search').sendEvent({
        group: 'suggestion_events',
        type: 'record_click',
        event: {
          data: {
            item: {
              ...item,
              title: removeHtmlTagInString(title!),
            },
            searched_text: userSearchValue ? userSearchValue : name,
            city: cityName,
            current_url: window.location.href,
            position: index + 1,
            terminal_id: getCookie('terminal_id'),
          },
        },
      });
    });
  },
  view: ({ cityName, userSearchValue, item }: { cityName: string; userSearchValue: string; item: Section[] }) => {
    optimizeLogging(() => {
      splunkInstance('search').sendEvent({
        group: 'suggestion_events',
        type: 'suggestion_view',
        event: {
          data: {
            result_count: item.map(suggestionItems => suggestionItems.items).flat().length,
            city: cityName,
            searched_text: userSearchValue,
            current_url: window.location.href,
            terminal_id: getCookie('terminal_id'),
          },
        },
      });
    });
  },
  open: ({ cityName }: { cityName: string }) => {
    optimizeLogging(() => {
      splunkInstance('search').sendEvent({
        group: 'suggestion_events',
        type: 'suggestion_open',
        event: {
          data: {
            city: cityName,
            current_url: window.location.href,
            terminal_id: getCookie('terminal_id'),
          },
        },
      });
    });
  },
};

export default suggestionEvents;
