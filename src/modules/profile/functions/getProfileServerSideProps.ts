import { getFeedbacks } from '@/apis/services/rate/getFeedbacks';
import { getReview } from '@/apis/services/rate2/getFedbacks';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { CENTERS } from '@/common/types/centers';
import { GrowthBook } from '@growthbook/growthbook-react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getProfile } from './getProfileData';
import { getProviderData } from './getProviderData';
import { getSpecialitiesData } from './getSpecialities';
import { getUserData } from './getUserData';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';

const getSearchLinks = ({ centers, group_expertises }: any) => {
  const center = centers.find((center: any) => center.city && center.id !== '5532');
  const gexp = group_expertises[0];
  return ['/s/', ...(center?.city ? [`/s/${center.city_en_slug}/`, `/s/${center.city_en_slug}/${gexp.en_slug}/`] : [])];
};

const createBreadcrumb = (links: { orginalLink: string; title: string }[], displayName: string, currentPathName: string) => {
  const reformmatedBreadcrumb = links?.map(link => ({ href: link.orginalLink, text: link.title })) ?? [];

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

export const getProfileServerSideProps = withServerUtils(async (context: GetServerSidePropsContext) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  const isCSR = context.req.url?.startsWith?.('/_next');
  const isVisitOnlineCenterType = context.query.centerTarget === CENTERS.CONSULT;

  const { slug, ...query } = context.query;
  const university = query.university as string;

  const slugFormmated = decodeURIComponent(slug as string);
  const pageSlug = `/dr/${slugFormmated}`;

  try {
    const queryClient = new QueryClient();
    const { redirect, fullProfileData } = await getProfile({ slug: slugFormmated, university });
    if (redirect) {
      return {
        redirect: {
          statusCode: redirect.statusCode,
          destination: encodeURI(redirect.route),
        },
      };
    }

    let shouldUseProvider: boolean = false;
    let shouldUseUser: boolean = false;
    let shouldUseExpertice: boolean = false;
    let shouldUseFeedback: boolean = false;
    try {
      const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
      const growthbook = new GrowthBook(growthbookContext);
      await growthbook.loadFeatures({ timeout: 1000 });

      // Providers Api
      const providersApiDoctorList = growthbook.getFeatureValue('profile:providers-api|doctor-list', { slugs: [''] });
      const providersApiDoctorCitiesList = growthbook.getFeatureValue('profile:providers-api|cities', { cities: [''] });
      shouldUseProvider =
        newApiFeatureFlaggingCondition(providersApiDoctorList.slugs, slugFormmated) ||
        fullProfileData.centers.some(
          (center: any) => center.center_type === 1 && providersApiDoctorCitiesList.cities?.includes(center.city_en_slug),
        ) ||
        providersApiDoctorCitiesList.cities?.includes('*');

      // Users APi
      const usersApiDoctorList = growthbook.getFeatureValue('profile:users-api|doctor-list', { slugs: [''] });
      const usersApiDoctorCitiesList = growthbook.getFeatureValue('profile:users-api|cities', { cities: [''] });
      shouldUseUser =
        newApiFeatureFlaggingCondition(usersApiDoctorList.slugs, slugFormmated) ||
        fullProfileData.centers.some(
          (center: any) => center.center_type === 1 && usersApiDoctorCitiesList.cities?.includes(center.city_en_slug),
        ) ||
        usersApiDoctorCitiesList.cities?.includes('*');

      //Expertice Api
      const experticeApiDoctorList = growthbook.getFeatureValue('profile:expertises-api|doctor-list', { slugs: [''] });
      const experticeApiCitiesList = growthbook.getFeatureValue('profile:expertises-api|cities', { cities: [''] });
      shouldUseExpertice =
        newApiFeatureFlaggingCondition(experticeApiDoctorList.slugs, slugFormmated) ||
        fullProfileData.centers.some(
          (center: any) => center.center_type === 1 && experticeApiCitiesList.cities?.includes(center.city_en_slug),
        ) ||
        experticeApiCitiesList.cities?.includes('*');

      //Feedback Api
      const feedbackApiDoctorList = growthbook.getFeatureValue('profile:feedback_api', { slug: [''] });
      shouldUseFeedback = newApiFeatureFlaggingCondition(feedbackApiDoctorList.slug, slugFormmated);
    } catch (error) {
      console.error(error);
    }

    const { id, server_id } = fullProfileData;
    let profileData: OverwriteProfileData = {
      provider: {
        display_name: fullProfileData.display_name ?? '',
        biography: fullProfileData.biography ?? '',
        employee_id: fullProfileData.medical_code ?? '',
      },
    };

    if (shouldUseProvider) {
      try {
        const parallelRequests = [await getProviderData({ slug: slugFormmated })];

        const [providerData] = await Promise.allSettled(parallelRequests);

        if (providerData.status === 'fulfilled' && providerData.value?.user_id) {
          profileData.provider = {
            ...profileData.provider,
            provider_id: providerData.value.id,
            user_id: providerData.value.user_id,
            biography: providerData.value.biography,
            employee_id: providerData.value.employee_id,
            prefix: providerData.value?.prefix,
          };

          if (shouldUseExpertice) {
            const parallelRequests = [await getSpecialitiesData({ provider_id: providerData.value.id })];
            const [specialitiesData] = await Promise.allSettled(parallelRequests);

            if (specialitiesData.status === 'fulfilled') {
              profileData.provider = {
                ...profileData.provider,
                expertises: Object.values(specialitiesData.value),
              };
            }
          }

          if (shouldUseUser) {
            const parallelRequests = [await getUserData({ user_id: providerData.value?.user_id, slug: slugFormmated })];
            const [userData] = await Promise.allSettled(parallelRequests);

            if (userData.status === 'fulfilled' && userData.value?.name) {
              profileData.provider = {
                ...profileData.provider,
                name: userData.value?.name,
                family: userData.value?.family,
                display_name: `${providerData.value?.prefix} ${userData.value?.name} ${userData.value?.family}`,
              };
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    const { centers, expertises, feedbacks, history, information, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo } =
      overwriteProfileData(profileData, fullProfileData);

    const links = getSearchLinks({ centers, group_expertises: expertises.group_expertises });

    const internalLinksData = await internalLinks({
      links,
    }).catch(error => console.error(error));

    let feedbackDataWithoutPagination;

    try {
      const feedbackData = shouldUseFeedback
        ? await queryClient.fetchQuery(
            [
              ServerStateKeysEnum.DoctorRewiew,
              {
                external_id: `doctor_${fullProfileData.id}_1`,
              },
            ],
            () =>
              getReview({
                external_id: `doctor_${fullProfileData.id}_1`,
              }),
          )
        : await queryClient.fetchQuery(
            [
              ServerStateKeysEnum.Feedbacks,
              {
                doctor_id: id,
                server_id: server_id,
              },
            ],
            () =>
              getFeedbacks({
                doctor_id: id,
                server_id: server_id,
              }),
          );

      if (!isCSR)
        feedbackDataWithoutPagination = await queryClient.fetchQuery(
          [
            ServerStateKeysEnum.Feedbacks,
            {
              doctor_id: id,
              server_id: server_id,
              no_page_limit: true,
            },
          ],
          () =>
            getFeedbacks({
              doctor_id: id,
              server_id: server_id,
              no_page_limit: true,
            }),
        );

      feedbacks.feedbacks = shouldUseFeedback ? feedbackData?.feedbacks : feedbackData?.result ?? [];
    } catch (error) {
      console.error(error);
    }

    const doctorCity = centers?.find((center: any) => center.id !== '5532')?.city;

    const title = `${information?.display_name}، ${expertises.expertises[0].alias_title} ${
      doctorCity ? `${doctorCity}،` : ''
    } نوبت دهی آنلاین و شماره تلفن`;
    const description = `نوبت دهی اینترنتی ${information?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

    return {
      props: {
        title: university ? information?.display_name : title,
        description: university ? '' : description,
        information,
        centers: centers.filter((center: any) => (isVisitOnlineCenterType ? center.id === CENTERS.CONSULT : true)),
        expertises,
        feedbacks,
        dehydratedState: dehydrate(queryClient),
        media,
        symptomes,
        history,
        onlineVisit,
        similarLinks,
        waitingTimeInfo,
        isBulk:
          centers.every((center: any) => center.status === 2) ||
          centers.every((center: any) => center.services.every((service: any) => !service.hours_of_work)),
        breadcrumbs: createBreadcrumb(internalLinksData, information?.display_name, pageSlug),
        slug: slugFormmated,
        feedbackDataWithoutPagination: feedbackDataWithoutPagination?.result ?? [],
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
