import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import useResponsive from '@/common/hooks/useResponsive';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { SearchBar } from '../../components/suggestion/searchBar';
import SuggestionCentent from '../../components/suggestion/suggestionCentent';
import { useSearchStore } from '../../store/search';

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
      enabled: false,
    },
  );
  const [items, setItems] = useState([]);
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
    setIsShouldOpen(false);
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
    searchSuggestion.remove();
    searchSuggestion.refetch();
    if (userSearchValue) {
      openSuggestionContent();
    }
    city.id !== '-1' && setCookie('new-city', city);
  }, [userSearchValue, city]);

  useEffect(() => {
    if (searchSuggestion.isSuccess) setItems(searchSuggestion.data?.data ?? []);
  }, [searchSuggestion.status]);

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

  return (
    <div className="w-full lg:w-[50rem] relative" ref={ref}>
      <SearchBar
        isOpenSuggestion={isOpenSuggestion}
        onClickSearchInput={openSuggestionContent}
        onClickBackButton={clickBackButton}
        onEnter={handleRedirectToSearch}
        className={{
          'rounded-br-none rounded-bl-none rounded-tr-3xl rounded-tl-3xl': isOpenSuggestion,
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
              />
            ) : undefined
          }
          items={items}
          className="shadow-md border border-solid border-slate-200"
        />
      )}
    </div>
  );
};

export default Suggestion;
