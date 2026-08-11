import axios from 'axios';
import { apiGatewayClient, hamdastClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorCenterServices } from '@/common/apis/services/doctor/getDoctorCenterServices';
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
import { mergeMsLocationsWithLegacyBooking } from './mergeMsLocationsWithLegacyBooking';
import { buildDoctorProfileDocumentTitle } from '@/modules/profile/utils/buildDoctorProfileDocumentTitle';
import { buildRismanDoctorId } from '@/modules/profile/utils/buildRismanDoctorId';
import { fetchDoctorGalleryFromDrprofile } from '@/modules/profile/utils/fetchDoctorGalleryFromDrprofile';
import { drProfileClient } from '@/common/apis/client';

const HAMDAST_WIDGETS = '/api/v1/widgets/';
const RISMAN_DOCTORS = 'https://apigw.paziresh24.com/v1/risman/doctors/';

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
 * - Address/phone in sidebar from profiles-api locations (source of truth)
 * - Services / freeturn / hours from legacy full-profile (matched onto MS locations)
 * - Booking availability from Saman
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
    // Missing/broken in profiles-api → throw so the caller falls back to legacy.
    // Do NOT return { notFound: true } here: allowlisted slugs may exist only on legacy.
    const err = new Error(bundle.error || 'Profile not found in microservice') as Error & { status?: number };
    err.status = bundle.status ?? 404;
    throw err;
  }

  const { slugInfo, fullProfileLike, overwrite, seo, displayName: mappedDisplayName } = mapMicroserviceToLegacy(bundle);
  const validatedSlug = slugInfo.slug || slug;
  const pageSlug = `/dr/${validatedSlug}`;

  // profiles-api gallery URLs (/storage/gallery/...) may 404 on CDN; drprofile has live clinic images.
  try {
    const drprofileGallery = await fetchDoctorGalleryFromDrprofile(validatedSlug, university);
    if (drprofileGallery.length > 0) {
      overwrite.gallery = drprofileGallery;
    }
  } catch (error) {
    console.error('Error hydrating gallery from drprofile (microservice path):', error);
  }

  const rateDetailsResult = await getRateDetailsData({ slug: validatedSlug }).catch(() => null);
  const rismanDoctorId = buildRismanDoctorId(slugInfo.owner_id, slugInfo.server_id);
  const rismanResult = rismanDoctorId
    ? await axios
        .get(RISMAN_DOCTORS, { params: { doctor_id: rismanDoctorId }, timeout: 1500 })
        .then(response => response.data)
        .catch(() => null)
    : null;
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

  const msLocationsAsCenters = Array.isArray(overwrite.centers) ? [...overwrite.centers] : [];

  const [reviewsResult, averageWaitingTimeResult, legacyProfileResult] = await Promise.all([
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
    getProfile({ slug: validatedSlug, university, isServer })
      .then(value => ({ status: 'fulfilled' as const, value }))
      .catch(reason => {
        console.error('Error fetching legacy full-profile for microservice booking hydrate:', reason);
        return { status: 'rejected' as const, reason };
      }),
  ]);

  await samanAvailabilityPromise;

  let legacyCenters =
    legacyProfileResult.status === 'fulfilled' ? legacyProfileResult.value?.fullProfileData?.centers : null;

  // Booking hydrate depends on legacy centers; retry once with a longer timeout if first call failed.
  if (!Array.isArray(legacyCenters) || legacyCenters.length === 0) {
    try {
      const { data } = await drProfileClient.get(`/api/full-profile/${encodeURIComponent(validatedSlug)}/`, {
        params: university ? { university } : undefined,
        timeout: 12000,
      });
      legacyCenters = data?.centers ?? data?.data?.centers ?? null;
    } catch (error) {
      console.error('Retry legacy full-profile for microservice booking hydrate failed:', error);
    }
  }

  // Address/phone from MS locations; services/freeturn from legacy full-profile when matched.
  // Do NOT overwrite address with legacy Centers API — sidebar must show new-backend locations.
  const mergedCenters = mergeMsLocationsWithLegacyBooking(msLocationsAsCenters as any[], legacyCenters);
  if (Array.isArray(legacyCenters) && legacyCenters.length > 0) {
    fullProfileLike.centers = legacyCenters;
  }
  overwrite.centers = mergedCenters as any;

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

  // If merge left bookable centers without services (FP flake), hydrate per-center services API.
  const centersNeedingServices = (centers || []).filter((center: any) => {
    if (!center?.id) return false;
    // Online visit center: always refresh from drprofile (full-profile service ids can be stale).
    if (String(center.id) === CENTERS.CONSULT) return true;
    return (
      !(center.services?.length > 0) || center.services.some((service: any) => isInvalidProfileServiceId(service?.id))
    );
  });
  if (centersNeedingServices.length > 0) {
    try {
      const serviceResults = await Promise.allSettled(
        centersNeedingServices.map((center: any) => getDoctorCenterServices(validatedSlug, String(center.id))),
      );
      centers = centers.map((center: any) => {
        const idx = centersNeedingServices.findIndex((c: any) => String(c.id) === String(center.id));
        if (idx < 0) return center;
        const result = serviceResults[idx];
        if (result.status !== 'fulfilled' || !result.value?.length) return center;
        const mapped = mapDoctorCenterServices(result.value, center.user_center_id);
        if (isServer) {
          queryClient.setQueryData([ServerStateKeysEnum.DoctorCenterServices, validatedSlug, String(center.id)], result.value);
        }
        return { ...center, services: mapped };
      });
    } catch (error) {
      console.error('Error hydrating center services (microservice path):', error);
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
    buildDoctorProfileDocumentTitle({
      displayName,
      expertiseTitle: expertises?.expertises?.[0]?.alias_title,
      doctorCitiesLabel: doctorCityNames,
    });
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
        risman: rismanResult,
      },
      hamdastWidgets,
      hamdastWidgetsData,
      user_id: information?.user_id ?? slugInfo.user_id ?? null,
      shouldFetchOnClient: false,
      useSamanAvailabilityStatus: !!options?.prefetchSamanAvailability,
      profile_backend: 'microservice',
      profile_api_id: slugInfo.profile_api_id ?? null,
      profile_type: slugInfo.type,
      doctor_city_names: doctorCityNames,
      ...(isServer ? { dehydratedState: dehydrate(queryClient) } : {}),
      status: 200,
    },
  };
}
