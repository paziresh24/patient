import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { SearchInput } from '../../components/suggestion/searchInput';
import SuggestionCentent from '../../components/suggestion/suggestionCentent';
import CitySelect from '../citySelect/citySelect';

export const Suggestion = () => {
  const [shouldOpen, setShouldOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const searchSuggestion = useSearchSuggestion({
    query: userInput,
  });
  const [items, setItems] = useState([]);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => setShouldOpen(false));

  const clickSerchInput = () => {
    setShouldOpen(true);
  };

  useEffect(() => {
    searchSuggestion.remove();
    searchSuggestion.refetch();
  }, [userInput]);

  useEffect(() => {
    if (searchSuggestion.isSuccess) setItems(searchSuggestion.data?.data ?? []);
  }, [searchSuggestion.status]);

  return (
    <div className="w-full md:w-3/6 relative" ref={ref}>
      <div
        className={clsx('w-full bg-white rounded-full border border-solid border-slate-200 p-1 flex items-center transition-shadow', {
          'rounded-br-none rounded-bl-none rounded-tr-3xl rounded-tl-3xl border-transparent': shouldOpen,
          'hover:shadow-lg': !shouldOpen,
        })}
      >
        <SearchInput
          placeholder="نام بیماری، تخصص، پزشک، مرکز درمانی و ..."
          onClick={clickSerchInput}
          onChange={e => setUserInput(e.target.value)}
        />
        <hr className="border border-solid border-slate-200 h-7" />
        <CitySelect />
      </div>
      {shouldOpen && <SuggestionCentent items={items} className="shadow-md" />}
    </div>
  );
};

export default Suggestion;
