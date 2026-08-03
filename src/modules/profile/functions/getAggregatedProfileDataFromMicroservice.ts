import { apiGatewayClient, hamdastClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorCenterServices } from '@/common/apis/services/doctor/getDoctorCenterServices';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { samanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { getProfileMicroserviceBundle } from '@/common/apis/services/profile-microservice/getProfileMicroserviceBundle';
import { mapMicroserviceToLegacy } from '@/common/apis/services/profile-microservice/mapMicroserviceToLegacy';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { CENTERS } from '@/common/types/centers';
import { isInvalidProfileServiceId, mapDoctorCenterServices } from '@/modules/booking/functions/mapDoctorCenterServices';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { formatDoctorCitiesForTitle } from './getDoctorCities';
import { getProfile } from './getProfileData';
import { getRateDetailsData } from './getRateDetailsData';
import { overwriteProfileData } from './overwriteProfileData';

const HAMDAST_WIDGETS = '/api/v1/widgets/';

const createBreadcrumb = (links: { orginalLink: string; title: string }[], displayName: string, currentPathName: string) => {
  const reformattedBreadcrumb = links?.map(link => ({ href: link.orginalLink, text: link.title })) ?? [];
  reformattedBreadcrumb.unshift({ href: '/', text: 'پذیرش۲۴' });
  reformattedBreadcrumb.push({ href: currentPathName, text: displayName });
  return reformattedBreadcrumb;
};

const fetchWidgetsData = async (information: any, userData: any): Promise<{ widgets: any[]; widgetsData: any }> => {
  try {
    if (!userData?.user_id) return { widgets: [], widgetsData: {} };

    const { data: widgets } = await hamdastClient.get(HAMDAST_WIDGETS, {
      params: { user_id: userData.user_id },
      timeout: 3000,
    });

    if (!widgets || widgets.length === 0) return { widgets: [], widgetsData: {} };

    const dataEndpoints = widgets.filter((item: any) => item.data_endpoint);
    const responses = await Promise.allSettled(
      dataEndpoints.map((item: any) =>
        apiGatewayClient.get(item.data_endpoint, {
          params: { user_id: userData.user_id, doctor_id: information?.id, widget_id: item?.id },
          timeout: 1500,
        }),
      ),
    );

    const widgetsData = responses.reduce((acc: any, current) => {
      if (current.status === 'fulfilled') {
        const widgetId = current.value?.config?.params?.widget_id;
        if (widgetId) {
          acc[widgetId] = current.value.data;
        }
      }
      return acc;
    }, {});

    const activeWidgets = widgets.filter((item: any) => (item.data_endpoint ? !isEmpty(widgetsData[item.id]) : true));
    return { widgets: activeWidgets, widgetsData };
  } catch (error) {
    console.error('Error fetching widgets data (microservice path):', error);
    return { widgets: [], widgetsData: {} };
  }
};

/**
 * Hybrid aggregation for allowlisted slugs:
 * - Identity/content (name, bio, gallery, SEO, …) from PROFILE_API_BASE_URL
 * - Centers / services / booking from legacy full-profile + centers API + Saman
 *   (profiles-api locations do not yet carry bookable service/freeturn parity)
 */
export async function getAggregatedProfileDataFromMicroservice(
  slug: string,
  university: string | undefined,
  isServer: boolean,
  options?: { prefetchSamanAvailability?: boolean },
) {
  const queryClient = new QueryClient();
  const bundle = await getProfileMicroserviceBundle(slug);

  if ('error' in bundle) {
    if (isServer && bundle.status === 404) return { notFound: true };
    const err = new Error(bundle.error) as Error & { status?: number };
    err.status = bundle.status;
    throw err;
  }

  const { slugInfo, fullProfileLike, overwrite, seo, displayName: mappedDisplayName } = mapMicroserviceToLegacy(bundle);
  const validatedSlug = slugInfo.slug || slug;
  const pageSlug = `/dr/${validatedSlug}`;

  const rateDetailsResult = await getRateDetailsData({ slug: validatedSlug }).catch(() => null);
  const shouldFetchReviews = !!rateDetailsResult && !rateDetailsResult.hide_rates;

  const samanAvailabilityPromise =
    isServer && options?.prefetchSamanAvailability
      ? queryClient
          .fetchQuery([ServerStateKeysEnum.SamanDoctorAvailabilityStatus, validatedSlug], () =>
            samanDoctorAvailabilityStatus(validatedSlug),
          )
          .catch(error => {
            console.error('Error prefetching Saman availability (microservice path):', error);
            return null;
          })
      : Promise.resolve(null);

  const [reviewsResult, averageWaitingTimeResult, doctorCentersResult, legacyProfileResult] = await Promise.all([
    shouldFetchReviews
      ? queryClient
          .fetchQuery([ServerStateKeysEnum.Feedbacks, { slug: validatedSlug, sort: 'default_order' }], () =>
            getReviews({ slug: validatedSlug, sort: 'default_order' }),
          )
          .then(value => ({ status: 'fulfilled' as const, value }))
          .catch(reason => ({ status: 'rejected' as const, reason }))
      : Promise.resolve({ status: 'fulfilled' as const, value: null }),
    getAverageWaitingTime({ slug: validatedSlug })
      .then(value => ({ status: 'fulfilled' as const, value }))
      .catch(reason => ({ status: 'rejected' as const, reason })),
    getDoctorCenters(validatedSlug, university)
      .then(value => ({ status: 'fulfilled' as const, value }))
      .catch(reason => {
        console.error('Error fetching legacy centers for microservice booking hydrate:', reason);
        return { status: 'rejected' as const, reason };
      }),
    getProfile({ slug: validatedSlug, university, isServer })
      .then(value => ({ status: 'fulfilled' as const, value }))
      .catch(reason => {
        console.error('Error fetching legacy full-profile for microservice booking hydrate:', reason);
        return { status: 'rejected' as const, reason };
      }),
  ]);

  await samanAvailabilityPromise;

  const legacyCenters =
    legacyProfileResult.status === 'fulfilled' ? legacyProfileResult.value?.fullProfileData?.centers : null;
  const doctorCenters =
    doctorCentersResult.status === 'fulfilled' && Array.isArray(doctorCentersResult.value) ? doctorCentersResult.value : null;

  // Services/freeturn live on legacy full-profile centers; bookable filter from centers API.
  if (Array.isArray(legacyCenters) && legacyCenters.length > 0) {
    fullProfileLike.centers = legacyCenters;
  }
  if (doctorCenters && doctorCenters.length > 0) {
    overwrite.centers = doctorCenters as any;
  } else if (Array.isArray(legacyCenters) && legacyCenters.length > 0) {
    overwrite.centers = legacyCenters;
  }

  overwrite.feedbacks = {
    averageRates: rateDetailsResult?.averageRates ?? overwrite.feedbacks.averageRates,
    countOfFeedbacks: rateDetailsResult?.countOfFeedbacks ?? overwrite.feedbacks.countOfFeedbacks ?? undefined,
    satisfactionPercent: overwrite.feedbacks.satisfactionPercent,
    waiting_time_statistics: overwrite.feedbacks.waiting_time_statistics,
    hideRates: rateDetailsResult?.hide_rates,
    reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
    waiting_time_info: averageWaitingTimeResult.status === 'fulfilled' ? (averageWaitingTimeResult.value as any) : [],
  };

  const {
    centers: initialCenters,
    expertises,
    feedbacks,
    history,
    information,
    media,
    onlineVisit,
    similarLinks,
    symptomes,
    waitingTimeInfo,
  } = overwriteProfileData(overwrite, fullProfileLike);

  let centers = initialCenters;
  const consultCenter = centers?.find?.((center: any) => String(center?.id) === CENTERS.CONSULT);
  const needsOnlineServices =
    !!consultCenter &&
    (!(consultCenter.services?.length > 0) || consultCenter.services.some((service: any) => isInvalidProfileServiceId(service?.id)));

  if (needsOnlineServices) {
    try {
      const onlineServices = await getDoctorCenterServices(validatedSlug, CENTERS.CONSULT);
      if (onlineServices?.length) {
        const mapped = mapDoctorCenterServices(onlineServices, consultCenter.user_center_id);
        centers = centers.map((center: any) => (String(center?.id) === CENTERS.CONSULT ? { ...center, services: mapped } : center));
        if (isServer) {
          queryClient.setQueryData([ServerStateKeysEnum.DoctorCenterServices, validatedSlug, CENTERS.CONSULT], onlineServices);
        }
      }
    } catch (error) {
      console.error('Error hydrating online visit center services (microservice path):', error);
    }
  }

  const doctorCityNames = formatDoctorCitiesForTitle(centers);
  const displayName = information?.display_name || mappedDisplayName || validatedSlug;
  const seoTitleHint = seo?.title_hint;
  const seoDescriptionHint = seo?.description_hint;

  let hamdastWidgets: any[] = [];
  let hamdastWidgetsData: any = {};
  if (!university) {
    const widgetsResult = await fetchWidgetsData(information, {
      user_id: slugInfo.user_id,
    });
    hamdastWidgets = widgetsResult.widgets;
    hamdastWidgetsData = widgetsResult.widgetsData;
  }

  const breadcrumbs = createBreadcrumb([], displayName, pageSlug);

  const title =
    seoTitleHint ||
    `${displayName}${expertises?.expertises?.[0]?.alias_title ? `، ${expertises.expertises[0].alias_title}` : ''}${
      doctorCityNames ? ` ${doctorCityNames}` : ''
    } نوبت دهی آنلاین و شماره تلفن`;
  const description =
    seoDescriptionHint ||
    `نوبت دهی اینترنتی ${displayName}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

  return {
    props: {
      slug: validatedSlug,
      title: university ? displayName : title,
      description: university ? '' : description,
      information: {
        ...information,
        user_id: information?.user_id ?? slugInfo.user_id ?? null,
      },
      centers,
      expertises,
      feedbacks: {
        ...feedbacks,
        feedbacks: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      },
      history,
      media,
      onlineVisit,
      similarLinks: similarLinks ?? [],
      symptomes: symptomes ?? [],
      waitingTimeInfo: waitingTimeInfo ?? [],
      breadcrumbs,
      isBulk: !!(
        centers?.every?.((c: any) => c.status === 2) || centers?.every?.((c: any) => c.services?.every?.((s: any) => !s.hours_of_work))
      ),
      fragmentComponents: {
        raviComponentTopOrderProfile: false,
        risman: null,
      },
      hamdastWidgets,
      hamdastWidgetsData,
      user_id: information?.user_id ?? slugInfo.user_id ?? null,
      shouldFetchOnClient: false,
      useSamanAvailabilityStatus: !!options?.prefetchSamanAvailability,
      profile_backend: 'microservice',
      profile_type: slugInfo.type,
      doctor_city_names: doctorCityNames,
      ...(isServer ? { dehydratedState: dehydrate(queryClient) } : {}),
      status: 200,
    },
  };
}
