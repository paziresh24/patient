import { useIncrementPageView } from '@/common/apis/services/profile/incrementPageView';
import { usePageView } from '@/common/apis/services/profile/pageView';
import Modal from '@/common/components/atom/modal/modal';
import Section from '@/common/components/atom/section/section';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import { buildDoctorExpertiseChips } from '@/common/utils/buildDoctorExpertiseChips';
import { getDoctorKeywordTags } from '@/common/apis/services/doctor/getDoctorKeywordTags';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { pageViewEvent } from '@/modules/profile/events/pageView';
import { getProfileServerSideProps } from '@/modules/profile/functions/getProfileServerSideProps';
import { buildDoctorProfileJsonLds } from '@/modules/profile/functions/buildDoctorProfileJsonLds';
import { useProfileSplunkEvent } from '@/modules/profile/hooks/useProfileEvent';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { Aside } from '@/modules/profile/views/aside';
import { sections } from '@/modules/profile/views/sections';
import { getCookie } from 'cookies-next';
import config from 'next/config';
import { ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { growthbook } from '../_app';
import RaviGlobalContextsProvider from '../../../.plasmic/plasmic/ravi_r_r/PlasmicGlobalContextsProvider';
import ProfileGlobalContextsProvider from '../../../.plasmic/plasmic/paziresh_24_profile/PlasmicGlobalContextsProvider';
import { Fragment2 } from '@/common/fragment/fragment2';
import { useSearchStore } from '@/modules/search/store/search';
import useLockScroll from '@/common/hooks/useLockScroll';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import ErrorPage from '@/modules/profile/components/errorPage';
import { sendDoctorProfileEvent } from '@/modules/profile/events/nightBatEvents';
import dynamic from 'next/dynamic';
import { useProfileClientFetch } from '@/modules/profile/hooks/useProfileClientFetch';
import { useProfileHamdastWidgets } from '@/modules/profile/hooks/useProfileHamdastWidgets';
import { formatAverageRate } from '@/modules/profile/utils/getAverageRate';
import {
  isPicUserImageUrl,
  resolveDoctorProfileImageUrl,
  resolveDoctorProfileLcpImageUrl,
} from '@/modules/profile/utils/doctorProfileImageUrl';
import { trackDoctorProfileViewByDoctorId } from '@/modules/hamdast/utils/profileViewFrequency';
import {
  clearProfileDoctorInfo,
  getProfileDoctorInfo,
  setProfileDoctorInfo,
  updateProfileDoctorInfo,
} from '@/modules/hamdast/stores/profileDoctorInfo';
import Loading from '@/common/components/atom/loading';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';
import { PlasmicProfileHead } from '.plasmic/plasmic/paziresh_24_profile/PlasmicProfileHead';
import PlasmicRateAndCommentCount from '.plasmic/plasmic/ravi_r_r/PlasmicRateAndCommentCount';
import { useRate } from '@/common/apis/services/reviews/rate';

const { publicRuntimeConfig } = config();

const Hamdast = dynamic(() => import('@/modules/hamdast/render').then(m => ({ default: m.Hamdast })), {
  ssr: false,
  loading: () => null,
});

const DoctorProfile = (props: any) => {
  const { shouldFetchOnClient, slug: initialSlug, status } = props;
  const { query, ...router } = useRouter();
  const [isProfileScriptsReady, setIsProfileScriptsReady] = useState(false);
  const profileScriptsReadyRef = useRef(false);
  const vicControlSentForSlugRef = useRef<string | null>(null);
  const trackedDoctorIdRef = useRef<string | null>(null);

  const currentSlug = initialSlug ?? query.slug;

  useEffect(() => {
    if (profileScriptsReadyRef.current) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const enable = () => {
      if (profileScriptsReadyRef.current) return;
      profileScriptsReadyRef.current = true;
      setIsProfileScriptsReady(true);
    };
    const onInteract = () => {
      enable();
      cleanup();
    };
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('scroll', onInteract);
    };
    window.addEventListener('pointerdown', onInteract, { passive: true });
    window.addEventListener('keydown', onInteract, { passive: true });
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('scroll', onInteract, { passive: true });
    timeoutId = setTimeout(enable, 10000);
    return cleanup;
  }, []);

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
  // Must stay above early returns — Aside is a plain function and receives this flag.
  const isSamanBookingEnabled = useFeatureIsOn('saman-booking');
  const expertiseChipsConfig = useFeatureValue<{ slugs?: string[] }>('profile.expertise-chips-like-search', { slugs: [] });

  // Initial page props only (stable for this mount) — layout SEO may be a CSR shell.
  const layoutWasCsrFallback = !!props?.shouldFetchOnClient;

  const preferClientProps =
    (!!shouldFetchOnClient && !props?.information) || !!(clientData?.props as any)?.information;
  const finalProps = (preferClientProps && clientData?.props ? clientData.props : props) ?? props;

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
    hamdastWidgets: hamdastWidgetsFromProps,
    hamdastWidgetsData: hamdastWidgetsDataFromProps,
    keywordTags,
    expertiseChipsLikeSearchEnabled: ssrExpertiseChipsLikeSearchEnabled,
    user_id,
    dontShowRateAndReviewMessage,
    useSamanAvailabilityStatus: ssrUseSamanAvailabilityStatus,
    profile_backend,
    title: documentTitleFromProps,
    description: documentDescriptionFromProps,
    host: documentHostFromProps,
  } = finalProps ?? {};

  const clientExpertiseChipsLikeSearch = newApiFeatureFlaggingCondition(
    expertiseChipsConfig?.slugs ?? [],
    String(slug ?? currentSlug ?? ''),
  );
  const useExpertiseChipsLikeSearch = Boolean(ssrExpertiseChipsLikeSearchEnabled) || clientExpertiseChipsLikeSearch;

  const doctorSlugForTags = String(slug ?? currentSlug ?? '');
  const { data: clientKeywordTags = [] } = useQuery(
    ['profileExpertiseKeywordTags', doctorSlugForTags],
    () =>
      getDoctorKeywordTags({
        slug: doctorSlugForTags,
        searchText: [information?.name, information?.family].filter(Boolean).join(' ') || undefined,
      }),
    {
      enabled: useExpertiseChipsLikeSearch && !!doctorSlugForTags && !(Array.isArray(keywordTags) && keywordTags.length > 0),
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  );
  const resolvedKeywordTags = (Array.isArray(keywordTags) && keywordTags.length > 0 ? keywordTags : clientKeywordTags) ?? [];

  // useLayoutEffect so slug is on GB before Services evaluates online-visit-chat-lifecycle-duration.
  useLayoutEffect(() => {
    if (!growthbook) return;
    const doctorSlugForGrowthbook = (typeof slug === 'string' && slug ? slug : null) ?? currentSlug;
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      // Prefer canonical profile slug from props when available (URL slug can omit suffix like `-3`).
      slug: doctorSlugForGrowthbook,
    });
    return () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        slug: undefined,
      });
    };
  }, [currentSlug, slug, growthbook]);

  const rateDebug = query.rateDebug === '1';
  const rateDebugSlug = slug ?? currentSlug;
  const rateDebugProbe = useRate(
    { slug: String(rateDebugSlug ?? '') },
    { enabled: rateDebug && !!rateDebugSlug, refetchOnWindwFocus: false },
  );

  const doctorProfileImageUrl = useMemo(
    () => resolveDoctorProfileImageUrl(information, user_id),
    [information?.user_id, information?.image, user_id],
  );

  const doctorProfileLcpImageUrl = useMemo(
    () => resolveDoctorProfileLcpImageUrl(information, user_id),
    [information?.user_id, information?.image, user_id],
  );

  const clientSeoJsonLds = useMemo(
    () =>
      buildDoctorProfileJsonLds({
        slug,
        centers,
        information,
        expertises,
        feedbacks,
        breadcrumbs,
        doctorProfileImageUrl,
      }),
    [slug, centers, information, expertises, feedbacks, breadcrumbs, doctorProfileImageUrl],
  );

  const isOwnProfile = !!user_id && !!userInfo?.id && String(user_id) === String(userInfo?.id);
  const hamdastWidgetsQuery = useProfileHamdastWidgets(user_id, information?.id, isOwnProfile);
  const hamdastWidgets = (isOwnProfile && hamdastWidgetsQuery.data) ? hamdastWidgetsQuery.data.widgets : hamdastWidgetsFromProps;
  const hamdastWidgetsData = (isOwnProfile && hamdastWidgetsQuery.data) ? hamdastWidgetsQuery.data.widgetsData : hamdastWidgetsDataFromProps;

  useEffect(() => {
    useFeedbackDataStore.setState({ data: feedbacks?.feedbacks ?? [] });
  }, [feedbacks]);

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

  const renderResultSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!information?.id) return;
    const key = `${slug}:${information.id}`;
    if (renderResultSentRef.current === key) return;
    renderResultSentRef.current = key;
    sendDoctorProfileEvent('profile_render_result', 'success', {
      slug,
      doctor_id: information.id,
      should_fetch_on_client: !!shouldFetchOnClient,
      centers_count: centers?.length ?? 0,
      is_bulk: !!isBulk,
    });
  }, [information?.id, slug, shouldFetchOnClient, centers?.length, isBulk]);

  useEffect(() => {
    if (information) {
      if (shouldUseIncrementPageView) {
        incrementPageView.mutate({
          provider_id: information.provider_id,
        });
      }

      if (vicControlSentForSlugRef.current !== slug) {
        vicControlSentForSlugRef.current = slug;
        addPageView.mutate({
          ownerId: information.id,
          serverId: information.server_id,
          type: 'doctor',
        });
      }

      const doctorUserId = information?.user_id ?? user_id ?? null;
      window.doctor = {
        ...information,
        user_id: doctorUserId,
        centers,
        expertises,
        isBulk,
        slug,
        history,
      };

      if (information.should_recommend_other_doctors) recommendEvent('loadrecommend');
      setProfileData({ ...information, centers: [...centers], ...expertises, feedbacks });
    }
  }, [isBulk, information, slug, userInfo, shouldUseIncrementPageView, centers, expertises, history, feedbacks, user_id]);

  // Cache doctor identity for hamdast doctor-service payment (only clear when user_id/slug lifecycle ends).
  useEffect(() => {
    const doctorUserId = information?.user_id ?? user_id;
    if (!doctorUserId) return;

    const displayName =
      information?.display_name?.trim() ||
      [information?.name, information?.family].filter(Boolean).join(' ').trim() ||
      '';

    const epoch = setProfileDoctorInfo({
      userId: String(doctorUserId),
      displayName,
      imageUrl: doctorProfileImageUrl || null,
      slug: typeof slug === 'string' ? slug : currentSlug ? String(currentSlug) : null,
    });

    return () => {
      clearProfileDoctorInfo(epoch);
    };
  }, [information?.user_id, user_id, slug, currentSlug]);

  // Keep display name / avatar fresh without clearing the cached user id.
  useEffect(() => {
    const cached = getProfileDoctorInfo();
    if (!cached?.userId) return;

    const displayName =
      information?.display_name?.trim() ||
      [information?.name, information?.family].filter(Boolean).join(' ').trim() ||
      cached.displayName;

    updateProfileDoctorInfo({
      displayName,
      imageUrl: doctorProfileImageUrl || cached.imageUrl || null,
      slug: cached.slug ?? (typeof slug === 'string' ? slug : null),
    });
  }, [
    information?.display_name,
    information?.name,
    information?.family,
    doctorProfileImageUrl,
    slug,
  ]);

  useEffect(() => {
    const doctorId = information?.id ? String(information.id) : '';
    if (!doctorId) return;
    if (trackedDoctorIdRef.current === doctorId) return;

    trackedDoctorIdRef.current = doctorId;
    trackDoctorProfileViewByDoctorId(doctorId);
  }, [information?.id, currentSlug]);

  useEffect(() => {
    if (userInfo.provider?.job_title === 'doctor' && slug === userInfo?.provider?.slug && information) {
      setEditable(true);
      splunkInstance('doctor-profile').sendEvent({
        group: 'profile',
        type: 'view-as',
        event: {
          action: 'page-view',
          doctor: information?.display_name ?? '',
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
    keywordTags: resolvedKeywordTags,
    user_id,
    useSamanAvailabilityStatus: ssrUseSamanAvailabilityStatus,
    profile_backend,
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
    return <ErrorPage statusCode={clientErrorStatusCode} refresh={refetch} slug={currentSlug} />;
  }

  if ([404, 500, 504, 410].includes(status) && !shouldFetchOnClient) {
    return <ErrorPage statusCode={status} refresh={refetch} slug={slug ?? currentSlug} />;
  }

  const brandName = customize?.partnerTitle || 'پذیرش24';
  const resolvedDocumentTitle =
    (typeof documentTitleFromProps === 'string' && documentTitleFromProps.trim()) ||
    information?.display_name?.trim() ||
    '';
  const browserTitle = resolvedDocumentTitle
    ? resolvedDocumentTitle.includes('|')
      ? resolvedDocumentTitle
      : `${resolvedDocumentTitle} | ${brandName}`
    : '';

  const shouldHydrateClientSeo = layoutWasCsrFallback && !!information?.id;

  return (
    <>
      {shouldHydrateClientSeo && (
        <Seo
          title={
            (typeof documentTitleFromProps === 'string' && documentTitleFromProps.trim()) ||
            information?.display_name ||
            ''
          }
          description={
            (typeof documentDescriptionFromProps === 'string' && documentDescriptionFromProps) || ''
          }
          jsonlds={clientSeoJsonLds}
          openGraph={{
            image: {
              src: doctorProfileImageUrl,
              alt: `${information?.display_name ?? ''}`,
              type: 'image/jpg',
            },
          }}
          host={documentHostFromProps}
          noIndex={false}
        />
      )}
      {rateDebug && (
        <div
          className="fixed top-14 right-2 z-[10000] max-w-md rounded-md border border-amber-300 bg-amber-50/95 p-2 text-[11px] leading-relaxed text-amber-950 font-mono shadow-md backdrop-blur-sm"
          dir="ltr"
        >
          <div className="font-bold text-amber-900">rateDebug (add ?rateDebug=1)</div>
          <div>slug: {String(rateDebugSlug ?? '')}</div>
          <div>showRateAndReviews (customize): {String(customize?.showRateAndReviews)}</div>
          <div>ravi_show_external_rate (hides review bars): {String(dontShowRateDetails)}</div>
          <div>
            client probe /api/ravi-rate:{' '}
            {rateDebugProbe.isLoading
              ? 'loading…'
              : rateDebugProbe.isError
                ? `error: ${(rateDebugProbe.error as any)?.message ?? 'unknown'}`
                : `ok (list ${rateDebugProbe.data?.list?.length ?? 0})`}
          </div>
          <div>
            SSR props average_rates:{' '}
            {[
              feedbacks?.details?.average_rates?.average_quality_of_treatment,
              feedbacks?.details?.average_rates?.average_doctor_encounter,
              feedbacks?.details?.average_rates?.average_explanation_of_issue,
            ].every(v => v == null || v === '')
              ? 'empty (getRateDetails failed or no row)'
              : 'set'}
          </div>
          <div className="text-[10px] text-amber-800 mt-1">
            Tip: first HTML load fetches rate on the server — you will not see ravi-api in the browser Network tab until client
            refetch (e.g. profile client fetch or this probe).
          </div>
        </div>
      )}
      <Head>
        {browserTitle ? <title>{browserTitle}</title> : null}
        <link rel="dns-prefetch" href="//cdn.paziresh24.com" />
        <link rel="dns-prefetch" href="//pic.paziresh24.com" />
        <link rel="preconnect" href="https://cdn.paziresh24.com" crossOrigin="" />
        <link rel="preconnect" href="https://pic.paziresh24.com" crossOrigin="" />
        {isPicUserImageUrl(doctorProfileLcpImageUrl) ? (
          <link
            rel="preload"
            as="image"
            href={doctorProfileLcpImageUrl}
            // Avatar is ~85px CSS; tell the browser not to treat this as a full-bleed hero.
            imageSizes="85px"
            fetchPriority="high"
          />
        ) : null}
      </Head>
      <RaviGlobalContextsProvider>
        <div className="lg:min-w-[320px] w-full lg:max-w-[1160px] mx-auto">
          {isProfileScriptsReady &&
            hamdastWidgets
              ?.filter?.((item: any) => item?.placement?.includes?.('profile_scripts_tag') && item?.script)
              ?.map((item: any) => (
                <Script key={item?.id} id={item?.id} strategy="lazyOnload">
                  {item?.script}
                </Script>
              ))}
          <main key={information?.id} className="lg:py-10 pwa:pb-24">
            <div className="lg:float-right lg:w-[670px] mb-3">
              <ProfileGlobalContextsProvider>
                <Fragment2
                  Component={PlasmicProfileHead}
                  name="ProfileHead"
                  args={{
                    pageViewCount: profileData.history?.count_of_page_view,
                    serviceList: useExpertiseChipsLikeSearch
                      ? buildDoctorExpertiseChips(profileData.expertises?.expertises, {
                          keywordTags: profileData.keywordTags,
                        })
                      : profileData.expertises?.expertises?.flatMap(({ alias_title }: any) =>
                          String(alias_title ?? '')
                            .split('|')
                            .map((part: string) => part.trim())
                            .filter(Boolean),
                        ) ?? [],
                    displayName: profileData.information.display_name,
                    title: information?.experience ? `${profileData.information?.experience} سال تجربه` : undefined,
                    subTitle: `شماره نظام پزشکی: ${profileData.information?.employee_id}`,
                    imageUrl: doctorProfileLcpImageUrl,
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
                          <div
                            className="self-center cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label="مشاهده نظرات و امتیاز پزشک"
                            onClick={() => scrollIntoViewWithOffset('#reviews', 90)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                scrollIntoViewWithOffset('#reviews', 90);
                              }
                            }}
                          >
                            <Fragment2
                              name="RateAndCommentCount2"
                              Component={PlasmicRateAndCommentCount}
                              args={{
                                ...profileData,
                                rateCount: profileData.feedbacks?.details?.count_of_feedbacks,
                                rate:
                                  customize.showRateAndReviews &&
                                  !dontShowRateAndReviewMessage &&
                                  formatAverageRate(profileData.feedbacks?.details?.average_rates),
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

              {Aside({ ...profileData, fragmentComponents, hamdast: { ga: showHamdastGa }, isSamanBookingEnabled })
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
            <iframe
              title={viewAdData?.title || 'ویرایش پروفایل پزشک'}
              src={`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}${viewAdData?.url}`}
              className="w-full h-full"
            />
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
  const {
    title,
    description,
    slug,
    expertises,
    centers = [],
    information,
    feedbacks,
    host,
    user_id,
    breadcrumbs,
    shouldFetchOnClient,
    noIndex: noIndexFromProps,
  } = page.props;
  const doctorProfileImageUrl = resolveDoctorProfileImageUrl(information, user_id);
  const isCsrShell = !!shouldFetchOnClient || !!noIndexFromProps;

  return (
    <LayoutWithHeaderAndFooter showSearchSuggestionButton={true} shouldShowPromoteApp={false} {...page.props.config}>
      <Seo
        title={isCsrShell ? '' : title}
        description={isCsrShell ? '' : description}
        jsonlds={isCsrShell ? [] : centers?.length > 0 ? buildDoctorProfileJsonLds({
          slug,
          centers,
          information,
          expertises,
          feedbacks,
          breadcrumbs,
          doctorProfileImageUrl,
        }) : []}
        openGraph={{
          image: {
            src: doctorProfileImageUrl,
            alt: `${information?.display_name ?? ''}`,
            type: 'image/jpg',
          },
        }}
        host={host}
        noIndex={isCsrShell}
      />
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = getProfileServerSideProps;

export default DoctorProfile;
