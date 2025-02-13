import SearchIcon from '@/common/components/icons/search';
import dynamic from 'next/dynamic';
import { useSearchStore } from '../../store/search';
import { useEffect } from 'react';
import useLockScroll from '@/common/hooks/useLockScroll';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
const Suggestion = dynamic(() => import('./suggestion'));

export const ButtonSuggestion = () => {
  const isOpenSuggestion = useSearchStore(state => state.isOpenSuggestion);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { openScroll } = useLockScroll();
  const showPlasmicSuggestion = useFeatureIsOn('search_plasmic_suggestion');

  useEffect(() => {
    setIsOpenSuggestion(false);
    openScroll();
  }, []);

  return (
    <>
      <SearchIcon className="cursor-pointer" onClick={() => setIsOpenSuggestion(true)} />
      {isOpenSuggestion && (
        <div className="fixed left-0 right-0 flex items-center justify-center md:top-36 z-infinity">
          <Suggestion showPlasmicSuggestion={showPlasmicSuggestion} overlay autoFocus />
        </div>
      )}
    </>
  );
};

export default ButtonSuggestion;
