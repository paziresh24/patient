import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { slugProfile, useSlugProfile } from '@/common/apis/services/profile/slugProfile';
import { suggestion, useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import Text from '@/common/components/atom/text/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useCustomize from '@/common/hooks/useCustomize';
import useShare from '@/common/hooks/useShare';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import Biography from '@/modules/profile/views/biography/biography';
import CentersInfo from '@/modules/profile/views/centersInfo/centersInfo';
import Head from '@/modules/profile/views/head/head';
import ListOfDoctors from '@/modules/profile/views/listOfDoctors/listOfDoctors';
import ProfileSeoBox from '@/modules/profile/views/seoBox/seoBox';
import axios from 'axios';
import config from 'next/config';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { NextPageWithLayout } from '../_app';

const { publicRuntimeConfig } = config();

const CenterProfile: NextPageWithLayout = ({ query: { university } }: any) => {
  const { query, ...router } = useRouter();
  const share = useShare();
  const { customize } = useCustomize();
  const slug = query.slug as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('');

  const profile = useSlugProfile(
    { slug },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );
  const profileData = profile.data?.result?.data;
  const doctors = useSearchSuggestion(
    {
      query: searchQuery,
      center_id: profileData.id,
      expertise: selectedExpertise,
      university,
    },
    {
      refetchOnMount: false,
    },
  );
  const expertises = useSearchSuggestion(
    {
      query: '',
      center_id: profileData.id,
      return_expertise: true,
      university,
    },
    {
      keepPreviousData: true,
    },
  );

  const documentTitle = `${profileData.name}، اطلاعات تماس و نوبت دهی آنلاین | پذیرش24`;
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

  return (
    <>
      <Seo title={documentTitle} description={ducmentDescription} canonicalUrl={publicRuntimeConfig.CLINIC_BASE_URL + router.pathname} />
      {!university && (
        <Script id="clarity-new-version" strategy="lazyOnload" type="text/javascript">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "g1qw1smpmx");`}
        </Script>
      )}
      <div className="flex flex-col items-start max-w-screen-xl mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
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
                doctors={doctors.data?.[0]?.items ?? []}
                expertises={
                  expertises.data?.[0]?.items?.[0]?.sub_items?.map((expertise: any) => ({
                    label: expertise.name,
                    value: expertise.name,
                  })) ?? []
                }
                showRateAndReviews={customize.showRateAndReviews}
                loading={doctors.isLoading}
                onSelectExpertise={setSelectedExpertise}
                onSearch={setSearchQuery}
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
              <Biography biography={profileData.biography} className="bg-white md:rounded-lg" />
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { slug, ...query } = context.query;
  const university = query.university as string;

  const slugFormmated = slug as string;
  try {
    const queryClient = new QueryClient();
    const { result, redirect } = await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.SlugProfile,
        {
          slug: slugFormmated,
        },
      ],
      () =>
        slugProfile({
          slug: slugFormmated,
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

    await queryClient.fetchQuery(
      [ServerStateKeysEnum.SearchSuggestion, { query: '', center_id: result?.data?.id, expertise: '', ...(university && { university }) }],
      () => suggestion({ query: '', center_id: result?.data?.id, expertise: '', ...(university && { university }) }),
    );

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        query,
        slug: slugFormmated,
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
};

export default CenterProfile;
