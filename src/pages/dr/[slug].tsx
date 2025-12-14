import { useIncrementPageView } from '@/common/apis/services/profile/incrementPageView';
import { usePageView } from '@/common/apis/services/profile/pageView';
import Modal from '@/common/components/atom/modal/modal';
import Section from '@/common/components/atom/section/section';
import Text from '@/common/components/atom/text/text';
import InfoIcon from '@/common/components/icons/info';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { pageViewEvent } from '@/modules/profile/events/pageView';
import { getProfileServerSideProps } from '@/modules/profile/functions/getProfileServerSideProps';
import { useProfileSplunkEvent } from '@/modules/profile/hooks/useProfileEvent';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { Aside } from '@/modules/profile/views/aside';
import { sections } from '@/modules/profile/views/sections';
import { addCommas } from '@persian-tools/persian-tools';
import { getCookie } from 'cookies-next';
import config from 'next/config';
import { ReactElement, useEffect, useState } from 'react';
import { growthbook } from '../_app';
import RaviGlobalContextsProvider from '../../../.plasmic/plasmic/ravi_r_r/PlasmicGlobalContextsProvider';
import ProfileGlobalContextsProvider from '../../../.plasmic/plasmic/paziresh_24_profile/PlasmicGlobalContextsProvider';
import { Fragment } from '@/common/fragment';
import { useSearchStore } from '@/modules/search/store/search';
import useLockScroll from '@/common/hooks/useLockScroll';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import ErrorPage from '@/modules/profile/components/errorPage';
import Hamdast from '@/modules/hamdast/render';
import { useProfileClientFetch } from '@/modules/profile/hooks/useProfileClientFetch';
import Loading from '@/common/components/atom/loading';
import { useRouter } from 'next/router';
import Script from 'next/script';

const { publicRuntimeConfig } = config();

const DoctorProfile = (props: any) => {
  const { shouldFetchOnClient, slug: initialSlug, status } = props;
  const { query, ...router } = useRouter();

  const currentSlug = initialSlug ?? query.slug;

  useEffect(() => {
    if (growthbook) {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        slug: currentSlug,
      });
      return () => {
        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          slug: undefined,
        });
      };
    }
  }, [currentSlug, growthbook]);

  const {
    data: clientData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProfileClientFetch(currentSlug, !!shouldFetchOnClient || !props?.information);

  const { customize } = useCustomize();
  const isApplication = useApplication();
  const isWebView = useWebView();
  const addPageView = usePageView();
  const incrementPageView = useIncrementPageView();
  const { recommendEvent } = useProfileSplunkEvent();
  const { handleOpen: handleOpenViewAsModal, modalProps: viewAsModalProps } = useModal();
  const [editable, setEditable] = useState(false);
  const [viewAdData, setViewAsData] = useState({ title: '', url: '' });
  const userInfo = useUserInfoStore(state => state.info);
  const userPending = useUserInfoStore(state => state.pending);
  const setProfileData = useProfileDataStore(state => state.setData);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { openScroll, lockScroll } = useLockScroll();
  const dontShowRateDetails = useFeatureIsOn('ravi_show_external_rate');
  const showHamdastGa = useFeatureIsOn('hamdast::ga');

  const finalProps = (!!shouldFetchOnClient && !props?.information) || (clientData?.props as any)?.information ? clientData?.props : props;

  const {
    slug,
    breadcrumbs,
    information,
    centers,
    media,
    symptomes,
    history,
    onlineVisit,
    similarLinks,
    isBulk,
    expertises,
    feedbacks,
    waitingTimeInfo,
    shouldUseIncrementPageView,
    fragmentComponents,
    hamdastWidgets,
    hamdastWidgetsData,
    user_id,
    dontShowRateAndReviewMessage,
  } = finalProps ?? {};

  useFeedbackDataStore.getState().data = feedbacks?.feedbacks ?? [];

  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      if (url.startsWith('/s') || url.startsWith('/booking')) {
        setIsPageLoading(true);
        lockScroll();
      }
    };

    const handleRouteChangeComplete = () => {
      setIsPageLoading(false);
      openScroll();
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, []);

  useEffect(() => {
    setIsOpenSuggestion(false);
    openScroll();
  }, [currentSlug]);

  useEffect(() => {
    if (information) {
      if (growthbook?.ready && growthbook.getAttributes().slug === slug && !userPending) {
        pageViewEvent({
          information,
          centers,
          expertises,
          history,
          feedbacks,
          isBulk,
          isWebView: !!isWebView || !!isApplication,
          features: {
            ravi_show_external_rate: dontShowRateDetails,
            risman: fragmentComponents?.risman && isBulk,
          },
          viewer_user_id: userInfo?.id,
          enabledWidgets: hamdastWidgets?.map((item: any) => item?.id) ?? [],
          slug,
        });
      }
    }
  }, [dontShowRateDetails, information, slug, growthbook?.getAttributes()?.slug, slug, growthbook?.ready, userPending]);

  useEffect(() => {
    if (information) {
      if (shouldUseIncrementPageView) {
        incrementPageView.mutate({
          provider_id: information.provider_id,
        });
      }

      addPageView.mutate({
        ownerId: information.id,
        serverId: information.server_id,
        type: 'doctor',
      });

      window.doctor = { ...information, centers, expertises, isBulk, slug, history };

      if (information.should_recommend_other_doctors) recommendEvent('loadrecommend');
      setProfileData({ ...information, centers: [...centers], ...expertises, feedbacks });
    }
  }, [isBulk, information, slug, userInfo, shouldUseIncrementPageView, centers, expertises, history, feedbacks]);

  useEffect(() => {
    if (userInfo.provider?.job_title === 'doctor' && slug === userInfo?.provider?.slug) {
      setEditable(true);
      splunkInstance('doctor-profile').sendEvent({
        group: 'profile',
        type: 'view-as',
        event: {
          action: 'page-view',
          doctor: information.display_name,
          slug,
          terminal_id: getCookie('terminal_id'),
        },
      });
    }
  }, [userInfo, slug]);

  const handleViewAs = (key: 'information' | 'gallery' | 'biography' | 'services' | 'workHours') => {
    const views = {
      information: {
        title: 'ویرایش اطلاعات فردی',
        url: '/profile/info?isWebView=1&secretary_phone=off&biography=off&sticky=on',
      },
      biography: {
        title: 'ویرایش توضیحات و بیوگرافی',
        url: '/profile/biography?isWebView=1&sticky=on',
      },
      services: {
        title: 'ویرایش تخصص',
        url: '/profile/expertises?isWebView=1&sticky=on',
      },
      gallery: {
        title: 'ویرایش تصاویر گالری',
        url: '/profile/gallery?isWebView=1',
      },
      workHours: {
        title: 'ویرایش ساعت کاری',
        url: '/setting/workhours?isWebView=1&sticky=on',
      },
    };
    setViewAsData({
      ...views[key],
    });
    splunkInstance('doctor-profile').sendEvent({
      group: 'profile',
      type: 'view-as',
      event: {
        action: `click-${key}`,
        doctor: information.display_name,
        slug,
        terminal_id: getCookie('terminal_id'),
      },
    });
    handleOpenViewAsModal();
  };

  const profileData = {
    information: {
      ...(information ?? {}),
      display_name: information?.display_name,
    },
    centers,
    expertises,
    history,
    onlineVisit,
    waitingTimeInfo,
    feedbacks,
    media,
    symptomes,
    similarLinks,
    isBulk,
    editable,
    handleViewAs,
    customize,
    seo: { breadcrumbs, slug },
    hamdastWidgetsData,
    hamdastWidgets,
    user_id,
  };

  if (!finalProps?.information?.id ? shouldFetchOnClient || isLoading : false) {
    return (
      <div className="flex flex-grow justify-center items-center">
        <Loading width={50} />
      </div>
    );
  }

  if (isError) {
    const clientErrorStatusCode = (error as any)?.response?.status ?? 500;
    return <ErrorPage statusCode={clientErrorStatusCode} refresh={refetch} />;
  }

  if ([404, 500, 504, 410].includes(status) && !shouldFetchOnClient) {
    return <ErrorPage statusCode={status} refresh={refetch} />;
  }

  return (
    <>
      <RaviGlobalContextsProvider>
        <div className="lg:min-w-[320px] w-full lg:max-w-[1160px] mx-auto">
          {hamdastWidgets
            ?.filter?.((item: any) => item?.placement?.includes?.('profile_scripts_tag') && item?.script)
            ?.map((item: any) => (
              <Script key={item?.id} id={item?.id}>
                {item?.script}
              </Script>
            ))}
          <main key={information?.id} className="lg:py-10 pwa:pb-24">
            {editable && (
              <div className="flex items-center p-2 !mb-4 bg-slate-200 lg:mb-0 lg:rounded-md text-slate-600 space-s-1">
                <InfoIcon className="min-w-6" />
                <Text fontSize="sm" fontWeight="medium">
                  پزشک گرامی؛ تغییرات شما بعد از <strong className="font-bold">2 ساعت</strong> در پروفایل نمایش داده می‌شود.
                </Text>
              </div>
            )}

            <div className="lg:float-right lg:w-[670px] mb-3">
              <ProfileGlobalContextsProvider>
                <Fragment
                  name="ProfileHead"
                  props={{
                    pageViewCount: profileData.history?.count_of_page_view,
                    serviceList: profileData.expertises?.expertises?.flatMap(({ alias_title }: any) => alias_title.split('|')) ?? [],
                    displayName: profileData.information.display_name,
                    title: information?.experience ? `${profileData.information?.experience} سال تجربه` : undefined,
                    subTitle: `شماره نظام پزشکی: ${profileData.information?.employee_id}`,
                    imageUrl: profileData.information?.image
                      ? publicRuntimeConfig.CDN_BASE_URL + profileData.information?.image
                      : `https://cdn.paziresh24.com/getImage/p24/search-men/noimage.png`,
                    slug: slug,
                    children: (
                      <div className="flex flex-col w-full gap-2">
                        {hamdastWidgets
                          ?.filter((widget: any) => widget?.placement?.includes?.('head'))
                          ?.map((widget: any) => (
                            <Hamdast
                              key={widget.id}
                              id={widget.id}
                              app={widget?.app}
                              backendData={hamdastWidgetsData?.[widget.id] ?? undefined}
                              profileData={profileData}
                              widgetData={{
                                placement: widget?.placement,
                                placement_metadata: widget.placements_metadata,
                              }}
                            />
                          ))}
                        <RaviGlobalContextsProvider>
                          <div className="self-center cursor-pointer" onClick={() => scrollIntoViewWithOffset('#reviews', 90)}>
                            <Fragment
                              name="RateAndCommentCount2"
                              props={{
                                ...profileData,
                                rateCount: profileData.feedbacks?.details?.count_of_feedbacks,
                                rate:
                                  customize.showRateAndReviews &&
                                  !dontShowRateAndReviewMessage &&
                                  (
                                    (+(profileData.feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                                      +(profileData.feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                                      +(profileData.feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
                                    3
                                  ).toFixed(1),
                                hideRates: profileData.feedbacks?.details?.hide_rates,
                              }}
                            />
                          </div>
                        </RaviGlobalContextsProvider>
                      </div>
                    ),
                  }}
                />
              </ProfileGlobalContextsProvider>
            </div>

            <div className="flex flex-col space-y-3 lg:float-left lg:w-[calc(100%_-_690px)]">
              {isLoading && shouldFetchOnClient && (
                <div className="w-full py-20 flex justify-center items-center">
                  <Loading />
                </div>
              )}

              {/* Continue showing page even if full profile has error */}

              {Aside({ ...profileData, fragmentComponents, hamdast: { ga: showHamdastGa } })
                .filter(({ isShow }: any) => Boolean(isShow))
                .map((section: any, index: number) => (
                  <Section key={index} {...section}>
                    {section.children(section?.function?.())}
                  </Section>
                ))}
            </div>

            <div className="lg:float-right lg:w-[670px] flex flex-col space-y-3">
              {sections({ ...profileData, fragmentComponents })
                .filter(({ isShow, isShowFallback }: any) => Boolean(isShow) || Boolean(isShowFallback))
                .map((section: any, index: number) => (
                  <Section key={index} {...section}>
                    {section[section.isShow ? 'children' : 'fallback']?.(section?.function?.())}
                  </Section>
                ))}
            </div>

            <div className="clear-both"></div>
          </main>
          <Modal {...viewAsModalProps} title={viewAdData?.title ?? ''} fullScreen bodyClassName="p-0">
            <iframe src={`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}${viewAdData?.url}`} className="w-full h-full" />
          </Modal>
        </div>
      </RaviGlobalContextsProvider>
      {isPageLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 flex justify-center items-center z-[99999999999999999999999]">
          <Loading width={50} />
        </div>
      )}
    </>
  );
};

DoctorProfile.getLayout = function getLayout(page: ReactElement) {
  const { title, description, slug, expertises, centers = [], information, feedbacks, host } = page.props;
  console.log(feedbacks);

  const doctorExpertise = expertises?.expertises?.[0]?.alias_title;

  const getJsonlds = () => {
    const center = centers?.find?.((cn: any) => cn.id !== CENTERS.CONSULT);
    const visitOnlineCenter = centers?.find?.((cn: any) => cn.id === CENTERS.CONSULT);
    const visitOnlinePrice = visitOnlineCenter?.services?.[0]?.free_price ?? 0;
    const currentUrl = `/dr/${slug}`;

    return [
      {
        '@context': 'http://www.schema.org',
        '@type': 'Physician',
        'priceRange': visitOnlinePrice > 0 ? `IRR ${addCommas(visitOnlinePrice)}` : '$$',
        'name': `${information?.display_name}`,
        'telephone': center?.display_number,
        'description': information?.biography ? removeHtmlTagInString(information?.biography) : '',
        'image': publicRuntimeConfig.CDN_BASE_URL + information?.image,
        'isAcceptingNewPatients': true,
        'medicalSpecialty': !expertises?.group_expertises ? expertises?.group_expertises?.[0]?.name : doctorExpertise,
        'duns': information?.employee_id,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IR',
          },
          'addressLocality': center?.city,
          'addressRegion': center?.province,
          'streetAddress': center?.address,
        },
        ...(!feedbacks?.details?.hide_rates && {
          aggregateRating: {
            '@type': 'AggregateRating',
            'bestRating': 5,
            'worstRating': 0,
            'ratingCount': feedbacks?.details?.count_of_feedbacks ?? 0,
            'ratingValue': +(
              (+(feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                +(feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                +(feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
              3
            ).toFixed(1),
          },
          review:
            feedbacks?.feedbacks?.list
              ?.filter((item: any) => !!item?.avg_rate_value)
              ?.map?.((feedback: any) => ({
                '@type': 'Review',
                'author': {
                  '@type': 'Person',
                  'name': feedback?.user_display_name?.split?.(' ')?.[0] ?? 'کاربر پذیرش24',
                },
                'reviewRating': {
                  '@type': 'Rating',
                  'ratingValue': feedback?.avg_rate_value ?? 0,
                  'bestRating': 5,
                  'worstRating': 0,
                },
                'reviewBody': feedback?.description,
                'datePublished': feedback?.created_at?.split(' ')?.[0],
              })) ?? [],
        }),
      },
      {
        '@context': 'http://www.schema.org',
        '@type': 'Person',
        'jobTitle': 'physician',
        'name': `${information?.display_name}`,
        'telephone': center?.display_number,
        'image': publicRuntimeConfig.CDN_BASE_URL + information?.image,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IR',
          },
          'addressLocality': center?.city,
          'addressRegion': center?.province,
          'streetAddress': center?.address,
        },
      },
      {
        '@context': 'http://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'item': {
              '@id': `${publicRuntimeConfig?.CLINIC_BASE_URL}/`,
              'name': 'پذیرش۲۴',
            },
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'item': {
              '@id': publicRuntimeConfig.CLINIC_BASE_URL + currentUrl,
              'name': `${information?.display_name}`,
            },
          },
        ],
      },
    ];
  };

  return (
    <LayoutWithHeaderAndFooter showSearchSuggestionButton={true} shouldShowPromoteApp={false} {...page.props.config}>
      <Seo
        title={title}
        description={description}
        jsonlds={centers?.length > 0 ? getJsonlds() : []}
        openGraph={{
          image: {
            src: publicRuntimeConfig.CDN_BASE_URL + information?.image,
            alt: `${information?.display_name}`,
            type: 'image/jpg',
          },
        }}
        host={host}
      />
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = getProfileServerSideProps;

export default DoctorProfile;
