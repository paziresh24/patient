import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import useLockScroll from '@/common/hooks/useLockScroll';
import useResponsive from '@/common/hooks/useResponsive';
import useVirtualBack from '@/common/hooks/useVirtualBack';
import { getCookie } from 'cookies-next';
import debounce from 'lodash/debounce';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import SearchBar from '../../components/suggestion/searchBar';
import suggestionEvents from '../../functions/suggestionEvents';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';
import { Section } from '../../types/suggestion';
import toast from 'react-hot-toast';

const SuggestionContent = dynamic(() => import('../../components/suggestion/suggestionContent'));
interface SuggestionProps {
  overlay?: boolean;
  defaultOpen?: boolean;
  autoFocus?: boolean;
}

export const Suggestion = (props: SuggestionProps) => {
  const { overlay = false, defaultOpen = false, autoFocus } = props;
  const router = useRouter();
  const isOpenSuggestion = useSearchStore(state => state.isOpenSuggestion);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const setGeoLocation = useSearchStore(state => state.setGeoLocation);
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
  useClickAway(ref, () => !isMobile && !overlay && handleClose());
  const handleClose = () => {
    setIsOpenSuggestion(false);
    openScroll();
    removeBack();
  };
  const { neutralizeBack, removeBack } = useVirtualBack({
    handleClose,
  });
  const { lockScroll, openScroll } = useLockScroll();

  const openSuggestionContent = () => {
    if (isOpenSuggestion) return;
    if (isMobile || overlay) {
      neutralizeBack();
      lockScroll();
    }
    setIsOpenSuggestion(true);
    suggestionEvents.open({
      cityName: city.name,
    });
  };

  const clickBackButton = () => {
    handleClose();
    setUserSearchValue('');
  };

  useEffect(() => {
    if (defaultOpen) setIsOpenSuggestion(true);
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
    debounce(({ item, cityName, userSearchValue }: { item: Section[]; cityName: string; userSearchValue: string }) => {
      suggestionEvents.view({
        cityName: cityName,
        item,
        userSearchValue,
      });
    }, 2000),
    [],
  );

  useEffect(() => {
    setIsLoading(true);
  }, [userSearchValue, city]);

  const handleRedirectToSearch = (text: string) => {
    handleClose();
    changeRoute({
      params: { ...(city?.id !== '-1' && { city: city?.en_slug }) },
      query: {
        text: text,
      },
    });
  };

  useEffect(() => {
    if (searchSuggestion.data && isOpenSuggestion) {
      setIsLoading(false);
      if (userSearchValue)
        sendSuggestionViewEvent({
          item: searchSuggestion.data,
          cityName: city.name,
          userSearchValue,
        });
    }
  }, [searchSuggestion.data, isOpenSuggestion]);

  const [isGPSLoading, setIsGPSLoading] = useState(false);
  const onChangeCity = (city: any) => {
    setCity({
      ...city,
    });
    if (city.is_aroundme) {
      setIsGPSLoading(true);
      navigator.geolocation.getCurrentPosition(
        position => {
          setIsGPSLoading(false);
          let lat = position.coords.latitude;
          let long = position.coords.longitude;
          setGeoLocation({
            lat,
            lon: long,
          });
          router.pathname.startsWith('/s/') &&
            changeRoute({
              params: { city: 'ir' },
              query: {
                ...(router.query.city_id && { city_id: city.id }),
                lat,
                lon: long,
              },
            });
        },
        () => {
          setIsGPSLoading(false);
          toast.error('خطا در دریافت موقعیت مکانی');
        },
      );
      return;
    }
    setGeoLocation(undefined);
    router.pathname.startsWith('/s/') &&
      changeRoute({
        params: { city: city.en_slug },
        query: {
          ...(router.query.city_id && { city_id: city.id }),
        },
        previousQueries: false,
      });
  };

  return (
    <div className="w-full px-4 py-2 md:px-0 lg:w-[50rem] relative" ref={ref}>
      {isOpenSuggestion && overlay && (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-infinity bg-slate-900 bg-opacity-60" id="modal" onClick={handleClose} />
      )}
      <SearchBar
        isOpenSuggestion={isOpenSuggestion}
        isGPSLoading={isGPSLoading}
        onClickSearchInput={openSuggestionContent}
        onClickBackButton={clickBackButton}
        onChangeCity={onChangeCity}
        onEnter={handleRedirectToSearch}
        className={{
          'md:rounded-br-none md:rounded-bl-none md:rounded-tr-3xl md:rounded-tl-3xl z-infinity relative': isOpenSuggestion,
          'hover:md:shadow-lg': !isOpenSuggestion,
        }}
        readOnly={isMobile}
        autoFocus={autoFocus}
      />
      {isOpenSuggestion && (
        <SuggestionContent
          searchInput={
            isMobile ? (
              <SearchBar
                onEnter={handleRedirectToSearch}
                isOpenSuggestion={isOpenSuggestion}
                isGPSLoading={isGPSLoading}
                onClickBackButton={clickBackButton}
                onChangeCity={onChangeCity}
                className="!border-primary"
                autoFocus
              />
            ) : undefined
          }
          items={searchSuggestion.data ?? []}
          className="border border-solid shadow-md border-slate-200"
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default Suggestion;
