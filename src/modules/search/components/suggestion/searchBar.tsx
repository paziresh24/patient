import clsx from 'clsx';
import { useRouter } from 'next/router';
import { MouseEventHandler } from 'react';
import { useSearchStore } from '../../store/search';
import CitySelect from './suggestionAtoms/citySelect';
import { SearchInput } from './suggestionAtoms/searchInput';

interface SearchBarProps {
  isOpenSuggestion?: boolean;
  onClickSearchInput?: MouseEventHandler<HTMLInputElement>;
  onClickBackButton?: () => void;
  onEnter?: (text: string) => void;
  className?: string | object;
}

export const SearchBar = (props: SearchBarProps) => {
  const router = useRouter();
  const { isOpenSuggestion, onClickSearchInput, onClickBackButton, onEnter, className } = props;
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
        placeholder="نام بیماری، تخصص، پزشک، مرکز درمانی و ..."
        onClick={onClickSearchInput}
        onChange={e => setUserSearchValue(e.target.value)}
        value={userSearchValue}
        showBackButton={isOpenSuggestion}
        clickBackButton={onClickBackButton}
        clikSearchButton={() => onEnter && onEnter(userSearchValue)}
        onKeyDown={e => e.keyCode === 13 && onEnter && onEnter(e.currentTarget?.value)}
      />
      <hr className="border border-solid border-slate-200 h-7" />
      <CitySelect city={city} setCity={setCity} key={city.name} />
    </div>
  );
};
