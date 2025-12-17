import SearchIcon from '@/common/components/icons/search';
import { useSearchStore } from '../../store/search';
import { useEffect, useState } from 'react';
import useLockScroll from '@/common/hooks/useLockScroll';
import useCustomize from '@/common/hooks/useCustomize';

export const ButtonSuggestion = () => {
  const isOpenSuggestion = useSearchStore(state => state.isOpenSuggestion);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { openScroll } = useLockScroll();
  const customize = useCustomize(state => state.customize);
  const [SuggestionComponent, setSuggestionComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    setIsOpenSuggestion(false);
    openScroll();
  }, []);

  const handleClick = async () => {
    if (!SuggestionComponent) {
      const { default: Component } = await import('./suggestion');
      setSuggestionComponent(() => Component);
    }
    setIsOpenSuggestion(true);
  };

  return (
    <>
      <SearchIcon className="cursor-pointer" onClick={handleClick} />
      {isOpenSuggestion && SuggestionComponent && (
        <div className="fixed left-0 right-0 flex items-center justify-center md:top-36 z-infinity">
          <SuggestionComponent showPlasmicSuggestion={!customize.partnerKey} overlay autoFocus defaultOpen />
        </div>
      )}
    </>
  );
};

export default ButtonSuggestion;
