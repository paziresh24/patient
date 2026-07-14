import { usePageView } from '@/common/apis/services/profile/pageView';
import Modal from '@/common/components/atom/modal/modal';
import Section from '@/common/components/atom/section/section';
import CommentIcon from '@/common/components/icons/comment';
import DoctorIcon from '@/common/components/icons/doctor';
import PhoneIcon from '@/common/components/icons/phone';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { CENTERS } from '@/common/types/centers';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import useResponsive from '@/common/hooks/useResponsive';
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { pageViewEvent } from '@/modules/profile/events/pageView';
import { getProfileServerSideProps } from '@/modules/profile/functions/getProfileServerSideProps';
import { useProfileSplunkEvent } from '@/modules/profile/hooks/useProfileEvent';
import { useFeedbackDataStore } from '@/modules/profile/store/feedbackData';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { useAsideSections } from '@/modules/profile/views/aside';
import { ToolBarItems } from '@/modules/profile/components/head/toolBar';
import { useToolBarController } from '@/modules/profile/hooks/useToolBarController';
import useClientReady from '@/common/hooks/useClientReady';
import { sections } from '@/modules/profile/views/sections';
import { getCookie } from 'cookies-next';
import config from 'next/config';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { growthbook } from '../_app';
import { useSearchStore } from '@/modules/search/store/search';
import useLockScroll from '@/common/hooks/useLockScroll';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import ErrorPage from '@/modules/profile/components/errorPage';
import Hamdast from '@/modules/hamdast/render';
import { useProfileClientFetch } from '@/modules/profile/hooks/useProfileClientFetch';
import { useProfileHamdastWidgets } from '@/modules/profile/hooks/useProfileHamdastWidgets';
import { DoctorProfilePageProps } from '@/modules/profile/types/doctorProfilePage';
import { CenterMobileNav } from '@/modules/profile/views/centerHead/centerMobileNav';
import { trackDoctorProfileViewByDoctorId } from '@/modules/hamdast/utils/profileViewFrequency';
import Loading from '@/common/components/atom/loading';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Head from 'next/head';
import DoctorProfileHead from '@/modules/profile/views/head/head';
import ProfileHeadRateBadge from '@/modules/profile/views/rateReview/profileHeadRateBadge';
import { useRate } from '@/common/apis/services/reviews/rate';

import {
  buildDoctorJsonLd,
  getDoctorCanonicalUrl,
  resolveDoctorProfileImageUrl,
} from '@/modules/profile/utils/doctorProfileSsr';

const { publicRuntimeConfig } = config();

const DoctorProfile = (props: DoctorProfilePageProps) => {
  const { shouldFetchOnClient, slug: initialSlug, status } = props;
  const { query, replace, events: routerEvents } = useRouter();
  const [isProfileScriptsReady, setIsProfileScriptsReady] = useState(false);
  const profileScriptsReadyRef = useRef(false);
  const vicControlSentForSlugRef = useRef<string | null>(null);
  const trackedDoctorIdRef = useRef<string | null>(null);
  const profileDataSyncedRef = useRef<string | null>(null);
  const redirectHandledRef = useRef<string | null>(null);

  const currentSlug = initialSlug ?? query.slug;

  const isClientReady = useClientReady();

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
      window.removeEventListener('mousemove', onInteract);
    };
    window.addEventListener('pointerdown', onInteract, { passive: true });
    window.addEventListener('keydown', onInteract, { passive: true });
    window.addEventListener('touchstart', onInteract, { passive: true });
    window.addEventListener('scroll', onInteract, { passive: true });
    window.addEventListener('mousemove', onInteract, { passive: true });
    timeoutId = setTimeout(enable, 10000);
    return cleanup;
  }, []);

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
  const { isMobile } = useResponsive();
  const isApplication = useApplication();
  const isWebView = useWebView();
  const addPageView = usePageView();
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
  const isSamanBookingFlag = useFeatureIsOn('saman-booking');
  const isSamanBookingEnabled = isClientReady && isSamanBookingFlag;

  const finalProps =
    clientData?.redirect?.destination
      ? props
      : (!!shouldFetchOnClient && !props?.information) || clientData?.props?.information
        ? (clientData?.props ?? props)
        : props;

  const {
    slug,
    breadcrumbs,
    information,
    centers = [],
    media,
    symptomes,
    history,
    onlineVisit,
    similarLinks,
    isBulk,
    expertises,
    feedbacks,
    waitingTimeInfo,
    fragmentComponents,
    hamdastWidgets: hamdastWidgetsFromProps,
    hamdastWidgetsData: hamdastWidgetsDataFromProps,
    user_id,
  } = finalProps ?? {};

  const rateDebug = process.env.NODE_ENV !== 'production' && query.rateDebug === '1';
  const rateDebugSlug = slug ?? currentSlug;
  const rateDebugProbe = useRate(
    { slug: String(rateDebugSlug ?? '') },
    { enabled: rateDebug && !!rateDebugSlug, refetchOnWindwFocus: false },
  );

  const doctorProfileImageUrl = useMemo(
    () => resolveDoctorProfileImageUrl(information ?? undefined, user_id),
    [information?.user_id, user_id],
  );

  const isOwnProfile = !!user_id && !!userInfo?.id && String(user_id) === String(userInfo?.id);
  const hamdastWidgetsQuery = useProfileHamdastWidgets(user_id, information?.id, isOwnProfile);
  const hamdastWidgets = (isOwnProfile && hamdastWidgetsQuery.data) ? hamdastWidgetsQuery.data.widgets : hamdastWidgetsFromProps;
  const hamdastWidgetsData = (isOwnProfile && hamdastWidgetsQuery.data) ? hamdastWidgetsQuery.data.widgetsData : hamdastWidgetsDataFromProps;

  const toolBarItems = useToolBarController({
    slug: String(slug ?? currentSlug ?? ''),
    displayName: information?.display_name ?? '',
    documentTitle: information?.display_name
      ? `${information.display_name}، اطلاعات تماس و نوبت دهی آنلاین `
      : '',
    editable,
  }) as ToolBarItems;

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

    routerEvents.on('routeChangeStart', handleRouteChangeStart);
    routerEvents.on('routeChangeComplete', handleRouteChangeComplete);
    routerEvents.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      routerEvents.off('routeChangeStart', handleRouteChangeStart);
      routerEvents.off('routeChangeComplete', handleRouteChangeComplete);
      routerEvents.off('routeChangeError', handleRouteChangeComplete);
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
  }, [dontShowRateDetails, information, slug, growthbook?.ready, userPending, isWebView, isApplication, isBulk, centers, expertises, history, feedbacks, hamdastWidgets, userInfo?.id]);

  useEffect(() => {
    redirectHandledRef.current = null;
    profileDataSyncedRef.current = null;
  }, [currentSlug]);

  useEffect(() => {
    const destination = clientData?.redirect?.destination;
    if (!destination || redirectHandledRef.current === destination) return;

    redirectHandledRef.current = destination;
    void replace(destination);
  }, [clientData?.redirect?.destination, replace]);

  useEffect(() => {
    if (!information?.id) return;

    const syncKey = `${slug ?? currentSlug}:${information.id}`;
    if (profileDataSyncedRef.current === syncKey) return;

    if (vicControlSentForSlugRef.current !== slug) {
      vicControlSentForSlugRef.current = slug ?? null;
      addPageView.mutate({
        ownerId: information.id,
        serverId: information.server_id,
        type: 'doctor',
      });
    }

    if (information.should_recommend_other_doctors) recommendEvent('loadrecommend');
    setProfileData({ ...information, centers: [...centers], ...expertises, feedbacks });
    profileDataSyncedRef.current = syncKey;
  }, [information?.id, slug, currentSlug, centers, expertises, feedbacks, isBulk, history]);

  useEffect(() => {
    if (!information) return;

    window.doctor = { ...information, centers, expertises, isBulk, slug, history };

    return () => {
      delete (window as Window & { doctor?: unknown }).doctor;
    };
  }, [information, centers, expertises, isBulk, slug, history]);

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
    user_id,
  };

  const asideSections = useAsideSections({
    ...profileData,
    fragmentComponents,
    hamdast: { ga: showHamdastGa },
  });

  const doctorMobileNavItems = useMemo(() => {
    const items = [];

    if (centers.length > 0 && !isSamanBookingEnabled) {
      items.push({ id: 'book-me', label: 'نوبت‌دهی', icon: <DoctorIcon width={16} height={16} /> });
    }
    if (centers.some((center: { id?: unknown }) => center?.id !== CENTERS.CONSULT)) {
      items.push({ id: 'phone-and-address', label: 'آدرس و تلفن', icon: <PhoneIcon width={16} height={16} /> });
    }
    if (information?.biography) {
      items.push({ id: 'about', label: 'درباره پزشک', icon: <DoctorIcon width={16} height={16} /> });
    }
    if (customize.showRateAndReviews) {
      items.push({ id: 'reviews', label: 'نظرات', icon: <CommentIcon width={16} height={16} /> });
    }

    return items;
  }, [centers, customize.showRateAndReviews, information?.biography, isSamanBookingEnabled]);

  const mainContentSections = sections({ ...profileData, fragmentComponents }).filter(
    ({ isShow, isShowFallback, id }: { isShow?: boolean; isShowFallback?: boolean; id?: string }) => {
      if (id === 'reviews' && isMobile) return false;
      return Boolean(isShow) || Boolean(isShowFallback);
    },
  );

  const visibleAsideSections = asideSections.filter(({ isShow }: { isShow?: boolean }) => Boolean(isShow));
  const earlyAsideSections = visibleAsideSections.filter(section => section.id !== 'reviews');
  const lateAsideSections = visibleAsideSections.filter(section => section.id === 'reviews');
  const desktopAsideSections = visibleAsideSections.filter(section => section.id !== 'reviews');

  const renderAsideSections = (items: typeof visibleAsideSections) =>
    items.map((section, index) => (
      <Section key={`aside-${section.id ?? index}`} {...section}>
        {section.children(section?.function?.())}
      </Section>
    ));

  if (!finalProps?.information?.id ? shouldFetchOnClient || isLoading : false) {
    return (
      <div className="flex flex-grow justify-center items-center">
        <Loading width={50} />
      </div>
    );
  }

  if (isError) {
    const clientErrorStatusCode = (error as any)?.response?.status ?? 500;
    return <ErrorPage statusCode={clientErrorStatusCode} refresh={refetch} profileType="doctor" />;
  }

  if ([404, 500, 504, 410].includes(status) && !shouldFetchOnClient) {
    return <ErrorPage statusCode={status} refresh={refetch} profileType="doctor" />;
  }

  return (
    <>
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
        <link rel="dns-prefetch" href="//cdn.paziresh24.com" />
        <link rel="preconnect" href="https://cdn.paziresh24.com" crossOrigin="" />
      </Head>
      <div className="lg:min-w-[320px] w-full lg:max-w-[1160px] mx-auto">
          {isProfileScriptsReady &&
            hamdastWidgets
              ?.filter?.((item: any) => item?.placement?.includes?.('profile_scripts_tag') && item?.script)
              ?.map((item: any) => (
                <Script key={item?.id} id={item?.id} strategy="lazyOnload">
                  {item?.script}
                </Script>
              ))}
          <main
            key={information?.id}
            className="mx-auto flex w-full max-w-screen-xl flex-col items-start bg-slate-50 pwa:pb-28 md:flex-row md:gap-5 md:bg-transparent md:px-4 md:py-10 lg:px-0"
          >
            <section className="flex w-full min-w-0 flex-col space-y-3 md:basis-7/12 md:space-y-4">
              <DoctorProfileHead
                image={doctorProfileImageUrl}
                imageAlt={information?.display_name}
                displayName={profileData.information.display_name}
                title={information?.experience ? `${profileData.information?.experience} سال تجربه` : undefined}
                subTitle={
                  information?.employee_id ? `شماره نظام پزشکی: ${information.employee_id}` : undefined
                }
                serviceList={
                  profileData.expertises?.expertises?.flatMap(({ alias_title }: { alias_title: string }) =>
                    alias_title.split('|'),
                  ) ?? []
                }
                pageViewCount={profileData.history?.count_of_page_view}
                toolBarItems={isClientReady ? toolBarItems : undefined}
                editable={editable}
                infoEditAction={() => handleViewAs('information')}
                servicesEditAction={() => handleViewAs('services')}
              >
                <div className="flex w-full flex-col gap-2 border-t border-slate-100 px-4 py-4 md:px-6">
                  {hamdastWidgets
                    ?.filter((widget: { placement?: string[] }) => widget?.placement?.includes?.('head'))
                    ?.map((widget: { id: string; app?: string; placement?: string[]; placements_metadata?: unknown }) => (
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
                  {isClientReady && customize.showRateAndReviews && (
                    <button
                      type="button"
                      className="self-center cursor-pointer border-0 bg-transparent p-0"
                      onClick={() => scrollIntoViewWithOffset('#reviews', 90)}
                    >
                      <ProfileHeadRateBadge
                        rate={(
                          (+(profileData.feedbacks?.details?.average_rates?.average_quality_of_treatment ?? 0) +
                            +(profileData.feedbacks?.details?.average_rates?.average_doctor_encounter ?? 0) +
                            +(profileData.feedbacks?.details?.average_rates?.average_explanation_of_issue ?? 0)) /
                          3
                        ).toFixed(1)}
                        rateCount={profileData.feedbacks?.details?.count_of_feedbacks}
                        hideRates={profileData.feedbacks?.details?.hide_rates}
                      />
                    </button>
                  )}
                </div>
              </DoctorProfileHead>

              {doctorMobileNavItems.length > 0 && <CenterMobileNav items={doctorMobileNavItems} />}

              {earlyAsideSections.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden [&_#book-me]:scroll-mt-24 [&_section]:overflow-hidden [&_section]:rounded-2xl [&_section]:shadow-card">
                  {renderAsideSections(earlyAsideSections)}
                </div>
              )}

              {mainContentSections.map((section, index) => (
                <Section key={index} {...section}>
                  {section[section.isShow ? 'children' : 'fallback']?.(section?.function?.())}
                </Section>
              ))}

              {lateAsideSections.length > 0 && (
                <div className="flex flex-col gap-3 md:hidden">{renderAsideSections(lateAsideSections)}</div>
              )}
            </section>

            <aside className="hidden w-full min-w-0 flex-col space-y-3 md:sticky md:top-5 md:flex md:basis-5/12">
              {renderAsideSections(desktopAsideSections)}
            </aside>
          </main>
          <Modal {...viewAsModalProps} title={viewAdData?.title ?? ''} fullScreen bodyClassName="p-0">
            <iframe src={`${publicRuntimeConfig.DOCTOR_APP_BASE_URL}${viewAdData?.url}`} className="w-full h-full" />
          </Modal>
        </div>
      {isPageLoading && (
        <div className="fixed top-0 left-0 z-[100] flex h-full w-full items-center justify-center bg-white/80">
          <Loading width={50} />
        </div>
      )}
    </>
  );
};

DoctorProfile.getLayout = function getLayout(page: ReactElement) {
  const { title, description, slug, expertises, centers = [], information, feedbacks, host, user_id } =
    page.props as DoctorProfilePageProps;
  const clinicBaseUrl = publicRuntimeConfig.CLINIC_BASE_URL || 'https://www.paziresh24.com';
  const doctorProfileImageUrl = resolveDoctorProfileImageUrl(information ?? undefined, user_id);
  const doctorCanonicalUrl = slug ? getDoctorCanonicalUrl(String(slug), clinicBaseUrl) : undefined;
  const jsonlds = buildDoctorJsonLd({
    information,
    expertises,
    centers,
    feedbacks,
    slug: String(slug ?? ''),
    baseUrl: clinicBaseUrl,
    userId: user_id,
  });

  return (
    <LayoutWithHeaderAndFooter showSearchSuggestionButton={true} shouldShowPromoteApp={false} {...page.props.config}>
      <Head>
        <link rel="preload" as="image" href={doctorProfileImageUrl} />
      </Head>
      <Seo
        title={title}
        description={description}
        canonicalUrl={doctorCanonicalUrl}
        jsonlds={jsonlds}
        openGraph={{
          image: {
            src: doctorProfileImageUrl,
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
