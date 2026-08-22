import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { slugProfile, useSlugProfile } from '@/common/apis/services/profile/slugProfile';
import { search as searchApi } from '@/common/apis/services/search/search';
import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import Button from '@/common/components/atom/button/button';
import Loading from '@/common/components/atom/loading';
import Text from '@/common/components/atom/text';
import ErrorBoundary from '@/common/components/layouts/errorBoundary';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import useLockScroll from '@/common/hooks/useLockScroll';
import { sendCenterProfileEvent, sendCenterProfileEventServer } from '@/modules/profile/events/nightBatEvents';
import ErrorPage from '@/modules/profile/components/errorPage';
import { sanitizeCenterSearchResultPage } from '@/modules/profile/utils/sanitizeCenterSearchDoctors';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { sanitizeDehydratedState } from '@/common/utils/sanitizeDehydratedState';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { usePageView } from '@/common/apis/services/profile/pageView';
import CentersInfo from '@/modules/profile/views/centersInfo';
import Head from '@/modules/profile/views/head';
import ListOfDoctors from '@/modules/profile/views/listOfDoctors';
import ProfileSeoBox from '@/modules/profile/views/seoBox';
import { useSearchStore } from '@/modules/search/store/search';
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { GetServerSidePropsContext } from 'next';
import config from 'next/config';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { growthbook } from '../_app';
import { getImageUrl } from '@/common/utils/getImageUrl';
const Biography = dynamic(() => import('@/modules/profile/views/biography'));

const { publicRuntimeConfig } = config();

const firstQueryValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return '';
};

const normalizeExpertiseRoute = (raw: string): string => {
  const value = raw.trim();
  if (!value) return '';
  if (value.startsWith('ir/exp-') || value.includes('/exp-')) {
    return value.replace(/^\/?s\//, '').replace(/^\//, '');
  }
  return `ir/exp-${value}/`;
};

const CenterProfile = ({
  query: { text, expertise },
  host,
  isMainSite,
  slug: initialSlug,
  ssrErrorStatus,
}: any) => {
  const { query, ...router } = useRouter();
  const share = useShare();
  const { customize } = useCustomize();
  const slug = (typeof query.slug === 'string' ? query.slug : initialSlug) as string;
  const addPageView = usePageView();
  const vicControlSentForSlugRef = useRef<string | null>(null);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { openScroll } = useLockScroll();

  const initialText = firstQueryValue(text);
  const initialExpertise = firstQueryValue(expertise);

  const [searchQuery, setSearchQuery] = useState(initialText);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialText);
  const [selectedExpertise, setSelectedExpertise] = useState(
    initialExpertise ? normalizeExpertiseRoute(initialExpertise) : '',
  );
  const prevSlugRef = useRef<string | null>(null);

  useEffect(() => {
    setIsOpenSuggestion(false);
    openScroll();
    if (prevSlugRef.current !== null && prevSlugRef.current !== slug) {
      setSearchQuery('');
      setDebouncedSearchTerm('');
      setSelectedExpertise('');
    }
    prevSlugRef.current = slug;
  }, [slug]);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchQuery);
      remove();
    },
    600,
    [searchQuery],
  );

  const profile = useSlugProfile(
    { slug },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );
  const profileData = profile.data?.result?.data;
  const centerId = profileData?.id;
  const filters = useMemo(
    () => ({
      center: centerId,
      result_type: 'پزشکان+بیمارستانی',
      ...(debouncedSearchTerm && { text: debouncedSearchTerm }),
      ...(customize.partnerKey && { university: customize.partnerKey }),
    }),
    [debouncedSearchTerm, centerId, customize.partnerKey],
  );

  const doctorsListResetKey = `${centerId ?? ''}:${debouncedSearchTerm}:${selectedExpertise}`;

  const {
    data: doctors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError: isDoctorsError,
    refetch: refetchDoctors,
    remove,
  } = useInfiniteQuery({
    queryKey: [
      ServerStateKeysEnum.Search,
      {
        route: selectedExpertise ?? '',
        query: {
          ...filters,
        },
      },
    ],
    queryFn: async ({ pageParam }) => {
      const page = await searchApi({
        route: selectedExpertise ?? '',
        query: {
          ...filters,
          // page must win over any filter field so "load more" advances during search
          page: pageParam?.page ?? 1,
        },
      });
      return sanitizeCenterSearchResultPage(page);
    },
    getNextPageParam: lastPage => {
      const pagination = lastPage?.search?.pagination;
      const total = lastPage?.search?.total;
      if (!pagination?.limit || !pagination?.page || total == null) return undefined;
      return pagination.limit * pagination.page < total ? { page: pagination.page + 1 } : undefined;
    },
    enabled: !!centerId,
    refetchOnMount: false,
    useErrorBoundary: false,
  });

  const expertises = useSearchSuggestion(
    {
      query: '',
      center_id: centerId,
      return_expertise: true,
      withoutUniversity: true,
    },
    {
      keepPreviousData: true,
      enabled: !!centerId,
    },
  );

  const defaultExpertise = useMemo(() => {
    const matched = expertises.data?.[0]?.items?.[0]?.sub_items?.find(
      (item: any) => item.url === `/s/${selectedExpertise}`,
    );

    if (matched?.name) {
      return {
        label: matched.name,
        value: matched.url ?? `/s/${selectedExpertise}`,
      };
    }

    return {
      label: 'همه تخصص ها',
      value: '',
    };
  }, [expertises, selectedExpertise]);

  useEffect(() => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      slug,
    });
    return () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        slug: undefined,
      });
    };
  }, [slug]);

  useEffect(() => {
    if (profile.isError) {
      sendCenterProfileEvent('center_profile_error', 'client_load_error', {
        slug,
        message: (profile.error as any)?.message ?? 'center profile load failed',
        http_status: (profile.error as any)?.response?.status ?? null,
      });
    }
  }, [profile.isError, profile.error, slug]);

  useEffect(() => {
    if (profileData) {
      sendCenterProfileEvent('center_profile', 'load_center_profile', {
        center_id: profileData?.id,
        server_id: profileData?.server_id,
        name: profileData.name,
        slug,
        city: profileData?.city ?? null,
        doctors_count_hint: profileData?.doctors?.length ?? null,
        terminal_id: getCookie('terminal_id'),
      });
      if (vicControlSentForSlugRef.current !== slug) {
        vicControlSentForSlugRef.current = slug;
        addPageView.mutate({
          ownerId: profileData?.id,
          serverId: profileData?.server_id,
          type: 'center',
        });
      }
    }
  }, [profileData, slug]);

  const doctorsListSentRef = useRef<string | null>(null);
  useEffect(() => {
    if (!centerId || isLoading) return;
    if (isDoctorsError) {
      const errorKey = `${slug}:${centerId}:error`;
      if (doctorsListSentRef.current === errorKey) return;
      doctorsListSentRef.current = errorKey;
      sendCenterProfileEvent('center_doctors_list', 'error', {
        slug,
        center_id: centerId,
        search_used: Boolean(debouncedSearchTerm),
        expertise_filter: selectedExpertise || null,
        message: 'doctors list query failed',
      });
      return;
    }
    const pages = doctors?.pages ?? [];
    const resultCount = pages.reduce((sum, page: any) => sum + (page?.search?.result?.length ?? 0), 0);
    const total = pages[0]?.search?.total ?? resultCount;
    const key = `${slug}:${centerId}:${debouncedSearchTerm}:${selectedExpertise}:${resultCount}`;
    if (doctorsListSentRef.current === key) return;
    doctorsListSentRef.current = key;
    sendCenterProfileEvent('center_doctors_list', resultCount === 0 ? 'empty' : 'loaded', {
      slug,
      center_id: centerId,
      doctors_count: resultCount,
      total,
      empty: resultCount === 0,
      search_used: Boolean(debouncedSearchTerm),
      search_query: debouncedSearchTerm || null,
      expertise_filter: selectedExpertise || null,
      has_next_page: !!hasNextPage,
    });
  }, [
    centerId,
    isLoading,
    isDoctorsError,
    doctors,
    debouncedSearchTerm,
    selectedExpertise,
    slug,
    hasNextPage,
  ]);

  if (ssrErrorStatus) {
    return (
      <ErrorPage
        pageType="center"
        statusCode={ssrErrorStatus}
        refresh={() => router.replace(router.asPath)}
        slug={slug}
        message="خطا در بارگذاری اطلاعات مرکز. لطفاً دوباره تلاش کنید."
      />
    );
  }

  if (!profileData) {
    if (profile.isError) {
      const statusCode = (profile.error as any)?.response?.status ?? 500;
      return (
        <ErrorPage
          pageType="center"
          statusCode={statusCode}
          refresh={() => profile.refetch()}
          slug={slug}
          message="خطا در بارگذاری اطلاعات مرکز. لطفاً دوباره تلاش کنید."
        />
      );
    }

    return (
      <div className="flex items-center justify-center flex-grow py-20">
        <Loading width={50} />
      </div>
    );
  }

  const documentTitle = `${profileData.name}، اطلاعات تماس و نوبت دهی آنلاین`.trim();
  const documentDescription = [
    `آدرس، شماره تلفن و اطلاعات تماس ${profileData.name}`,
    profileData.city ? `در ${profileData.city}` : null,
    'با امکان رزرو وقت و نوبت‌دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴',
  ]
    .filter(Boolean)
    .join(' ');

  const doctorsTotalHint =
    doctors?.pages?.[0]?.search?.total ?? profileData?.doctors?.length ?? 0;

  const handleShare = () => {
    const url = `${publicRuntimeConfig.CLINIC_BASE_URL}/center/${slug}?utm_source=profilecenter-share-button&utm_medium=profilecenter&utm_campaign=profilecenter`;
    sendCenterProfileEvent('center_profile', 'share_click', {
      slug,
      center_id: profileData?.id,
      name: profileData?.name,
    });
    share({
      title: documentTitle,
      text: `${profileData.name} در پذیرش۲۴`,
      url,
    });
  };

  const handleCenterPhoneClick = (centerId: string) => {
    sendCenterProfileEvent('center_profile', 'see_center_phone', {
      slug,
      center_id: centerId,
      name: profileData?.name,
    });
  };

  const handleCenterMapClick = (centerId: string) => {
    sendCenterProfileEvent('center_profile', 'see_center_map', {
      slug,
      center_id: centerId,
      name: profileData?.name,
    });
  };

  const about = `<p>
   این صفحه به عنوان وب‌سایت نوبت‌دهی اینترنتی
   <strong>${profileData.name}</strong>
   جهت مشاهده خدمات و دریافت نوبت آنلاین پزشکانی که در این مرکز
   درمانی در حال ارائه خدمات هستند از طریق
   <a href="/" class="font-bold">پذیرش ۲۴</a>
   طراحی و ارائه شده است. ممکن است رزرو نوبت برخی از پزشکان غیرفعال باشد
   که وابسته به تصمیم مرکز است؛ در این صورت می‌توانید از
   <a href="/consult" class="font-bold">مشاوره آنلاین پذیرش۲۴</a>
   یا
   <a href="/app" class="font-bold">اپلیکیشن پذیرش۲۴</a>
   استفاده کنید.
</p>
<p>
   در این صفحه می‌توانید اطلاعات تماس، آدرس و فهرست پزشکان فعال این مرکز را مشاهده کنید.
</p>
<p>
   ما قدردان اعتماد شما به
   <a class="font-bold" href="/">پذیرش۲۴</a>
   هستیم. اگر اطلاعات این صفحه نیاز به اصلاح دارد از
   <a class="font-bold" href="/home/support-form/">صفحه پشتیبانی</a>
   اطلاع دهید.
</p>`;

  const getJsonlds = () => {
    const pagePath = (router.asPath ?? `/center/${slug}`).split(/[?#]/)[0];
    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      name: profileData.name,
      url: `${publicRuntimeConfig.CLINIC_BASE_URL}${pagePath}`,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IR',
        addressLocality: profileData?.city,
        addressRegion: profileData?.province,
        streetAddress: profileData?.address,
      },
    };

    if (profileData?.tell) schema.telephone = profileData.tell;
    const bioText = profileData?.biography ? removeHtmlTagInString(profileData.biography).trim() : '';
    if (bioText) schema.description = bioText;
    const imageUrl = getImageUrl(profileData.image, publicRuntimeConfig.CDN_BASE_URL);
    if (imageUrl) schema.image = imageUrl;

    if (profileData?.map?.lat != null && profileData?.map?.lon != null) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: profileData.map.lat,
        longitude: profileData.map.lon,
      };
    }

    return [schema];
  };

  const centersInfoData = [
    {
      id: profileData.id,
      address: profileData.address,
      city: profileData.city,
      slug: profileData.slug,
      phoneNumbers: profileData.tell,
      location: profileData.map,
      description: profileData.desk,
    },
  ];

  return (
    <>
      <Seo
        title={documentTitle}
        description={documentDescription}
        jsonlds={getJsonlds()}
        openGraph={{
          image: {
            src: getImageUrl(profileData?.image, publicRuntimeConfig.CDN_BASE_URL),
            alt: profileData?.name,
            type: 'image/jpeg',
          },
        }}
        host={host}
      />
      <main className="flex flex-col items-start w-full max-w-screen-xl mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <section className="flex flex-col w-full space-y-3 md:basis-7/12">
          <ErrorBoundary>
            <Head
              pageViewCount={profileData?.number_of_visits}
              displayName={profileData?.name}
              image={getImageUrl(profileData?.image, publicRuntimeConfig.CDN_BASE_URL)}
              title={`${profileData?.group_expertises?.length ?? 0} تخصص پزشکی`}
              subTitle={`پزشک فعال: ${doctorsTotalHint}`}
              serviceList={(profileData?.expertises ?? [])
                .map((expertise: any) => expertise?.alias_title)
                .filter(Boolean)}
              toolBarItems={[
                {
                  type: 'share',
                  action: handleShare,
                },
              ]}
              className="shadow-card md:rounded-lg"
            />
          </ErrorBoundary>
          <nav className="md:hidden p-4 px-6 shadow-card border-t border-slate-100 sticky top-0 z-50 !mt-0 bg-white" aria-label="بخش‌های صفحه">
            <ul className="flex justify-around">
              <li>
                <a
                  href="#doctors-list"
                  onClick={e => {
                    e.preventDefault();
                    scrollIntoViewWithOffset('#doctors-list', 90);
                  }}
                  title="لیست پزشکان"
                  className="text-sm font-medium"
                >
                  لیست پزشکان
                </a>
              </li>
              <li>
                <a
                  href="#phone-and-address"
                  onClick={e => {
                    e.preventDefault();
                    scrollIntoViewWithOffset('#phone-and-address', 90);
                  }}
                  title="آدرس و تلفن"
                  className="text-sm font-medium"
                >
                  آدرس و تلفن
                </a>
              </li>
              {profileData.biography && (
                <li>
                  <a
                    href="#about"
                    onClick={e => {
                      e.preventDefault();
                      scrollIntoViewWithOffset('#about', 90);
                    }}
                    title="درباره مرکز"
                    className="text-sm font-medium"
                  >
                    درباره مرکز
                  </a>
                </li>
              )}
            </ul>
          </nav>
          <section id="doctors-list" className="flex flex-col w-full space-y-3">
            <Text fontWeight="bold" className="px-4 md:px-0">
              لیست پزشکان
            </Text>
            <div className="px-4 md:p-0">
              {isDoctorsError ? (
                <div className="flex flex-col items-center gap-3 p-4 text-center rounded-lg bg-slate-200">
                  <Text fontSize="sm" fontWeight="medium">
                    خطا در بارگذاری لیست پزشکان. بقیهٔ اطلاعات مرکز در دسترس است.
                  </Text>
                  <Button variant="secondary" onClick={() => refetchDoctors()}>
                    تلاش مجدد
                  </Button>
                </div>
              ) : (
                <ErrorBoundary>
                  <ListOfDoctors
                    isMainSite={isMainSite}
                    doctors={doctors}
                    expertises={
                      (() => {
                        const sections = expertises.data?.[0]?.items ?? [];
                        const withSubs = sections.find((item: any) => Array.isArray(item?.sub_items) && item.sub_items.length > 0);
                        return (
                          withSubs?.sub_items
                            ?.filter((expertise: any) => expertise?.name && expertise?.url)
                            ?.map((expertise: any) => ({
                              label: expertise.name,
                              value: expertise.url,
                            })) ?? []
                        );
                      })()
                    }
                    onChangePage={() => {
                      fetchNextPage();
                    }}
                    hasNextPage={hasNextPage ?? false}
                    showRateAndReviews={customize.showRateAndReviews}
                    expertiseListLoading={expertises.isLoading}
                    loading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    paginationResetKey={doctorsListResetKey}
                    onSelectExpertise={expertise => {
                      const raw = typeof expertise === 'string' ? expertise : '';
                      setSelectedExpertise(normalizeExpertiseRoute(raw.replace(/^\/?s\//, '')));
                    }}
                    searchQuery={searchQuery}
                    onSearch={query => {
                      setSearchQuery(query);
                    }}
                    defaultValue={defaultExpertise}
                    center_id={profileData?.id}
                  />
                </ErrorBoundary>
              )}
            </div>
          </section>
          <ErrorBoundary>
            <section id="phone-and-address" className="flex flex-col w-full space-y-3 md:hidden">
              <Text fontWeight="bold" className="px-4 md:px-0">
                آدرس و تلفن تماس
              </Text>
              <CentersInfo
                className="bg-white md:rounded-lg"
                centers={centersInfoData}
                onEventPhoneNumber={handleCenterPhoneClick}
                onEventAddress={handleCenterMapClick}
              />
            </section>
          </ErrorBoundary>
          {profileData.biography && (
            <ErrorBoundary>
              <section id="about" className="flex flex-col w-full space-y-3">
                <Text fontWeight="bold" className="px-4 md:px-0">
                  درباره مرکز درمانی
                </Text>
                <Biography content={profileData.biography} className="bg-white md:rounded-lg" />
              </section>
            </ErrorBoundary>
          )}
          {customize.showSeoBoxs && (
            <ErrorBoundary>
              <ProfileSeoBox about={about} />
            </ErrorBoundary>
          )}
        </section>
        <aside className="sticky flex-col hidden w-full space-y-3 top-5 md:flex md:basis-5/12">
          <ErrorBoundary>
            <Text fontWeight="bold" className="px-4 md:px-0">
              آدرس و تلفن تماس
            </Text>
            <CentersInfo
              className="bg-white md:rounded-lg"
              centers={centersInfoData}
              onEventPhoneNumber={handleCenterPhoneClick}
              onEventAddress={handleCenterMapClick}
            />
          </ErrorBoundary>
        </aside>
      </main>
    </>
  );
};

CenterProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter showSearchSuggestionButton={true} {...page.props.config}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withServerUtils(async (context: GetServerSidePropsContext) => {
  const { slug } = context.query;
  const host = context.req.headers?.host;
  const isMainSite = host === 'www.paziresh24.com' || host === 'p24-patient.darkube.app';
  const userAgent = context.req.headers['user-agent'] ?? null;
  const ssrStartedAt = Date.now();

  const slugFormatted = slug as string;
  try {
    const queryClient = new QueryClient();
    const { result, redirect } = await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.SlugProfile,
        {
          slug: slugFormatted,
        },
      ],
      () =>
        slugProfile({
          slug: slugFormatted,
        }),
    );

    if (result?.slugInfo?.type === 'doctor') {
      const doctorSlug = result?.slugInfo?.slug;
      if (!doctorSlug) {
        return { notFound: true };
      }
      return {
        redirect: {
          statusCode: 301,
          // Location header must be ASCII; Persian slugs need encodeURI
          destination: encodeURI(`/dr/${doctorSlug}/`),
        },
      };
    }

    if (redirect?.statusCode || result?.redirect?.statusCode) {
      if (redirect?.statusCode === 404 || result?.redirect?.statusCode === 404) {
        void sendCenterProfileEventServer(
          'center_profile_error',
          'ssr_not_found',
          {
            slug: slugFormatted,
            http_status: 404,
            duration_ms: Date.now() - ssrStartedAt,
          },
          userAgent,
        );
        return {
          notFound: true,
        };
      }
      const destination = redirect?.route ?? result?.redirect?.route;
      const statusCode = redirect?.statusCode ?? result?.redirect?.statusCode;
      if (!destination || !statusCode) {
        return { notFound: true };
      }
      return {
        redirect: {
          statusCode,
          // Location header must be ASCII; Persian routes from slugProfile need encodeURI
          destination: encodeURI(destination),
        },
      };
    }

    // Doctors list is fetched client-side via useInfiniteQuery.
    // Prefetching infinite queries in React Query v4 leaves pageParams[0] as undefined,
    // which Next.js cannot serialize in getServerSideProps.

    void sendCenterProfileEventServer(
      'center_ssr',
      'success',
      {
        slug: slugFormatted,
        duration_ms: Date.now() - ssrStartedAt,
        http_status: 200,
        center_id: result?.data?.id ?? null,
      },
      userAgent,
    );

    return {
      props: {
        dehydratedState: sanitizeDehydratedState(dehydrate(queryClient)),
        slug: slugFormatted,
        isMainSite,
      },
    };
  } catch (error) {
    console.dir(error);
    if (axios.isAxiosError(error)) {
      void sendCenterProfileEventServer(
        'center_profile_error',
        'ssr_error',
        {
          slug: slugFormatted,
          http_status: error.response?.status ?? 500,
          message: error.message,
          endpoint: error.config?.url,
          duration_ms: Date.now() - ssrStartedAt,
        },
        userAgent,
      );
      if (error.response?.status === 404) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          slug: slugFormatted,
          isMainSite,
          ssrErrorStatus: error.response?.status ?? 500,
        },
      };
    }

    void sendCenterProfileEventServer(
      'center_profile_error',
      'ssr_error_non_axios',
      {
        slug: slugFormatted,
        http_status: 500,
        message: error instanceof Error ? error.message : String(error),
        duration_ms: Date.now() - ssrStartedAt,
      },
      userAgent,
    );

    return {
      props: {
        slug: slugFormatted,
        isMainSite,
        ssrErrorStatus: 500,
      },
    };
  }
});

export default CenterProfile;

