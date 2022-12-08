import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkSearchInstance } from '@/common/services/splunk';
import { getCookie } from 'cookies-next';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { SearchBar } from '../../components/suggestion/searchBar';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';
const SuggestionCentent = dynamic(() => import('../../components/suggestion/suggestionCentent'));
interface SuggestionProps {
  overlay?: boolean;
}

export const Suggestion = (props: SuggestionProps) => {
  const { overlay = false } = props;
  const router = useRouter();
  const isOpenSuggestion = useSearchStore(state => state.isOpenSuggestion);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { isMobile } = useResponsive();
  const userSearchValue = useSearchStore(state => state.userSearchValue);
  const setUserSearchValue = useSearchStore(state => state.setUserSearchValue);
  const city = useSearchStore(state => state.city);
  const setCity = useSearchStore(state => state.setCity);
  const { changeRoute } = useSearchRouting();
  const searchSuggestion = useSearchSuggestion(
    {
      query: userSearchValue,
      ...(city?.id !== '-1' && { city_id: city?.id }),
    },
    {
      keepPreviousData: true,
    },
  );
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => !isMobile && setIsOpenSuggestion(false));

  const openSuggestionContent = () => {
    setIsOpenSuggestion(true);
  };

  const clickBackButton = () => {
    setIsOpenSuggestion(false);
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

  const sendSuggestionViewEvent = useCallback(
    debounce(data => {
      splunkSearchInstance().sendEvent({
        group: 'suggestion_events',
        type: 'suggestion_view',
        event: {
          data: {
            result_count: data?.map((suggestionItems: any) => suggestionItems.items).flat().length,
            city: city.name,
            searched_text: userSearchValue,
            current_url: window.location.href,
            uuid: getCookie('terminal_id'),
          },
        },
      });
    }, 2000),
    [],
  );

  useEffect(() => {
    setIsLoading(true);
  }, [userSearchValue, city]);

  useEffect(() => {
    if (isOpenSuggestion && (isMobile || overlay)) {
      neutralizeBack();
      document.body.classList.add('overflow-hidden');
      document.body.classList.add('md:pr-[0.3rem]');
    } else {
      document.body.classList.remove('overflow-hidden');
      document.body.classList.remove('md:pr-[0.3rem]');
      if (isMobile) {
        window.onpopstate = () => {
          return;
        };
      }
    }
  }, [isOpenSuggestion, isMobile]);

  const handleClose = () => {
    setIsOpenSuggestion(false);
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
    setIsOpenSuggestion(false);
    changeRoute({
      params: { ...(city?.id !== '-1' && { city: city?.en_slug }) },
      query: {
        text: text,
      },
    });
  };

  const suggestionItems = useMemo(() => {
    setIsLoading(false);
    sendSuggestionViewEvent(searchSuggestion.data?.data);
    return searchSuggestion.data?.data ?? [];
  }, [searchSuggestion.data]);

  const onChangeCity = (city: any) => {
    setCity({
      ...city,
    });
    router.pathname.startsWith('/s/') && changeRoute({ params: { city: city.en_slug } });
  };

  return (
    <div className="w-full lg:w-[50rem] relative" ref={ref}>
      <SearchBar
        isOpenSuggestion={isOpenSuggestion}
        onClickSearchInput={openSuggestionContent}
        onClickBackButton={clickBackButton}
        onChangeCity={onChangeCity}
        onEnter={handleRedirectToSearch}
        className={{
          'md:rounded-br-none md:rounded-bl-none md:rounded-tr-3xl md:rounded-tl-3xl z-infinity relative': isOpenSuggestion,
          'hover:md:shadow-lg': !isOpenSuggestion,
        }}
        readOnly={isMobile}
      />
      {isOpenSuggestion && (
        <SuggestionCentent
          searchInput={
            isMobile ? (
              <SearchBar
                onEnter={handleRedirectToSearch}
                isOpenSuggestion={isOpenSuggestion}
                onClickBackButton={clickBackButton}
                onChangeCity={onChangeCity}
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
      {isOpenSuggestion && overlay && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-20 bg-slate-900 bg-opacity-60" onClick={handleClose} />
      )}
    </div>
  );
};

export default Suggestion;
