import SearchIcon from '@/common/components/icons/search';
import dynamic from 'next/dynamic';
import { useSearchStore } from '../../store/search';
const Suggestion = dynamic(() => import('./suggestion'));

export const ButtonSuggestion = () => {
  const isOpenSuggestion = useSearchStore(state => state.isOpenSuggestion);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);

  return (
    <>
      <SearchIcon className="cursor-pointer" onClick={() => setIsOpenSuggestion(true)} />
      {isOpenSuggestion && (
        <div className="fixed left-0 right-0 flex items-center justify-center md:top-36 z-infinity">
          <Suggestion overlay autoFocus />
        </div>
      )}
    </>
  );
};

export default ButtonSuggestion;
