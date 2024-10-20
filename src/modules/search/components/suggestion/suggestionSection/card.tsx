/* eslint-disable @next/next/no-img-element */
import Text from '@/common/components/atom/text';
import classNames from '@/common/utils/classNames';
import { useSuggestionItem } from '@/modules/search/hooks/useSuggestionItemClick';
import { Item } from '@/modules/search/types/suggestion';
import getConfig from 'next/config';
import style from './section.module.css';
import { Fragment } from '@/common/fragment';
import { useSearchStore } from '@/modules/search/store/search';
import { useMemo } from 'react';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
const { publicRuntimeConfig } = getConfig();
import SearchGlobalContextsProvider from '../../../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';

interface CardSectionProps {
  items: Item[];
}

export const CardSection = (props: CardSectionProps) => {
  const { items } = props;
  const { handleItemClick } = useSuggestionItem();
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const city = useSearchStore(state => state.city);
  const useMainSearchRequest = useFeatureIsOn('use-main-search-request-for-card-search-suggestion');

  const fragmentProps = useMemo(
    () => ({
      searchQuery: userSearchValue,
      searchOptionalFilters: city?.id !== '-1' ? { city_id: [city?.id] } : {},
      suggestionExecutionSource: true,
    }),
    [],
  );

  if (useMainSearchRequest) {
    return (
      <SearchGlobalContextsProvider>
        <Fragment name="SearchRequest" props={{ ...fragmentProps }} />
      </SearchGlobalContextsProvider>
    );
  }

  return (
    <div className="py-2 space-y-1 bg-white">
      {items?.map((item, index) => (
        <div
          key={index}
          className={classNames('flex items-center cursor-pointer py-1 px-3 rounded-lg space-s-3', style.wrapper)}
          onClick={() => handleItemClick(item, index)}
        >
          <div>
            <img
              src={`${publicRuntimeConfig.CDN_BASE_URL}${item.image}`}
              alt=""
              className="rounded-full w-11 min-w-[2.75rem]"
              width={44}
              height={44}
            />
          </div>
          <div className="flex flex-col">
            <Text
              className={style.title}
              fontWeight="medium"
              fontSize="sm"
              dangerouslySetInnerHTML={{ __html: item.formatted_title ?? '' ?? '' }}
            />
            <Text fontSize="xs" className="line-clamp-1">
              {item.sub_title}
            </Text>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
