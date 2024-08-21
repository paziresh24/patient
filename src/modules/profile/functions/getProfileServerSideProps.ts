import { getFeedbacks } from '@/apis/services/rate/getFeedbacks';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { newApiFeatureFlaggingCondition } from '@/common/helper/newApiFeatureFlaggingCondition';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { CENTERS } from '@/common/types/centers';
import { GrowthBook } from '@growthbook/growthbook-react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import moment from 'jalali-moment';
import isEmpty from 'lodash/isEmpty';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { getProfile } from './getProfileData';
import { getProviderData } from './getProviderData';
import { getRateDetailsData } from './getRateDetailsData';
import { getSpecialitiesData } from './getSpecialities';
import { getUserData } from './getUserData';
import { getWaitingTimeStatistics } from './getWaitingTimeStatistics';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';
import { getReviews } from '@/common/apis/services/reviews/getReviews';

const getSearchLinks = ({ centers, group_expertises }: any) => {
  const center = centers?.find?.((center: any) => center.city && center.id !== '5532');
  const gexp = group_expertises[0];
  return ['/s/', ...(center?.city ? [`/s/${center?.city_en_slug}/`, `/s/${center?.city_en_slug}/${gexp?.en_slug}/`] : [])];
};

const createBreadcrumb = (
  links: {
    orginalLink: string;
    title: string;
  }[],
  displayName: string,
  currentPathName: string,
) => {
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

function formatDurationInMonths(date: string) {
  const months = moment().diff(date, 'months') / 12;
  const years = moment().diff(date, 'years');

  if (years <= 1 && months <= 1) return '1 ماه';
  if (years <= 1 && months < 12) return `${Math.floor(months)} ماه`;

  return formatResult(Math.floor(years), Math.floor(months));
}

function formatResult(years: number, months: number) {
  const yearText = `${years} سال`;
  const monthText = months ? ` و ${months} ماه` : '';
  return `${yearText}${monthText}`;
}

export const getProfileServerSideProps = withServerUtils(async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
  const isCSR = context.req.url?.startsWith?.('/_next');
  const isVisitOnlineCenterType = context.query.centerTarget === CENTERS.CONSULT;

  const { slug, ...query } = context.query;
  const university = themeConfing?.partnerKey as string;

  const slugFormmated = decodeURIComponent(slug as string);
  const pageSlug = `/dr/${slugFormmated}`;

  try {
    const queryClient = new QueryClient();
    let fullProfileData;
    try {
      const { redirect, fullProfileData: data } = await getProfile({ slug: slugFormmated, university });
      fullProfileData = data;
      if (redirect) {
        return {
          redirect: {
            statusCode: redirect.statusCode,
            destination: encodeURI(redirect.route),
          },
        };
      }
    } catch (error) {
      console.error('full-profile-error', error);
    }

    let shouldUseProvider: boolean = false;
    let shouldUseUser: boolean = false;
    let shouldUseExpertice: boolean = false;
    let shouldUseCreatedAt: boolean = false;
    let shouldUseFeedback: boolean = false;
    let shouldUseAverageWaitingTime: boolean = false;
    let shouldUseWaitingTimeStatistics: boolean = false;
    let shouldUsePageView: boolean = false;
    let shouldUseNewRateCalculations: boolean = false;
    let shouldUsePlasmicReviewCard: boolean = false;
    let getOnlyHasuraProfileData: boolean = false;

    try {
      const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
      const growthbook = new GrowthBook(growthbookContext);
      growthbook.setAttributes({ slug: slugFormmated });
      await growthbook.loadFeatures({ timeout: 1000 });

      // Providers Api
      const providersApiDoctorList = growthbook.getFeatureValue('profile:providers-api|doctor-list', { slugs: [''] });
      const providersApiDoctorCitiesList = growthbook.getFeatureValue('profile:providers-api|cities', { cities: [''] });
      shouldUseProvider =
        newApiFeatureFlaggingCondition(providersApiDoctorList.slugs, slugFormmated) ||
        fullProfileData?.centers?.some(
          (center: any) => center.center_type === 1 && providersApiDoctorCitiesList.cities?.includes(center.city_en_slug),
        ) ||
        providersApiDoctorCitiesList.cities?.includes('*');

      // Users APi
      const usersApiDoctorList = growthbook.getFeatureValue('profile:users-api|doctor-list', { slugs: [''] });
      const usersApiDoctorCitiesList = growthbook.getFeatureValue('profile:users-api|cities', { cities: [''] });
      shouldUseUser =
        newApiFeatureFlaggingCondition(usersApiDoctorList.slugs, slugFormmated) ||
        fullProfileData?.centers?.some(
          (center: any) => center.center_type === 1 && usersApiDoctorCitiesList.cities?.includes(center.city_en_slug),
        ) ||
        usersApiDoctorCitiesList.cities?.includes('*');

      // Expertice Api
      const experticeApiDoctorList = growthbook.getFeatureValue('profile:expertises-api|doctor-list', { slugs: [''] });
      const experticeApiCitiesList = growthbook.getFeatureValue('profile:expertises-api|cities', { cities: [''] });
      shouldUseExpertice =
        newApiFeatureFlaggingCondition(experticeApiDoctorList.slugs, slugFormmated) ||
        fullProfileData?.centers?.some(
          (center: any) => center.center_type === 1 && experticeApiCitiesList.cities?.includes(center.city_en_slug),
        ) ||
        experticeApiCitiesList.cities?.includes('*');

      // CreatedAt Api
      const createdAtDoctorList = growthbook.getFeatureValue('profile:created_at-field|doctor-list', { slugs: [''] });
      shouldUseCreatedAt = newApiFeatureFlaggingCondition(createdAtDoctorList.slugs, slugFormmated);

      // Feedback Api
      const feedbackApiDoctorList = growthbook.getFeatureValue('profile:feedback_api', { slug: [''] });
      shouldUseFeedback = newApiFeatureFlaggingCondition(feedbackApiDoctorList.slug, slugFormmated);

      // AverageWaitingTime Api
      shouldUseAverageWaitingTime = growthbook.isOn('average-waiting-time-api');

      // WaitingTimeStatistics Api
      const WaitingTimeStatisticsApiDoctorList = growthbook.getFeatureValue('profile:waiting-time-statistics-api|doctor-details', {
        slugs: [''],
      });
      shouldUseWaitingTimeStatistics = newApiFeatureFlaggingCondition(WaitingTimeStatisticsApiDoctorList.slugs, slugFormmated);

      // Page View Api
      const pageViewDoctorList = growthbook.getFeatureValue('profile:page-view-api|doctor-list', { slugs: [''] });
      shouldUsePageView = newApiFeatureFlaggingCondition(pageViewDoctorList.slugs, slugFormmated);

      // New Rate Calculations
      const newRateCalculationsDoctorList = growthbook.getFeatureValue('profile:new-rate-calculations|slugs-enabled', { slugs: [''] });
      const newRateCalculationsDoctorExpertisesList = growthbook.getFeatureValue('profile:new-rate-calculations|expertises-enabled', {
        expertises: [''],
      });
      shouldUseNewRateCalculations =
        newApiFeatureFlaggingCondition(newRateCalculationsDoctorList.slugs, slugFormmated) ||
        fullProfileData?.group_expertises?.some((group: any) =>
          newApiFeatureFlaggingCondition(newRateCalculationsDoctorExpertisesList.expertises, group.id),
        );
      // Plasmic Reviews Card
      shouldUsePlasmicReviewCard = growthbook.isOn('plasmic:review-card|slugs');
      getOnlyHasuraProfileData = growthbook.isOn('get-only-hasura-profile-data');
    } catch (error) {
      console.error(error);
    }

    let profileData: OverwriteProfileData = {
      history: {},
      feedbacks: {},
      provider: {
        display_name: fullProfileData?.display_name ?? '',
        biography: fullProfileData?.biography ?? '',
        employee_id: fullProfileData?.medical_code ?? '',
        prefix: 'دکتر',
      },
    };

    if (shouldUseProvider || getOnlyHasuraProfileData) {
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
            ...(shouldUseCreatedAt && {
              experience: providerData.value?.field_start_date
                ? Math.ceil(moment().diff(providerData.value?.field_start_date, 'months') / 12).toString()
                : '',
            }),
          };
          profileData.history = {
            ...((shouldUseCreatedAt || getOnlyHasuraProfileData) && {
              insert_at_age: formatDurationInMonths(providerData.value?.created_at),
            }),
            ...((shouldUsePageView || getOnlyHasuraProfileData) && {
              count_of_page_view: providerData.value?.page_view,
            }),
          };

          if (shouldUseExpertice || getOnlyHasuraProfileData) {
            const parallelRequests = [await getSpecialitiesData({ provider_id: providerData.value.id })];
            const [specialitiesData] = await Promise.allSettled(parallelRequests);

            if (specialitiesData.status === 'fulfilled') {
              profileData.provider = {
                ...profileData.provider,
                expertises: Object.values(specialitiesData.value),
              };
            }
          }

          if (shouldUseUser || getOnlyHasuraProfileData) {
            const parallelRequests = [await getUserData({ user_id: providerData.value?.user_id, slug: slugFormmated })];
            const [userData] = await Promise.allSettled(parallelRequests);

            if (userData.status === 'fulfilled' && userData.value?.name) {
              profileData.provider = {
                ...profileData.provider,
                name: userData.value?.name,
                family: userData.value?.family,
                prefix: providerData.value?.prefix ?? 'دکتر',
                display_name: `${userData.value?.name} ${userData.value?.family}`,
              };
            }
          }

          if (shouldUseAverageWaitingTime) {
            const parallelRequests = [
              await getAverageWaitingTime({
                slug: slugFormmated,
              }),
            ];
            const [averageWaitingTimeData] = await Promise.allSettled(parallelRequests);

            if (averageWaitingTimeData.status === 'fulfilled') {
              profileData.feedbacks = {
                ...profileData.feedbacks,
                waiting_time_info: averageWaitingTimeData?.value?.result,
              };
            }
          }

          // waiting statistics
          if (shouldUseWaitingTimeStatistics) {
            const parallelRequests = [
              await getWaitingTimeStatistics({
                slug: slugFormmated,
                start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
                end_date: moment().format('YYYY-MM-DD'),
              }),
            ];
            const [waitingTimeStatisticsData] = await Promise.allSettled(parallelRequests);

            if (waitingTimeStatisticsData.status === 'fulfilled') {
              profileData.feedbacks.waiting_time_statistics = waitingTimeStatisticsData.value?.result || null;
            }
          }
        } else {
          if (getOnlyHasuraProfileData) {
            return {
              notFound: true,
            };
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    const rateDetails = await getRateDetailsData({
      slug: slugFormmated,
      version: shouldUsePlasmicReviewCard ? 2 : 1,
    });
    profileData.feedbacks = {
      ...profileData.feedbacks,
      averageRates: rateDetails?.averageRates,
      countOfFeedbacks: rateDetails?.countOfFeedbacks,
      hideRates: rateDetails?.hide_rates,
      satisfactionPercent: rateDetails?.satisfactionPercent,
    };

    const { centers, expertises, feedbacks, history, information, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo } =
      overwriteProfileData(
        profileData,
        getOnlyHasuraProfileData
          ? {
              online_visit_channel_types: fullProfileData?.online_visit_channel_types,
              consult_active_booking: fullProfileData?.consult_active_booking,
              centers: fullProfileData?.centers,
              followConsultBoosk: fullProfileData?.followConsultBoosk,
              similar_links: fullProfileData?.similar_links,
              server_id: fullProfileData?.server_id,
              should_recommend_other_doctors: fullProfileData?.should_recommend_other_doctors,
              city_en_slug: fullProfileData?.city_en_slug,
            }
          : fullProfileData,
      );

    const links = getSearchLinks({ centers, group_expertises: expertises?.group_expertises ?? [] });

    const internalLinksData = await internalLinks({
      links,
    }).catch(error => console.error(error));

    let dontShowRateAndReviewMessage = '';
    try {
      let feedbackData;

      if (!rateDetails?.hide_rates) {
        feedbackData = await queryClient.fetchQuery(
          [
            ServerStateKeysEnum.Feedbacks,
            {
              slug: slugFormmated,
              sort: 'default_order',
            },
          ],
          () =>
            getReviews({
              slug: slugFormmated,
              sort: 'default_order',
            }),
        );
      }
      feedbacks.feedbacks = feedbackData ?? {};
    } catch (error) {
      console.error(error);
    }

    const doctorCity = centers?.find?.((center: any) => center.id !== '5532')?.city;

    const title = `${information.prefix} ${information?.display_name}، ${expertises?.expertises?.[0]?.alias_title} ${
      doctorCity ? `${doctorCity}،` : ''
    } نوبت دهی آنلاین و شماره تلفن`;
    const description = `نوبت دهی اینترنتی ${information.prefix} ${information.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

    return {
      props: {
        title: university ? information?.display_name : title,
        description: university ? '' : description,
        information,
        centers: centers?.filter?.((center: any) => (isVisitOnlineCenterType ? center.id === CENTERS.CONSULT : true)) ?? [],
        expertises,
        feedbacks,
        dehydratedState: dehydrate(queryClient),
        media,
        symptomes,
        history,
        onlineVisit,
        similarLinks,
        waitingTimeInfo,
        shouldUseIncrementPageView: shouldUsePageView || getOnlyHasuraProfileData,
        isBulk: !!(
          centers?.every?.((center: any) => center.status === 2) ||
          centers?.every?.((center: any) => center.services.every((service: any) => !service.hours_of_work))
        ),
        breadcrumbs: createBreadcrumb(internalLinksData, information?.display_name, pageSlug),
        slug: slugFormmated,
        fragmentComponents: {
          reviewCard: shouldUsePlasmicReviewCard,
        },
        getOnlyHasuraProfileData,
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
