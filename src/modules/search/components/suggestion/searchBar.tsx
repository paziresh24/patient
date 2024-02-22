import Divider from '@/common/components/atom/divider';
import useCustomize from '@/common/hooks/useCustomize';
import classNames from '@/common/utils/classNames';
import useTranslation from 'next-translate/useTranslation';
import { useSearchStore } from '../../store/search';
import CitySelect from './suggestionAtoms/citySelect';
import { SearchInput, SearchInputProps } from './suggestionAtoms/searchInput';

interface SearchBarProps extends Omit<SearchInputProps, 'className'> {
  isOpenSuggestion?: boolean;
  isGPSLoading: boolean;
  onClickSearchInput?: () => void;
  onClickBackButton?: () => void;
  onEnter?: (text: string) => void;
  className?: string | object;
  onChangeCity: (value: any) => void;
}

export const SearchBar = (props: SearchBarProps) => {
  const { t } = useTranslation('search');
  const { isOpenSuggestion, isGPSLoading, onClickSearchInput, onClickBackButton, onEnter, className, onChangeCity, ...rest } = props;
  const city = useSearchStore(state => state.city);
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);
  const customize = useCustomize(state => state.customize);

  return (
    <div
      className={classNames(
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
        id="suggestion-search-input"
        {...rest}
      />
      {customize.showSelectCityInSuggestion && (
        <>
          <Divider orientation="vertical" height="2rem" />
          <CitySelect isGPSLoading={isGPSLoading} onChange={onChangeCity} city={city} key={city?.name} />
        </>
      )}
    </div>
  );
};

export default SearchBar;
