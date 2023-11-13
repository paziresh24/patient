import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { slugProfile, useSlugProfile } from '@/common/apis/services/profile/slugProfile';
import { search as searchApi } from '@/common/apis/services/search/search';
import { useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import Text from '@/common/components/atom/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import { splunkCenterProfileInstance } from '@/common/services/splunk';
import { removeHtmlTagInString } from '@/common/utils/removeHtmlTagInString';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import CentersInfo from '@/modules/profile/views/centersInfo';
import Head from '@/modules/profile/views/head';
import ListOfDoctors from '@/modules/profile/views/listOfDoctors';
import ProfileSeoBox from '@/modules/profile/views/seoBox';
import { push } from '@socialgouv/matomo-next';
import { QueryClient, dehydrate, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import flatten from 'lodash/flatten';
import { GetServerSidePropsContext } from 'next';
import config from 'next/config';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useMemo, useState } from 'react';
const Biography = dynamic(() => import('@/modules/profile/views/biography'));

const { publicRuntimeConfig } = config();

const CenterProfile = ({ query: { text }, host }: any) => {
  const { query, ...router } = useRouter();
  const share = useShare();
  const { customize } = useCustomize();
  const slug = query.slug as string;
  const [searchQuery, setSearchQuery] = useState(text ?? '');
  const [selectedExpertise, setSelectedExpertise] = useState('');

  const profile = useSlugProfile(
    { slug },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );
  const profileData = profile.data?.result?.data;
  const filters = {
    center: profileData.id,
    result_type: 'پزشکان+بیمارستانی',
    ...(searchQuery && { text: searchQuery }),
  };

  const {
    data: doctors,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    remove,
  } = useInfiniteQuery({
    queryKey: [
      ServerStateKeysEnum.Search,
      {
        route: selectedExpertise ?? '',
        query: {
          ...filters,
          page: 1,
        },
      },
    ],
    queryFn: ({ pageParam }) =>
      searchApi({
        route: selectedExpertise ?? '',
        query: {
          ...filters,
          page: pageParam ?? 1,
        },
      }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.search?.pagination?.limit * lastPage.search?.pagination?.page <= lastPage.search?.total ? lastPage : undefined;
    },
    refetchOnMount: false,
  });

  const expertises = useSearchSuggestion(
    {
      query: '',
      center_id: profileData.id,
      return_expertise: true,
    },
    {
      keepPreviousData: true,
    },
  );

  const defaultExpertise = useMemo(() => {
    const selectedExpertise = expertises.data?.[0]?.items?.[0]?.sub_items
      ?.filter((item: any) => item.id === +query.expertise_id!)
      ?.map((expertise: any) => ({
        label: expertise.name,
        value: expertise.name,
      }))[0];

    return (
      selectedExpertise ?? {
        label: 'همه تخصص ها',
        value: '',
      }
    );
  }, [query.expertise_id, expertises]);

  useEffect(() => {
    if (profileData) {
      push(['trackEvent', 'contact', 'center profile']);
      splunkCenterProfileInstance().sendEvent({
        group: 'center_profile',
        type: 'load_center_profile',
        event: {
          data: {
            ...profileData,
            terminal_id: getCookie('terminal_id'),
          },
        },
      });
    }
  }, [profileData]);

  const documentTitle = `${profileData.name}، اطلاعات تماس و نوبت دهی آنلاین `;
  const ducmentDescription = `آدرس مطب، شماره تلفن و اطلاعات تماس ${profileData.name}، ${
    profileData.city ? `در ${profileData.city}` : ''
  } با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش24`;

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
        '@context': 'http://www.schema.org',
        '@type': 'Physician',
        'priceRange': '$$',
        'name': profileData.name,
        'telephone': profileData?.tell,
        'description': profileData?.biography ? removeHtmlTagInString(profileData.biography) : '',
        'image': publicRuntimeConfig.CLINIC_BASE_URL + profileData.image,
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
        'image': publicRuntimeConfig.CLINIC_BASE_URL + profileData.image,
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

  return (
    <>
      <Seo
        title={documentTitle}
        description={ducmentDescription}
        jsonlds={getJsonlds()}
        openGraph={{
          image: {
            src: publicRuntimeConfig.CLINIC_BASE_URL + profileData?.image,
            alt: profileData?.name,
            type: 'image/jpg',
          },
        }}
        host={host}
      />
      <div className="flex flex-col items-start w-full max-w-screen-xl mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="flex flex-col w-full space-y-3 md:basis-7/12">
          <Head
            pageViewCount={profileData?.number_of_visits}
            displayName={profileData?.name}
            image={publicRuntimeConfig.CLINIC_BASE_URL + profileData?.image}
            title={`${profileData?.group_expertises?.length} تخصص پزشکی`}
            subTitle={`پزشک فعال: ${profileData?.doctors?.length}`}
            serviceList={profileData?.expertises?.map((expertise: any) => expertise.alias_title)}
            toolBarItems={[
              {
                type: 'share',
                action: handleShare,
              },
            ]}
            className="shadow-card md:rounded-lg"
          />
          <nav className="md:hidden p-4 px-6 shadow-card border-t border-slate-100 sticky top-0 z-50 !mt-0 bg-white flex justify-around">
            <div onClick={() => scrollIntoViewWithOffset('#doctors-list_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                لیست پزشکان
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#center-info_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                آدرس و تلفن
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#about_section', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                درباره مرکز
              </Text>
            </div>
          </nav>
          <div id="doctors-list_section" className="flex flex-col w-full space-y-3">
            <Text fontWeight="bold" className="px-4 md:px-0">
              لیست پزشکان
            </Text>
            <div id="doctors-list_section" className="px-4 md:p-0">
              <ListOfDoctors
                doctors={flatten(doctors?.pages?.map(page => page?.search?.result as any[]) ?? []) ?? []}
                expertises={
                  expertises.data?.[0]?.items?.[0]?.sub_items?.map((expertise: any) => ({
                    label: expertise.name,
                    value: expertise.url,
                  })) ?? []
                }
                onChangePage={page => {
                  fetchNextPage({ pageParam: page });
                }}
                hasNextPage={hasNextPage ?? true}
                showRateAndReviews={customize.showRateAndReviews}
                expertiseListLoading={expertises.isLoading}
                loading={isLoading}
                isFetchingNextPage={isFetchingNextPage}
                onSelectExpertise={expertise => {
                  remove();
                  setSelectedExpertise(expertise.replace('/s/', ''));
                }}
                searchQuery={searchQuery}
                onSearch={query => {
                  remove();
                  setSearchQuery(query);
                }}
                defaultValue={defaultExpertise}
              />
            </div>
          </div>
          <div id="center-info_section" className="flex flex-col w-full space-y-3 md:hidden">
            <Text fontWeight="bold" className="px-4 md:px-0">
              آدرس و تلفن تماس
            </Text>
            <CentersInfo
              className="bg-white md:rounded-lg"
              centers={[
                {
                  id: profileData.id,
                  address: profileData.address,
                  city: profileData.city,
                  slug: profileData.slug,
                  phoneNumbers: profileData.tell,
                  location: profileData.map,
                  description: profileData.desk,
                },
              ]}
            />
          </div>
          {profileData.biography && (
            <div id="about_section" className="flex flex-col w-full space-y-3">
              <Text fontWeight="bold" className="px-4 md:px-0">
                درباره مرکز درمانی
              </Text>
              <Biography content={profileData.biography} className="bg-white md:rounded-lg" />
            </div>
          )}
          {customize.showSeoBoxs && <ProfileSeoBox about={about} />}
        </div>
        <div className="sticky flex-col hidden w-full space-y-3 top-5 md:flex md:basis-5/12">
          <Text fontWeight="bold" className="px-4 md:px-0">
            آدرس و تلفن تماس
          </Text>
          <CentersInfo
            className="bg-white md:rounded-lg"
            centers={[
              {
                id: profileData.id,
                address: profileData.address,
                city: profileData.city,
                slug: profileData.slug,
                phoneNumbers: profileData.tell,
                location: profileData.map,
                description: profileData.desk,
              },
            ]}
          />
        </div>
      </div>
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
  const { slug, ...query } = context.query;
  const text = query?.text as string;

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

    if (redirect) {
      return {
        redirect: {
          statusCode: redirect.statusCode,
          destination: encodeURI(redirect.route),
        },
      };
    }

    const filters = {
      center: result?.data?.id,
      result_type: 'پزشکان+بیمارستانی',
      ...(text && { text }),
    };

    await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.Search,
        {
          route: '',
          query: {
            ...filters,
            page: 1,
          },
        },
      ],
      () => searchApi({ route: '', query: { ...filters, page: 1 } }).then(data => ({ pages: [data] })),
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        slug: slugFormatted,
      },
    };
  } catch (error) {
    console.dir(error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404)
        return {
          notFound: true,
        };
    }
    throw new TypeError(JSON.stringify(error));
  }
});

export default CenterProfile;
