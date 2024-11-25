'use client';

import Divider from '@/common/components/atom/divider';
import useCustomize from '@/common/hooks/useCustomize';
import classNames from '@/common/utils/classNames';
import useTranslation from 'next-translate/useTranslation';
import { useSearchStore } from '../../store/search';
import CitySelect from './suggestionAtoms/citySelect';
import { SearchInput, SearchInputProps } from './suggestionAtoms/searchInput';
import SearchGlobalContextsProvider from '../../../../../.plasmic/plasmic/paziresh_24_search/PlasmicGlobalContextsProvider';
import { Fragment } from '@/common/fragment';

interface SearchBarProps extends Omit<SearchInputProps, 'className'> {
  isOpenSuggestion?: boolean;
  onClickSearchInput?: () => void;
  onClickBackButton?: () => void;
  onEnter?: (text: string) => void;
  className?: string | object;
  onChangeCity: (value: any) => void;
}

export const SearchBarPlasmic = () => {
  const { t } = useTranslation('search');
  // const { isOpenSuggestion, onClickSearchInput, onClickBackButton, onEnter, className, onChangeCity, ...rest } = props;
  const city = useSearchStore(state => state.city);
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);
  const customize = useCustomize(state => state.customize);

  return (
    <div className="w-full py-2 px-2 md:px-0 lg:w-[50rem] relative">
      <SearchGlobalContextsProvider>
        <Fragment
          name="SearchInput"
          props={{
            onClickCity: (value: any) => console.log(value),
            OnInputValueChange: (value: string) => setUserSearchValue(value),
            inputValue: userSearchValue,
          }}
          variants={{
            hasOverlay: true,
          }}
        />
      </SearchGlobalContextsProvider>
    </div>
  );
};

export default SearchBarPlasmic;

