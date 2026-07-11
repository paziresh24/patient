import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { slugProfile, useSlugProfile } from '@/common/apis/services/profile/slugProfile';
import { search as searchApi } from '@/common/apis/services/search/search';
import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import HospitalIcon from '@/common/components/icons/hospital';
import LocationIcon from '@/common/components/icons/location';
import PhoneIcon from '@/common/components/icons/phone';
import UsersIcon from '@/common/components/icons/users';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import { splunkInstance } from '@/common/services/splunk';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import { sanitizeObject } from '@/common/utils/sanitizeObject';
import CentersInfo from '@/modules/profile/views/centersInfo';
import { CenterHead, CenterMobileNav, CenterSectionTitle } from '@/modules/profile/views/centerHead';
import ListOfDoctors from '@/modules/profile/views/listOfDoctors';
import ProfileSeoBox from '@/modules/profile/views/seoBox';
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
import { usePageView } from '@/common/apis/services/profile/pageView';
import { useSearchStore } from '@/modules/search/store/search';
import useLockScroll from '@/common/hooks/useLockScroll';
import Loading from '@/common/components/atom/loading';
import ErrorPage from '@/modules/profile/components/errorPage';
const Biography = dynamic(() => import('@/modules/profile/views/biography'));

const { publicRuntimeConfig } = config();

const normalizeExpertiseRoute = (path = '') => path.replace(/^\/s\//, '').replace(/\/$/, '');

const getSearchNextPageParam = (lastPage: any) => {
  const pagination = lastPage.search?.pagination;
  if (!pagination) return undefined;

  const { limit, page } = pagination;
  const total = lastPage.search?.total ?? 0;

  return limit * page < total ? { page: page + 1 } : undefined;
};

const buildCenterNotFoundProps = (context: GetServerSidePropsContext, slug: string) => {
  context.res.statusCode = 404;

  return {
    props: sanitizeObject({
      status: 404,
      slug,
      shouldFetchOnClient: false,
      dehydratedState: dehydrate(new QueryClient()),
    }),
  };
};

const buildCenterSsrFallbackProps = (slug: string) => ({
  props: sanitizeObject({
    slug,
    shouldFetchOnClient: true,
    status: 200,
    dehydratedState: dehydrate(new QueryClient()),
  }),
});

const CenterProfile = (props: any) => {
  const { query: { text, expertise } = {}, host, status, shouldFetchOnClient } = props;
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
  const [selectedExpertise, setSelectedExpertise] = useState(
    expertise ? `ir/exp-${expertise}/` : '',
  );

  const profile = useSlugProfile(
    { slug },
    {
      keepPreviousData: true,
      enabled: !!slug,
      refetchOnMount: shouldFetchOnClient ? 'always' : false,
    },
  );
  const profileData = profile.data?.result?.data;
  const centerId = profileData?.id;

  const filters = useMemo(
    () => ({
      ...(centerId && { center: centerId }),
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
    isLoading: isDoctorsLoading,
    isFetching: isDoctorsFetching,
    isError: isDoctorsError,
    refetch: refetchDoctors,
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
    queryFn: ({ pageParam }) =>
      searchApi({
        route: selectedExpertise ?? '',
        query: {
          page: pageParam?.page ?? 1,
          ...filters,
        },
      }),
    getNextPageParam: getSearchNextPageParam,
    enabled: !!centerId,
  });

  const isDoctorsListLoading = isDoctorsLoading || (isDoctorsFetching && !doctors?.pages?.length);

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchQuery);
    },
    600,
    [searchQuery],
  );

  const expertises = useSearchSuggestion(
    {
      query: '',
      center_id: centerId,
      return_expertise: true,
    },
    {
      enabled: !!centerId,
      keepPreviousData: true,
    },
  );

  const defaultExpertise = useMemo(() => {
    const normalizedRoute = normalizeExpertiseRoute(selectedExpertise);
    const data = expertises.data?.[0]?.items?.[0]?.sub_items
      ?.filter((item: any) => normalizeExpertiseRoute(item.url) === normalizedRoute)
      ?.map((expertise: any) => ({
        label: expertise.name,
        value: expertise.url,
      }))[0];

    return (
      data ?? {
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
    if (profileData) {
      splunkInstance('center-profile').sendEvent({
        group: 'center_profile',
        type: 'load_center_profile',
        event: {
          data: {
            id: profileData?.id,
            server_id: profileData?.server_id,
            name: profileData.name,
            terminal_id: getCookie('terminal_id'),
          },
        },
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

  if (status === 404) {
    return <ErrorPage statusCode={404} profileType="center" refresh={() => router.reload()} />;
  }

  if (shouldFetchOnClient && profile.isLoading && !profileData) {
    return (
      <div className="flex flex-grow justify-center items-center min-h-[50vh]">
        <Loading width={50} />
      </div>
    );
  }

  if (profile.isLoading && !profileData) {
    return (
      <div className="flex flex-grow justify-center items-center min-h-[50vh]">
        <Loading width={50} />
      </div>
    );
  }

  if (profile.isError || !profileData) {
    const errorStatusCode = (profile.error as any)?.response?.status ?? (profileData ? undefined : 404);
    return (
      <ErrorPage
        statusCode={errorStatusCode ?? 500}
        profileType="center"
        refresh={() => profile.refetch()}
      />
    );
  }

  const documentTitle = `${profileData.name}، اطلاعات تماس و نوبت دهی آنلاین `;
  const documentDescription = `آدرس مطب، شماره تلفن و اطلاعات تماس ${profileData.name}، ${
    profileData.city ? `در ${profileData.city}` : ''
  } با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش24`;

  const centerInfoItems = [
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

  const handleShare = () => {
    const url = `${publicRuntimeConfig.CLINIC_BASE_URL}/${slug}?utm_source=profilecenter-share-button&utm_medium=profilecenter&utm_campaign=profilecenter`;
    share({
      title: documentTitle,
      text: `${profileData.name} در پذیرش۲۴`,
      url,
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
        '@context': 'https://schema.org',
        '@type': 'MedicalClinic',
        'priceRange': '$$',
        'name': profileData.name,
        'telephone': profileData.tell,
        'description': profileData.biography ? removeHtmlTagInString(profileData.biography) : '',
        'image': publicRuntimeConfig.CDN_BASE_URL + profileData.image,
        'isAcceptingNewPatients': true,
        'url': publicRuntimeConfig.CLINIC_BASE_URL + router.asPath,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'IR',
          'addressLocality': profileData.city,
          'addressRegion': profileData.province,
          'streetAddress': profileData.address,
        },
      },
    ];
  };

  return (
    <>
      <Seo
        title={documentTitle}
        description={documentDescription}
        jsonlds={getJsonlds()}
        openGraph={{
          image: {
            src: publicRuntimeConfig.CDN_BASE_URL + profileData.image,
            alt: profileData.name,
            type: 'image/jpg',
          },
        }}
        host={host}
      />
      <main className="mx-auto flex w-full max-w-screen-xl flex-col items-start bg-slate-50 md:flex-row md:gap-5 md:bg-transparent md:px-0 md:py-10">
        <section className="flex w-full flex-col space-y-3 md:basis-7/12 md:space-y-4">
          <CenterHead
            pageViewCount={profileData.number_of_visits}
            displayName={profileData.name}
            image={publicRuntimeConfig.CDN_BASE_URL + profileData.image}
            city={profileData.city}
            province={profileData.province}
            expertiseCount={profileData.group_expertises?.length ?? 0}
            activeDoctorsCount={profileData.doctors?.length ?? 0}
            serviceList={profileData.expertises?.map((expertise: any) => expertise.alias_title)}
            toolBarItems={[
              {
                type: 'share',
                action: handleShare,
              },
            ]}
          />
          <CenterMobileNav
            items={[
              { id: 'doctors-list', label: 'لیست پزشکان', icon: <UsersIcon width={16} height={16} /> },
              { id: 'phone-and-address', label: 'آدرس و تلفن', icon: <PhoneIcon width={16} height={16} /> },
              ...(profileData.biography
                ? [{ id: 'about', label: 'درباره مرکز', icon: <HospitalIcon width={16} height={16} /> }]
                : []),
            ]}
          />
          <section
            id="doctors-list"
            className="flex w-full flex-col space-y-3 bg-white py-4 shadow-sm md:rounded-2xl md:p-5 md:shadow-card"
          >
            <CenterSectionTitle title="لیست پزشکان" icon={<UsersIcon width={18} height={18} />} />
            <div className="px-4 md:p-0">
              <ListOfDoctors
                doctors={doctors}
                expertises={
                  expertises.data?.[0]?.items?.[0]?.sub_items?.map((expertise: any) => ({
                    label: expertise.name,
                    value: expertise.url,
                  })) ?? []
                }
                onChangePage={page => {
                  fetchNextPage({ pageParam: { page } });
                }}
                hasNextPage={!!hasNextPage}
                showRateAndReviews={customize.showRateAndReviews}
                expertiseListLoading={expertises.isLoading}
                expertiseListError={expertises.isError}
                doctorsError={isDoctorsError}
                onRetryDoctors={() => refetchDoctors()}
                onRetryExpertises={() => expertises.refetch()}
                loading={isDoctorsListLoading}
                isFetchingNextPage={isFetchingNextPage}
                onSelectExpertise={expertiseUrl => {
                  const normalized = normalizeExpertiseRoute(expertiseUrl);
                  setSelectedExpertise(normalized ? `${normalized}/` : '');
                }}
                searchQuery={searchQuery}
                onSearch={query => {
                  setSearchQuery(query);
                }}
                defaultValue={defaultExpertise}
              />
            </div>
          </section>
          <section id="phone-and-address" className="flex w-full flex-col space-y-3 bg-white py-4 shadow-sm md:hidden">
            <CenterSectionTitle title="آدرس و تلفن تماس" icon={<LocationIcon width={18} height={18} />} />
            <CentersInfo className="mx-4 rounded-xl border border-slate-100 bg-white md:mx-0" centers={centerInfoItems} />
          </section>
          {profileData.biography && (
            <section
              id="about"
              className="flex w-full flex-col space-y-3 bg-white py-4 shadow-sm md:rounded-2xl md:p-5 md:shadow-card"
            >
              <CenterSectionTitle title="درباره مرکز درمانی" icon={<HospitalIcon width={18} height={18} />} />
              <Biography content={profileData.biography} className="mx-4 rounded-xl border border-slate-100 bg-white md:mx-0" />
            </section>
          )}
          {customize.showSeoBoxs && <ProfileSeoBox about={about} />}
        </section>
        <aside className="sticky top-5 hidden w-full flex-col space-y-3 md:flex md:basis-5/12">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
            <CenterSectionTitle title="آدرس و تلفن تماس" icon={<PhoneIcon width={18} height={18} />} className="mb-4 !px-0" />
            <CentersInfo className="!p-0" centers={centerInfoItems} />
          </div>
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

  const slugFormatted = decodeURIComponent(slug as string);
  try {
    const queryClient = new QueryClient();
    const slugProfileResponse = await queryClient.fetchQuery(
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

    const { result, redirect } = slugProfileResponse ?? {};

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
        return buildCenterNotFoundProps(context, slugFormatted);
      }
      return {
        redirect: {
          statusCode: redirect?.statusCode ?? result?.redirect?.statusCode,
          destination: encodeURI(redirect?.route ?? result?.redirect?.route),
        },
      };
    }

    if (!result?.data?.id && !redirect?.statusCode && !result?.redirect?.statusCode) {
      return buildCenterNotFoundProps(context, slugFormatted);
    }

    return {
      props: sanitizeObject({
        dehydratedState: dehydrate(queryClient),
        slug: slugFormatted,
      }),
    };
  } catch (error) {
    console.error(error);
    if (axios.isAxiosError(error) && error.response?.status == 404) {
      return buildCenterNotFoundProps(context, slugFormatted);
    }

    console.warn(`SSR error for center slug: ${slugFormatted}. Falling back to client-side rendering.`);
    return buildCenterSsrFallbackProps(slugFormatted);
  }
});

export default CenterProfile;

