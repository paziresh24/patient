import { getFeedbacks } from '@/apis/services/rate/getFeedbacks';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getProfileData, useGetProfileData } from '@/common/apis/services/profile/getFullProfile';
import { internalLinks, useInternalLinks } from '@/common/apis/services/profile/internalLinks';
import Button from '@/common/components/atom/button/button';
import Text from '@/common/components/atom/text/text';
import AwardIcon from '@/common/components/icons/award';
import ChatIcon from '@/common/components/icons/chat';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import useCustomize from '@/common/hooks/useCustomize';
import useResponsive from '@/common/hooks/useResponsive';
import useWebView from '@/common/hooks/useWebView';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { ToolBarItems } from '@/modules/profile/components/head/toolBar';
import { pageViewEvent } from '@/modules/profile/events/pageView';
import { useToolBarController } from '@/modules/profile/hooks/useToolBarController';
import Activity from '@/modules/profile/views/activity/activity';
import Biography from '@/modules/profile/views/biography/biography';
import CentersInfo from '@/modules/profile/views/centersInfo/centersInfo';
import Gallery from '@/modules/profile/views/gallery/gallery';
import Head from '@/modules/profile/views/head/head';
import RateReview from '@/modules/profile/views/rateReview/rateReview';
import ProfileSeoBox from '@/modules/profile/views/seoBox/seoBox';
import Services from '@/modules/profile/views/services';
import axios from 'axios';
import config from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { dehydrate, QueryClient } from 'react-query';
import { NextPageWithLayout } from '../_app';

const { publicRuntimeConfig } = config();

interface Props {
  slug: string;
}

const DoctorProfile: NextPageWithLayout<Props> = ({ query: { university } }: any) => {
  const { query, ...router } = useRouter();
  const { customize } = useCustomize();
  const slug = query.slug as string;
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });
  const { isMobile, isDesktop } = useResponsive();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userInfo = useUserInfoStore(state => state.info);
  const isWebView = useWebView();

  const profile = useGetProfileData(
    { slug, ...(university && { university }) },
    {
      keepPreviousData: true,
    },
  );
  const profileData = profile.data?.data;

  useEffect(() => {
    if (profileData) {
      pageViewEvent({
        doctor: profileData,
        isWebView: !!isWebView,
      });
    }
  }, [profileData]);
  console.log(profileData);

  const doctorExpertise = getDisplayDoctorExpertise({
    aliasTitle: profileData?.expertises?.[0]?.alias_title,
    degree: profileData?.expertises?.[0]?.degree?.name,
    expertise: profileData?.expertises?.[0]?.expertise?.name,
  });
  const doctorCity = profileData?.centers?.find((center: any) => center.id !== '5532')?.city;
  const documentTitle = `${profileData?.display_name}، ${doctorExpertise} ${
    doctorCity ? `${doctorCity}،` : ''
  } نوبت دهی آنلاین و شماره تلفن | پذیرش24`;
  const ducmentDescription = `نوبت دهی اینترنتی ${profileData?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

  const isBulk = useMemo(
    () =>
      profileData?.centers?.every((center: any) => center.status === 2) ||
      profileData?.centers?.every((center: any) => center.services.every((service: any) => !service.hours_of_work)),
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
        CenterInfo: ({ doctor }) => {
          if (doctor.centers?.length === 0) return null;
          return (
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
                    phoneNumbers: center?.display_number_array,
                    name: center.center_type !== 1 ? center.name : `مطب ${doctor?.display_name}`,
                    location: center.map,
                  }))}
              />
            </div>
          );
        },
        OwnPage: ({ doctor }) => {
          if (!isBulk) return null;
          return (
            <div className="flex flex-col p-4 space-y-3 bg-white md:rounded-lg">
              <Text fontWeight="medium">درخواست احراز هویت و دریافت مالکیت صفحه</Text>
              <Button
                onClick={() => {
                  splunkInstance().sendEvent({
                    group: 'register',
                    type: 'doctor-profile',
                    event: {
                      action: 'click',
                      current_url: location.href,
                      phone_number: isLogin ? userInfo.cell : null,
                    },
                  });
                  location.assign('https://dr.paziresh24.com/auth/?q=profile');
                }}
                variant="secondary"
              >
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
          if (!customize.showActivityProfile) return null;
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
          if (!customize.showGalleryProfile) return null;
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
        RateReview: ({ doctor }) => {
          if (!customize.showRateAndReviews) return null;

          const doctorInfo = {
            center: doctor.centers
              .filter((center: any) => center.id !== '5532')
              .map((center: any) => center && { id: center.id, name: center.name }),
            id: doctor.id,
            name: doctor.display_name,
            image: doctor.image,
            group_expertises: doctor.group_expertises[0].name ?? 'سایر',
            group_expertises_slug: doctor.group_expertises[0].en_slug ?? 'other',
            expertise: doctor?.expertises?.[0]?.expertise?.name,
            slug: doctor.slug,
            city: doctor.centers.map((center: any) => center.city),
          };
          const doctorRateDetails = {
            satisfaction: doctor.feedbacks.details.satisfaction,
            count: doctor.feedbacks.details.number_of_feedbacks,
            information: [
              {
                id: 1,
                title: 'برخورد مناسب پزشک',
                satisfaction: doctor.feedbacks.details.doctor_encounter * 20,
                avg_star: doctor.feedbacks.details.doctor_encounter,
              },
              {
                id: 2,
                title: 'توضیح پزشک در هنگام ویزیت',
                satisfaction: doctor.feedbacks.details.explanation_of_issue * 20,
                avg_star: doctor.feedbacks.details.explanation_of_issue,
              },
              {
                id: 3,
                title: 'مهارت و تخصص پزشک',
                satisfaction: doctor.feedbacks.details.quality_of_treatment * 20,
                avg_star: doctor.feedbacks.details.quality_of_treatment,
              },
            ],
          };
          return (
            <div id="reviews_serction" className="flex flex-col space-y-3">
              <Text fontWeight="bold" className="px-4 md:px-0">
                نظرات در مورد {doctor.display_name}
              </Text>
              <RateReview doctor={doctorInfo} serverId={doctor.server_id} rateDetails={doctorRateDetails} className="md:rounded-lg" />
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
          if (!customize.showSeoBoxs) return null;
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
        CenterInfo: ({ doctor }) => {
          if (doctor.centers?.length === 0) return null;
          return (
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
                    phoneNumbers: center?.display_number_array,
                    name: center.center_type !== 1 ? center.name : `مطب ${doctor?.display_name}`,
                    location: center.map,
                  }))}
              />
            </div>
          );
        },
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
            toolBarItems={toolBarItems as ToolBarItems}
            className="w-full shadow-card md:rounded-lg"
            satisfaction={customize.showRateAndReviews && profileData.feedbacks?.details?.satisfaction}
            rateCount={profileData.feedbacks?.details?.number_of_feedbacks}
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
          {profileData && Object.entries(layout.content).map(([key, Component]) => <Component key={key} doctor={profileData} />)}
        </div>

        <div className="flex flex-col w-full space-y-3 overflow-hidden md:basis-5/12">
          {profileData && Object.entries(layout.sideBar).map(([key, Component]) => <Component key={key} doctor={profileData} />)}
        </div>
        {isMobile && !inViewServices && (
          <div className="fixed z-50 w-full p-3 bg-white border-t bottom-16 shadow-card border-slate-100">
            <Button onClick={() => scrollIntoViewWithOffset('#services_serction', 90)} block>
              دریافت نوبت
            </Button>
          </div>
        )}
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
    <LayoutWithHeaderAndFooter showSearchSuggestionButton={true} shouldShowPromoteApp={false} {...page.props.config}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { slug, ...query } = context.query;
  const university = query.university as string;

  const slugFormmated = decodeURIComponent(slug as string);
  try {
    const queryClient = new QueryClient();
    const { data, redirect } = await queryClient.fetchQuery(
      [
        ServerStateKeysEnum.DoctorFullProfile,
        {
          slug: slugFormmated,
          ...(university && { university }),
        },
      ],
      () =>
        getProfileData({
          slug: slugFormmated,
          ...(university && { university }),
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

    try {
      await queryClient.fetchQuery(
        [
          ServerStateKeysEnum.Feedbacks,
          {
            doctor_id: data.id,
            server_id: data.server_id,
          },
        ],
        () =>
          getFeedbacks({
            doctor_id: data.id,
            server_id: data.server_id,
          }),
      );
    } catch (error) {
      console.log(error);
    }

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
