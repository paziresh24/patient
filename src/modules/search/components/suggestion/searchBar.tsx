import Divider from '@/common/components/atom/divider';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { useSearchStore } from '../../store/search';
import { SearchInput, SearchInputProps } from './suggestionAtoms/searchInput';
const CitySelect = dynamic(() => import('./suggestionAtoms/citySelect'));

interface SearchBarProps extends Omit<SearchInputProps, 'className' | 'autoFocus'> {
  isOpenSuggestion?: boolean;
  onClickSearchInput?: () => void;
  onClickBackButton?: () => void;
  onEnter?: (text: string) => void;
  className?: string | object;
  onChangeCity: (value: any) => void;
  autoFocus?: boolean;
}

export const SearchBar = (props: SearchBarProps) => {
  const { t } = useTranslation('search');
  const { isOpenSuggestion, onClickSearchInput, onClickBackButton, onEnter, className, onChangeCity, autoFocus, ...rest } = props;
  const city = useSearchStore(state => state.city);
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [autoFocus]);

  return (
    <div
      className={clsx(
        'w-full bg-white rounded-full border border-solid border-slate-200 py-1 px-3 pl-2 flex items-center transition-shadow space-s-1',
        className,
      )}
    >
      <SearchInput
        placeholder={t('searchBarPlaceHolder')}
        onClick={onClickSearchInput}
        onChange={e => setUserSearchValue(e.target.value)}
        onClear={() => setUserSearchValue('')}
        value={userSearchValue}
        showBackButton={isOpenSuggestion}
        clickBackButton={onClickBackButton}
        clikSearchButton={() => onEnter && onEnter(userSearchValue)}
        onKeyPress={e => e.key === 'Enter' && onEnter && onEnter(e.currentTarget?.value)}
        ref={searchInputRef}
        {...rest}
      />
      <Divider orientation="vertical" height="2rem" />
      <CitySelect onChange={onChangeCity} city={city} key={city?.name} />
    </div>
  );
};
