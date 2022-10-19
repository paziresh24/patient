import Divider from '@/common/components/atom/divider';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import dynamic from 'next/dynamic';
import { useSearchStore } from '../../store/search';
import { SearchInput, SearchInputProps } from './suggestionAtoms/searchInput';
const CitySelect = dynamic(() => import('./suggestionAtoms/citySelect'));

interface SearchBarProps extends Omit<SearchInputProps, 'className'> {
  isOpenSuggestion?: boolean;
  onClickSearchInput?: () => void;
  onClickBackButton?: () => void;
  onEnter?: (text: string) => void;
  className?: string | object;
}

export const SearchBar = (props: SearchBarProps) => {
  const { t } = useTranslation('search');
  const { isOpenSuggestion, onClickSearchInput, onClickBackButton, onEnter, className, ...rest } = props;
  const city = useSearchStore(state => state.city);
  const setCity = useSearchStore(state => state.setCity);
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);

  return (
    <div
      className={clsx(
        'w-full bg-white rounded-full border border-solid border-slate-200 py-1 px-3 flex items-center transition-shadow',
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
        onKeyDown={e => e.keyCode === 13 && onEnter && onEnter(e.currentTarget?.value)}
        {...rest}
      />
      <Divider orientation="vertical" height="2rem" />
      <CitySelect onChange={() => onClickSearchInput && onClickSearchInput()} city={city} setCity={setCity} key={city.name} />
    </div>
  );
};
