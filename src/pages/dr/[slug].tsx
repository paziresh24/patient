import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getProfileData, useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { internalLinks, useInternalLinks } from '@/common/apis/services/profile/internalLinks';
import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import AwardIcon from '@/common/components/icons/award';
import ChatIcon from '@/common/components/icons/chat';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useResponsive from '@/common/hooks/useResponsive';
import { CENTERS } from '@/common/types/centers';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useToolBarController } from '@/modules/profile/hooks/useToolBarController';
import Activity from '@/modules/profile/views/activity/activity';
import Biography from '@/modules/profile/views/biography/biography';
import CentersInfo from '@/modules/profile/views/centersInfo/centersInfo';
import Gallery from '@/modules/profile/views/gallery/gallery';
import Head from '@/modules/profile/views/head/head';
import ProfileSeoBox from '@/modules/profile/views/seoBox/seoBox';
import Services from '@/modules/profile/views/services';
import axios from 'axios';
import config from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { dehydrate, QueryClient } from 'react-query';
import { NextPageWithLayout } from '../_app';

const { publicRuntimeConfig } = config();

interface Props {
  slug: string;
}

const DoctorProfile: NextPageWithLayout<Props> = () => {
  const { query, ...router } = useRouter();
  const slug = query.slug as string;
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });
  const { isMobile, isDesktop } = useResponsive();
  const profile = useGetProfileData(
    { slug },
    {
      keepPreviousData: true,
      refetchOnMount: false,
    },
  );
  const profileData = profile.data?.data;

  const doctorExpertise = getDisplayDoctorExpertise({
    aliasTitle: profileData.expertises[0]?.alias_title,
    degree: profileData.expertises?.[0]?.degree?.name,
    expertise: profileData.expertises?.[0]?.expertise?.name,
  });
  const doctorCity = profileData.centers.find((center: any) => center.id !== '5532')?.city;
  const documentTitle = `${profileData.display_name}، ${doctorExpertise} ${
    doctorCity ? `${doctorCity}،` : ''
  } نوبت دهی آنلاین و شماره تلفن | پذیرش24`;
  const ducmentDescription = `نوبت دهی اینترنتی ${profileData.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

  const isBulk = useMemo(
    () =>
      profileData.centers.every((center: any) => center.status === 2) ||
      profileData.centers.every((center: any) => center.services.every((service: any) => !service.hours_of_work)),
    [profileData],
  );

  const toolBarItems = useToolBarController({ slug, displayName: profileData?.display_name, documentTitle });
  const layout: {
    content: Record<string, ({ doctor }: { doctor: any }) => ReactElement | null>;
    sideBar: Record<string, ({ doctor }: { doctor: any }) => ReactElement | null>;
  } = useMemo(
    () => ({
      content: {
        Services: ({ doctor }) => (
          <div id="services_serction" ref={servicesRef} className="flex flex-col space-y-3 md:hidden">
            <Services className="md:hidden" doctor={doctor} isBulk={isBulk} slug={slug} />
          </div>
        ),
        CenterInfo: ({ doctor }) => (
          <div id="center-info_serction" className="flex flex-col space-y-3 md:hidden">
            <Text fontWeight="bold" className="px-4 md:px-0">
              آدرس و تلفن تماس
            </Text>
            <CentersInfo
              className="bg-white md:rounded-lg"
              centers={profileData.centers
                .filter((center: any) => center.id !== CENTERS.CONSULT)
                .map((center: any) => ({
                  address: center.address,
                  city: center.city,
                  slug: center.center_type === 1 ? `/dr/${slug}` : `/center/${center.slug}`,
                  description: center.description,
                  phoneNumbers: center.display_number_array,
                  name: center.center_type !== 1 ? center.name : `مطب ${doctor?.display_name}`,
                  location: center.map,
                }))}
            />
          </div>
        ),
        OwnPage: ({ doctor }) => {
          if (!isBulk) return null;
          return (
            <div className="flex flex-col p-4 space-y-3 bg-white md:rounded-lg">
              <Text fontWeight="medium">درخواست احراز هویت و دریافت مالکیت صفحه</Text>
              <Button onClick={() => location.assign('https://dr.paziresh24.com/auth/?q=profile')} variant="secondary">
                من {doctor.display_name} هستم
              </Button>
            </div>
          );
        },
        Biography: ({ doctor }) => {
          const { biography, awards, scientific } = doctor;
          if (!biography && !awards && !scientific) return null;
          return (
            <div id="about_serction" className="flex flex-col space-y-3">
              <Text fontWeight="bold" className="px-4 md:px-0">
                درباره پزشک
              </Text>
              <Biography {...{ biography, awards, scientific }} className="bg-white md:rounded-lg" />
            </div>
          );
        },
        Video: ({ doctor: { aparat_video_code } }) => {
          if (!aparat_video_code || aparat_video_code === '0') return null;
          return <div className="overflow-hidden md:rounded-lg" dangerouslySetInnerHTML={{ __html: aparat_video_code }} />;
        },
        Activity: ({ doctor }) => {
          return (
            <div className="flex flex-col space-y-3">
              <Text fontWeight="bold" className="px-4 md:px-0">
                فعالیت ها {doctor.display_name}
              </Text>
              <Activity
                className="bg-white md:rounded-lg"
                items={[
                  doctor.followConsultBoosk && {
                    icon: <ChatIcon className="min-w-fit" />,
                    text: `<b>${doctor.followConsultBoosk}</b> مشاوره فعال`,
                  },
                  {
                    icon: <AwardIcon className="min-w-fit" />,
                    text: `پذیرش24 بیش از ${doctor.insert_at_age} افتخار میزبانی از صفحه اختصاصی ${doctor.display_name} را داشته است.`,
                  },
                ].filter(Boolean)}
              />
            </div>
          );
        },
        Gallery: ({ doctor }) => {
          const items = doctor.centers.find((center: any) => center.center_type === 1)?.gallery;
          const reformmatedItems = items?.map((item: any) => publicRuntimeConfig.CLINIC_BASE_URL + item.image);
          if (!items?.length) return null;
          return (
            <div className="flex flex-col space-y-3">
              <Text fontWeight="bold" className="px-4 md:px-0">
                گالری
              </Text>
              <Gallery items={reformmatedItems} className="bg-white md:rounded-lg" />
            </div>
          );
        },
        ProfileSeoBox: ({ doctor }) => {
          const internalLinks = useInternalLinks(
            { links: getSearchLinks({ ...doctor }) },
            {
              keepPreviousData: true,
              refetchOnMount: false,
            },
          );
          return (
            <ProfileSeoBox
              similarLinks={doctor.similar_links?.map((item: any) => ({ name: item.caption, url: item.link }))}
              about={`این صفحه به عنوان وب سایت نوبت دهی اینترنتی ${
                doctor.display_name
              } جهت مشاهده خدمات و دریافت نوبت آنلاین مطب شخصی، کلینیک، درمانگاه و بیمارستان هایی که ایشان در حال ارائه خدمات درمانی هستند از طریق پذیرش24 طراحی و ارائه شده است. البته ممکن است در حال حاضر امکان رزرو نوبت از همه مراکز فوق ممکن نباشد که این موضوع وابسته به تصمیم ${
                doctor.gender === 0 ? '' : doctor.gender == 1 ? 'آقای' : 'خانم'
              } دکتر در ارائه نوبت گیری از درگاه های فوق بوده است.`}
              breadcrumbs={createBreadcrumb(internalLinks.data, doctor.display_name, router.asPath)}
            />
          );
        },
      },
      sideBar: {
        Services: ({ doctor }) => {
          if (!isDesktop) return null;
          return <Services doctor={doctor} isBulk={isBulk} slug={slug} />;
        },
        CenterInfo: ({ doctor }) => (
          <div className="flex-col hidden space-y-3 md:flex">
            <Text fontWeight="bold" className="px-4 md:px-0">
              آدرس و تلفن تماس
            </Text>
            <CentersInfo
              className="bg-white md:rounded-lg"
              centers={profileData.centers
                .filter((center: any) => center.id !== CENTERS.CONSULT)
                .map((center: any) => ({
                  address: center.address,
                  city: center.city,
                  slug: center.center_type === 1 ? `/dr/${slug}` : `/center/${center.slug}`,
                  description: center.description,
                  phoneNumbers: center.display_number_array,
                  name: center.center_type !== 1 ? center.name : `مطب ${doctor?.display_name}`,
                  location: center.map,
                }))}
            />
          </div>
        ),
      },
    }),
    [isDesktop, isMobile, profileData],
  );

  return (
    <>
      <Seo title={documentTitle} description={ducmentDescription} canonicalUrl={publicRuntimeConfig.CLINIC_BASE_URL + router.pathname} />
      <div className="flex flex-col items-start max-w-screen-xl mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="flex flex-col w-full space-y-3 md:basis-7/12">
          <Head
            pageViewCount={profileData?.number_of_visits}
            displayName={profileData?.display_name}
            image={publicRuntimeConfig.CLINIC_BASE_URL + profileData?.image}
            title={profileData?.experience ? `${profileData?.experience} سال تجربه` : undefined}
            subTitle={`شماره نظام پزشکی: ${profileData?.medical_code}`}
            serviceList={profileData?.expertises?.map(({ alias_title, degree, expertise }: any) =>
              getDisplayDoctorExpertise({
                aliasTitle: alias_title,
                degree: degree.name,
                expertise: expertise.name,
              }),
            )}
            toolBarItems={toolBarItems}
            className="w-full shadow-card md:rounded-lg"
          />
          <nav className="md:hidden p-4 px-6 shadow-card border-t border-slate-100 sticky top-0 z-50 !mt-0 bg-white flex justify-between">
            <div onClick={() => scrollIntoViewWithOffset('#services_serction', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                دریافت نوبت
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#center-info_serction', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                آدرس و تلفن
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#about_serction', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                درباره پزشک
              </Text>
            </div>
            <div onClick={() => scrollIntoViewWithOffset('#reviews_serction', 90)}>
              <Text fontSize="sm" fontWeight="medium">
                نظرات
              </Text>
            </div>
          </nav>
          {Object.entries(layout.content).map(([key, Component]) => (
            <Component key={key} doctor={profileData} />
          ))}
        </div>

        <div className="flex flex-col w-full space-y-3 overflow-hidden md:basis-5/12">
          {Object.entries(layout.sideBar).map(([key, Component]) => (
            <Component key={key} doctor={profileData} />
          ))}
        </div>
        {isMobile && !inViewServices && (
          <div className="fixed z-50 w-full p-3 bg-white border-t bottom-16 shadow-card border-slate-100">
            <Button onClick={() => scrollIntoViewWithOffset('#services_serction', 90)} block>
              دریافت نوبت
            </Button>
          </div>
        )}
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

const getSearchLinks = ({ centers, group_expertises }: any) => {
  const center = centers.find((center: any) => center.city && center.id !== '5532');
  const gexp = group_expertises[0];
  return ['/s/', ...(center?.city ? [`/s/${center.city_en_slug}/`, `/s/${center.city_en_slug}/${gexp.en_slug}/`] : [])];
};

const createBreadcrumb = (links: { orginalLink: string; title: string }[], displayName: string, currentPathName: string) => {
  const reformmatedBreadcrumb = links.map(link => ({ href: link.orginalLink, text: link.title }));

  reformmatedBreadcrumb.unshift({
    href: '/',
    text: 'پذیرش۲۴',
  });

  reformmatedBreadcrumb.push({
    href: currentPathName,
    text: displayName,
  });

  return reformmatedBreadcrumb;
};

DoctorProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} {...page.props.config}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { slug, ...query } = context.query;

  const slugFormmated = decodeURIComponent(slug as string);
  try {
    const queryClient = new QueryClient();
    const { data, redirect } = await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.DoctorFullProfile,
        {
          slug: slugFormmated,
        },
      ],
      () =>
        getProfileData({
          slug: slugFormmated,
        }),
    );

    if (redirect) {
      return {
        redirect: {
          statusCode: redirect.statusCode,
          destination: encodeURI(redirect.route),
        },
      };
    }

    const links = getSearchLinks({ centers: data.centers, group_expertises: data.group_expertises });

    await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.InternalLinks,
        {
          links,
        },
      ],
      () =>
        internalLinks({
          links,
        }),
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

export default DoctorProfile;
