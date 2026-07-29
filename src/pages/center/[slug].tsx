import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { slugProfile, useSlugProfile } from '@/common/apis/services/profile/slugProfile';
import { search as searchApi } from '@/common/apis/services/search/search';
import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text';
import ErrorBoundary from '@/common/components/layouts/errorBoundary';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import useLockScroll from '@/common/hooks/useLockScroll';
import { sendCenterProfileEvent, sendCenterProfileEventServer } from '@/modules/profile/events/nightBatEvents';
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

const CenterProfile = ({ query: { text, expertise }, host, isMainSite }: any) => {
  const { query, ...router } = useRouter();
  const share = useShare();
  const { customize } = useCustomize();
  const slug = query.slug as string;
  const addPageView = usePageView();
  const vicControlSentForSlugRef = useRef<string | null>(null);
  const setIsOpenSuggestion = useSearchStore(state => state.setIsOpenSuggestion);
  const { openScroll } = useLockScroll();

  useEffect(() => {
    setIsOpenSuggestion(false);
    openScroll();
  }, [slug]);

  const [searchQuery, setSearchQuery] = useState(text ?? '');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(text ?? '');
  useDebounce(
    () => {
      setDebouncedSearchTerm(searchQuery);
      remove();
    },
    600,
    [searchQuery],
  );
  const [selectedExpertise, setSelectedExpertise] = useState(expertise ? `ir/exp-${expertise}/` : '');

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
      ...(debouncedSearchTerm && { text: debouncedSearchTerm, page: 1 }),
    }),
    [debouncedSearchTerm, centerId],
  );

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
          page: 1,
          ...filters,
        },
      },
    ],
    queryFn: async ({ pageParam }) => {
      const page = await searchApi({
        route: selectedExpertise ?? '',
        query: {
          page: pageParam?.page ?? 1,
          ...filters,
        },
      });
      return sanitizeCenterSearchResultPage(page);
    },
    getNextPageParam: lastPage => {
      const pagination = lastPage?.search?.pagination;
      const total = lastPage?.search?.total;
      if (!pagination?.limit || !pagination?.page || total == null) return undefined;
      return pagination.limit * pagination.page <= total ? { page: pagination.page + 1 } : undefined;
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
    },
    {
      keepPreviousData: true,
      enabled: !!centerId,
    },
  );

  const defaultExpertise = useMemo(() => {
    const data = expertises.data?.[0]?.items?.[0]?.sub_items
      ?.filter((item: any) => item.url === `/s/${selectedExpertise}`)
      ?.map((expertise: any) => ({
        label: expertise.name,
        value: expertise.name,
      }))[0];

    return (
      data?.label ?? {
        label: 'همه تخصص ها',
        value: '',
      }
    );
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

  if (!profileData) {
    return null;
  }

  const documentTitle = `${profileData.name}، اطلاعات تماس و نوبت دهی آنلاین `;
  const ducmentDescription = `آدرس مطب، شماره تلفن و اطلاعات تماس ${profileData.name}، ${
    profileData.city ? `در ${profileData.city}` : ''
  } با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش24`;

  const handleShare = () => {
    const url = `${publicRuntimeConfig.CLINIC_BASE_URL}/${slug}?utm_source=profilecenter-share-button&utm_medium=profilecenter&utm_campaign=profilecenter`;
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
   این صفحه به عنوان وب سایت نوبت دهی اینترنتی
   <strong>${profileData.name}</strong>
   جهت مشاهده خدمات و دریافت نوبت آنلاین پزشکانی که در این مرکز
   درمانی در حال ارائه خدمات درمانی هستند از طریق
   <a href="/" class="font-bold">پذیرش ۲۴</a>
   طراحی و ارائه شده است. البته ممکن است در حال حاضر رزرو نوبت برخی
   از پزشکان فوق غیرفعال باشد که این موضوع وابسته به تصمیم مرکز در
   ارائه نوبت گیری بوده است؛ با این وجود شما می توانید از قابلیت
   <a href="/consult" class="font-bold">مشاوره آنلاین پذیرش۲۴</a>
   استفاده کنید. بیش از 500 پزشک متخصص، آماده ارائه خدمات مشاوره
   پزشکی به صورت تلفنی و متنی هستند. همچنین برای کاربری بهتر و راحت
   تر مشاوره می توانید
   <a href="/app" class="font-bold">اپلیکیشن پذیرش۲۴</a>
   را دانلود و نصب کنید.
</p>
<p>
   به طور معمول شما در این صفحه امکان مشاهده رزومه، آدرس مطب ،
   شماره تلفن تماس، پیج اینستاگرام ادرس کانال تلگرام و سایر راه
   های ارتباطی با دکتر که از ایشان در دسترس می باشد را خواهید داشت.
</p>
<p>
   همچنین میتوانید در بخش نظرات، تجربه خود در ارتباط با خدمات ${profileData.name} را به اشتراک گذاشته و نظرات دیگر
   کاربران را در مورد این مرکز و پزشکان آن بخوانید.
</p>
<p>
   ما قدردان اعتماد شما به
   <a class="font-bold" href="/">پذیرش۲۴</a>
   به عنوان گسترده ترین ابزار الکترونیک ارتباط بین پزشک و بیمار
   هستیم. لطفا در صورتی که اطلاعات ارائه شده در این صفحه نیاز به
   اصلاح دارد با مراجعه به
   <a class="font-bold" href="/home/support-form/">صفحه پشتیبانی</a>
   و یا تذکر به پزشک و یا پرسنل مرکز درمانی این موضوع را به ما
   اطلاع دهید.
</p>`;

  const getJsonlds = () => {
    return [
      {
        '@context': 'http://www.schema.org',
        '@type': 'Physician',
        'priceRange': '$$',
        'name': profileData.name,
        'telephone': profileData?.tell,
        'description': profileData?.biography ? removeHtmlTagInString(profileData.biography) : '',
        'image': getImageUrl(profileData.image, publicRuntimeConfig.CDN_BASE_URL),
        'isAcceptingNewPatients': true,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + router.asPath,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IRN',
          },
          'addressLocality': profileData?.city,
          'addressRegion': profileData?.province,
          'streetAddress': profileData?.address,
        },
      },
      {
        '@context': 'http://www.schema.org',
        '@type': 'Person',
        'jobTitle': 'physician',
        'name': profileData.name,
        'telephone': profileData?.tell,
        'image': getImageUrl(profileData.image, publicRuntimeConfig.CDN_BASE_URL),
        'url': publicRuntimeConfig.CLINIC_BASE_URL + router.asPath,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': {
            '@type': 'Country',
            'name': 'IRN',
          },
          'addressLocality': profileData?.city,
          'addressRegion': profileData?.province,
          'streetAddress': profileData?.address,
        },
      },
    ];
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
        description={ducmentDescription}
        jsonlds={getJsonlds()}
        openGraph={{
          image: {
            src: getImageUrl(profileData?.image, publicRuntimeConfig.CDN_BASE_URL),
            alt: profileData?.name,
            type: 'image/jpg',
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
              subTitle={`پزشک فعال: ${profileData?.doctors?.length ?? 0}`}
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
          <nav className="md:hidden p-4 px-6 shadow-card border-t border-slate-100 sticky top-0 z-50 !mt-0 bg-white">
            <ul className="flex justify-around">
              <a
                href="#doctors-list"
                onClick={e => {
                  e.preventDefault();
                  scrollIntoViewWithOffset('#doctors-list', 90);
                }}
                title="لیست پرشکان"
                className="text-sm font-medium"
              >
                لیست پزشکان
              </a>
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
                      expertises.data?.[0]?.items?.[0]?.sub_items
                        ?.filter((expertise: any) => expertise?.name && expertise?.url)
                        ?.map((expertise: any) => ({
                          label: expertise.name,
                          value: expertise.url,
                        })) ?? []
                    }
                    onChangePage={page => {
                      fetchNextPage({ pageParam: { page } });
                    }}
                    hasNextPage={hasNextPage ?? false}
                    showRateAndReviews={customize.showRateAndReviews}
                    expertiseListLoading={expertises.isLoading}
                    loading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    onSelectExpertise={expertise => {
                      setSelectedExpertise(expertise.replace('/s/', ''));
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
      return {
        redirect: {
          statusCode: 301,
          destination: encodeURI(`/dr/${result?.slugInfo?.slug}/`),
        },
      };
    }

    if (redirect?.statusCode || result?.redirect?.statusCode) {
      if (redirect?.statusCode == 404 || result?.redirect?.statusCode == 404) {
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
      return {
        redirect: {
          statusCode: redirect?.statusCode ?? result?.redirect?.statusCode,
          destination: encodeURI(redirect?.route ?? result?.redirect?.route),
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
      if (error.response?.status == 404)
        return {
          notFound: true,
        };
    } else {
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
    }
    throw new TypeError(JSON.stringify(error));
  }
});

export default CenterProfile;

