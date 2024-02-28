import { useClickThroughRate } from '@/common/apis/services/search/clickThroughRate';
import { useStat } from '@/common/apis/services/search/position';
import Button from '@/common/components/atom/button';
import Skeleton from '@/common/components/atom/skeleton';
import { sendGaEvent } from '@/common/services/sendGaEvent';
import { getCookie } from 'cookies-next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Card from '../../components/card';
import { Result as ResultType, useSearch } from '../../hooks/useSearch';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { splunkInstance } from '@/common/services/splunk';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { useSearchStore } from '../../store/search';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Fragment } from '@/common/fragment';
const CategoryCard = dynamic(() => import('../../components/categoryCard'), {
  loading: () => <Loading line />,
});
const NotFound = dynamic(() => import('../../components/notFound'));
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const Result = () => {
  const {
    query: { params, ...query },
    asPath,
    ...router
  } = useRouter();

  const { result, pagination, total, isLanding, isLoading, isSuccess, selectedFilters, search } = useSearch();
  const { changeRoute } = useSearchRouting();
  const sendPositionStatEvent = useStat();
  const sendClickThroughRateEvent = useClickThroughRate();
  const userInfo = useUserInfoStore(state => state.info);
  const city = useSearchStore(state => state.city);
  const geoLocation = useSearchStore(state => state.geoLocation);
  const shouldUseDirectClickPositionEvent = useFeatureIsOn('search:use-direct-splunk-click-position');
  const useFragmentProductCard = useFeatureIsOn('search:use-fragment-card-product');

  const handleNextPage = () => {
    const currentPage = (query?.page as string) ? (query?.page as string) : 1;
    changeRoute({
      query: {
        page: +currentPage + 1,
      },
      scroll: false,
    });
  };

  const handleClickEelmentEvent = (item: ResultType, elementName: string, elementContent?: string) => {
    sendClickThroughRateEvent.mutate({
      terminal_id: (getCookie('terminal_id') as string) ?? '',
      id: item.id,
      position: item.position,
      query_id: search.query_id,
      server_id: item.server_id,
      type: item.type,
    });
    if (shouldUseDirectClickPositionEvent) {
      splunkInstance('search').sendEvent({
        sourcetype: '_json',
        event: {
          event_group: 'search_metrics',
          event_type: 'search_click_position',
          current_url: window.location.href,
          terminal_id: getCookie('terminal_id') as string,
          is_application: false,
          card_data: {
            action: item.actions?.map?.(item =>
              JSON.stringify({ outline: item.outline, title: item.title, top_title: removeHtmlTagInString(item.top_title) }),
            ),
            _id: item._id,
            position: item.position,
            server_id: item.server_id,
            title: item.title,
            type: item.type,
            url: item.url,
            rates_count: item.rates_count,
            satisfaction: item.satisfaction,
            element_name: elementName,
            element_content: elementContent ?? '',
          },
          filters: selectedFilters,
          result_count: result.length,
          location: city.en_slug,
          city_id: city.id,
          ...(geoLocation ?? {}),
          query_id: search.query_id,
          user_id: userInfo.id,
          user_type: userInfo.provider?.job_title ?? 'normal-user',
          url: {
            href: window.location.href,
            query,
            pathname: window.location.pathname,
            host: window.location.host,
          },
        },
      });
    } else {
      sendPositionStatEvent.mutate({
        id: item._id,
        filters: selectedFilters,
        position: item.position,
        route: asPath,
        card_data: {
          ...item,
          ...(item.type === 'doctor' && { centers_types: item.centers.map(center => center.center_type) }),
          element_name: elementName,
          element_content: elementContent ?? '',
        },
        terminal_id: getCookie('terminal_id') as string,
      });
    }
    sendGaEvent({
      action: 'CardSearchClick',
      category: `Card${item.position}`,
      label: `${window.location.href}&docName=${item.title}`,
    });
  };

  return (
    <div className="flex flex-col w-full space-y-3">
      {!isLoading && result.length === 0 && <NotFound />}
      {result.map((item, index) =>
        isLanding ? (
          <CategoryCard key={index} url={item.url} count={item.count} image={item.image} title={item.title} />
        ) : (
          <>
            {useFragmentProductCard ? (
              <Fragment
                key={index}
                name="ProductCard"
                props={{
                  title: item.title,
                  avatarSrc: publicRuntimeConfig.CDN_BASE_URL + item.image,
                  subTitle: item.display_expertise,
                  badges: item.badges,
                  actionButtons: item.actions,
                  rateCount: item.rates_count,
                  satisfactionPercent: item.satisfaction,
                  address: item.display_address,
                  price: item.price,
                  avatarVerifiedTick: !item.is_bulk,
                  avatarRingColor: item.is_bulk ? null : 'blue',
                  avatarAltText: `${item.prefix} ${item.title} ${item.display_expertise}`,
                  url: {
                    destination: item.url,
                    title: `${item.prefix} ${item.title} ${item.display_expertise}`,
                  },
                  eventTrigger: (elementName: string, elementContent: string) => handleClickEelmentEvent(item, elementName, elementContent),
                }}
              />
            ) : (
              <Card
                key={index}
                alt={`${item.prefix} ${item.title} ${item.display_expertise}`}
                baseInfo={{
                  displayName: item.title,
                  avatar: item.image,
                  expertise: item.display_expertise,
                  isVerify: !item.is_bulk,
                  rate: {
                    count: item.rates_count,
                    satisfaction: item.satisfaction,
                  },
                  url: item.url,
                }}
                type={item.type}
                details={{
                  address: { text: item.display_address },
                  price: item.price,
                  badges: item.badges,
                }}
                actions={item?.actions?.map(action => ({
                  text: action.title,
                  description: action.top_title,
                  outline: action.outline,
                  action: () => {
                    router.push(action.url);
                  },
                }))}
                avatarPriority={index <= 1}
                sendEventWhenClick={({ element, content }) => handleClickEelmentEvent(item, element, content)}
              />
            )}
          </>
        ),
      )}
      {isLoading && <Loading line={isLanding} />}
      {isSuccess && !isLoading && !isLanding && total > Number(pagination.limit) * pagination.page && (
        <Button variant="secondary" className="self-center !my-8 !px-10" onClick={handleNextPage}>
          نمایش بیشتر
        </Button>
      )}
    </div>
  );
};

const Loading = ({ line = false }: { line?: boolean }) => {
  return (
    <>
      <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
      <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
      <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
      {line && (
        <>
          <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
          <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
          <Skeleton w="100%" h={line ? '3.6rem' : '15rem'} rounded="lg" />
        </>
      )}
    </>
  );
};

export default Result;
