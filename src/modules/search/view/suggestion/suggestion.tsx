import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import useResponsive from '@/common/hooks/useResponsive';
import { getCookie, setCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { SearchBar } from '../../components/suggestion/searchBar';
import { useSearchStore } from '../../store/search';
const SuggestionCentent = dynamic(() => import('../../components/suggestion/suggestionCentent'));

export const Suggestion = () => {
  const [isOpenSuggestion, setIsShouldOpen] = useState(false);
  const { isMobile } = useResponsive();
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);
  const city = useSearchStore(state => state.city);
  const setCity = useSearchStore(state => state.setCity);
  const searchSuggestion = useSearchSuggestion(
    {
      query: userSearchValue,
      ...(city.id !== '-1' && { city_id: city.id }),
    },
    {
      keepPreviousData: true,
    },
  );
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => !isMobile && setIsShouldOpen(false));

  const openSuggestionContent = () => {
    setIsShouldOpen(true);
  };

  const clickBackButton = () => {
    setIsShouldOpen(false);
    setUserSearchValue('');
  };

  useEffect(() => {
    try {
      const getCityInCookie = JSON.parse(getCookie('new-city') as string);
      if (getCityInCookie) {
        setCity({
          ...getCityInCookie,
        });
      }
    } catch (error) {
      return;
    }
  }, []);

  useEffect(() => {
    if (userSearchValue) {
      openSuggestionContent();
    }
    city.id !== '-1' && setCookie('new-city', city);
    setIsLoading(true);
  }, [userSearchValue, city]);

  useEffect(() => {
    if (isOpenSuggestion && isMobile) {
      neutralizeBack();
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
      if (isMobile) {
        window.onpopstate = () => {
          return;
        };
      }
    }
  }, [isOpenSuggestion, isMobile]);

  const handleClose = () => {
    setIsShouldOpen(false);
  };

  const neutralizeBack = () => {
    if (isMobile) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.onpopstate = () => {
          return;
        };
        handleClose();
      };
    }
  };

  const handleRedirectToSearch = (text: string) => {
    location.assign(`/s/${city?.en_slug}/?text=${text ?? ''}`);
  };

  const suggestionItems = useMemo(() => {
    setIsLoading(false);
    return searchSuggestion.data?.data ?? [];
  }, [searchSuggestion.data]);

  return (
    <div className="w-full lg:w-[50rem] relative" ref={ref}>
      <SearchBar
        isOpenSuggestion={isOpenSuggestion}
        onClickSearchInput={openSuggestionContent}
        onClickBackButton={clickBackButton}
        onEnter={handleRedirectToSearch}
        className={{
          'md:rounded-br-none md:rounded-bl-none md:rounded-tr-3xl md:rounded-tl-3xl': isOpenSuggestion,
          'hover:md:shadow-lg': !isOpenSuggestion,
        }}
      />
      {isOpenSuggestion && (
        <SuggestionCentent
          searchInput={
            isMobile ? (
              <SearchBar
                onEnter={handleRedirectToSearch}
                isOpenSuggestion={isOpenSuggestion}
                onClickBackButton={clickBackButton}
                className="!border-primary"
                autoFocus
              />
            ) : undefined
          }
          items={suggestionItems}
          className="border border-solid shadow-md border-slate-200"
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Suggestion;
