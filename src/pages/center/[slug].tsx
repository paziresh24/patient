import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { slugProfile, useSlugProfile } from '@/common/apis/services/profile/slugProfile';
import { suggestion, useSearchSuggestion } from '@/common/apis/services/search/suggestion';
import Text from '@/common/components/atom/text/text';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useShare from '@/common/hooks/useShare';
import Biography from '@/modules/profile/views/biography/biography';
import CentersInfo from '@/modules/profile/views/centersInfo/centersInfo';
import Head from '@/modules/profile/views/head/head';
import ListOfDoctors from '@/modules/profile/views/listOfDoctors/listOfDoctors';
import ProfileSeoBox from '@/modules/profile/views/seoBox/seoBox';
import axios from 'axios';
import config from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import { NextPageWithLayout } from '../_app';

const { publicRuntimeConfig } = config();

const CenterProfile: NextPageWithLayout = () => {
  const { query, ...router } = useRouter();
  const share = useShare();
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
          <Text fontWeight="bold" className="px-4 md:px-0">
            لیست پزشکان
          </Text>
          <div className="px-4 md:p-0">
            <ListOfDoctors
              doctors={doctors.data?.[0]?.items ?? []}
              expertises={
                expertises.data?.[0]?.items?.[0]?.sub_items?.map((expertise: any) => ({
                  label: expertise.name,
                  value: expertise.name,
                })) ?? []
              }
              loading={doctors.isLoading}
              onSelectExpertise={setSelectedExpertise}
              onSearch={setSearchQuery}
            />
          </div>
          <div className="flex flex-col w-full space-y-3 md:hidden md:basis-5/12">
            <Text fontWeight="bold" className="px-4 md:px-0">
              آدرس و تلفن تماس
            </Text>
            <CentersInfo
              className="bg-white md:rounded-lg"
              centers={[
                {
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
            <>
              <Text fontWeight="bold" className="px-4 md:px-0">
                درباره مرکز درمانی
              </Text>
              <Biography biography={profileData.biography} className="bg-white md:rounded-lg" />
            </>
          )}
          <ProfileSeoBox about={about} />
        </div>
        <div className="sticky flex-col hidden w-full space-y-3 top-5 md:flex md:basis-5/12">
          <Text fontWeight="bold" className="px-4 md:px-0">
            آدرس و تلفن تماس
          </Text>
          <CentersInfo
            className="bg-white md:rounded-lg"
            centers={[
              {
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
      <div className="flex items-center max-w-screen-xl p-5 mx-auto mt-5 md:mt-0 md:rounded-lg space-s-4 bg-slate-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          x="0px"
          y="0px"
          viewBox="0 0 1000 1000"
          enableBackground="new 0 0 1000 1000"
          xmlSpace="preserve"
          className="w-16 min-w-[3rem] h-16 fill-slate-500"
        >
          <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
          <g>
            <g>
              <path d="M643.4,124.3c-14.5-14.5-33.7-22.4-54.1-22.4c-20.5,0-39.7,8-54.2,22.4l-43.2,43.2c-14.5,14.5-22.5,33.7-22.5,54.2c0,14.4,4,28.2,11.4,40.2L65,428.5c-27.8,12.2-47.7,37.3-53.3,67c-5.7,29.9,3.8,60.6,25.5,82.3l389.5,385.3c16.8,16.8,39.1,26.3,62.6,26.9c0.6,0,1.8,0,2.4,0c6.2,0,12.5-0.6,18.7-1.9c30.4-6.3,55.4-27.3,66.7-56l163.6-409.6c12.3,8.1,26.8,12.5,41.9,12.5c20.5,0,39.7-8,54.1-22.4l43.1-43.1c14.6-14.5,22.6-33.8,22.6-54.3s-8-39.8-22.4-54.1L643.4,124.3L643.4,124.3z M520.2,909.4c-3.8,9.6-12.2,16.7-22.3,18.7c-2.3,0.5-4.7,0.7-7,0.6c-7.8-0.2-15.3-3.3-20.9-8.9L80.2,534.3c-7.2-7.1-10.3-17.4-8.4-27.3c1.9-9.9,8.5-18.3,17.8-22.4L280,408.3c128.3,42.7,256.6,1.6,385,138.5L520.2,909.4z M836.6,425.9l-43.3,43.3c-6,6-15.7,6-21.7,0L717.5,415L673.7,525l3.6-9.3c-92.2-92-185.9-103.6-270.4-114c-27.2-3.3-53.5-6.8-79.4-12.4l260-104.2l-52.5-52.5c-6-6-6-15.7,0-21.7l43.3-43.3c6-6,15.7-6,21.7,0l236.6,236.6C842.7,410.2,842.7,419.9,836.6,425.9L836.6,425.9z M515.3,653.1c42.2,0,76.6-34.3,76.6-76.6S557.6,500,515.3,500c-42.2,0-76.6,34.3-76.6,76.6S473.1,653.1,515.3,653.1z M515.3,530.6c25.4,0,45.9,20.6,45.9,45.9c0,25.4-20.6,45.9-45.9,45.9c-25.4,0-45.9-20.6-45.9-45.9C469.4,551.2,489.9,530.6,515.3,530.6z M913.4,10c-42.2,0-76.6,34.3-76.6,76.6c0,42.2,34.3,76.6,76.6,76.6S990,128.8,990,86.6C990,44.3,955.7,10,913.4,10z M913.4,132.5c-25.4,0-45.9-20.6-45.9-45.9s20.6-45.9,45.9-45.9c25.4,0,45.9,20.6,45.9,45.9S938.8,132.5,913.4,132.5z M255,530.6c0,33.8,27.5,61.2,61.2,61.2c33.8,0,61.2-27.5,61.2-61.2c0-33.8-27.5-61.2-61.2-61.2C282.5,469.4,255,496.8,255,530.6z M316.3,500c16.9,0,30.6,13.7,30.6,30.6c0,16.9-13.7,30.6-30.6,30.6c-16.9,0-30.6-13.7-30.6-30.6C285.6,513.7,299.4,500,316.3,500z M377.5,714.4c0-16.9,13.7-30.6,30.6-30.6c16.9,0,30.6,13.7,30.6,30.6c0,16.9-13.7,30.6-30.6,30.6C391.2,745,377.5,731.3,377.5,714.4z M867.5,255c0-16.9,13.7-30.6,30.6-30.6c16.9,0,30.6,13.7,30.6,30.6c0,16.9-13.7,30.6-30.6,30.6C881.2,285.6,867.5,271.9,867.5,255z" />
            </g>
          </g>
        </svg>
        <div className="flex flex-col space-y-2 text-slate-500">
          <Text fontWeight="bold" fontSize="sm">
            شما در حال مشاهده نسخه آزمایشی می باشید.
          </Text>
          <Text fontSize="xs" className="leading-5">
            جهت گزارش مشکل یا پیشنهادات{' '}
            <a
              target="_blank"
              href="https://community.paziresh24.com/t/topic/783"
              className="text-xs underline decoration-dashed"
              rel="noreferrer"
            >
              https://community.paziresh24.com/t/topic/783
            </a>
          </Text>
        </div>
      </div>
    </>
  );
};

CenterProfile.getLayout = function getLayout(page: ReactElement) {
  return <LayoutWithHeaderAndFooter {...page.props.config}>{page}</LayoutWithHeaderAndFooter>;
};

const dateStripped = (obj: any) => {
  let newObj: any = {};
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    if (value !== null) {
      // If array, loop...
      if (Array.isArray(value)) {
        value = value.map(item => dateStripped(item));
      }
      // ...if property is date/time, stringify/parse...
      else if (typeof value === 'object' && typeof value.getMonth === 'function') {
        value = JSON.parse(JSON.stringify(value));
      }
      // ...and if a deep object, loop.
      else if (typeof value === 'object') {
        value = dateStripped(value);
      }
    }
    newObj[key] = value;
  });
  return newObj;
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { slug, ...query } = context.query;

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

    await queryClient.fetchQuery([ServerStateKeysEnum.SearchSuggestion, { query: '', center_id: result?.data?.id, expertise: '' }], () =>
      suggestion({ query: '', center_id: result?.data?.id, expertise: '' }),
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
