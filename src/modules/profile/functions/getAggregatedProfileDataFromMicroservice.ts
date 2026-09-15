import axios from 'axios';
import { apiGatewayClient, hamdastClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorCenterServices } from '@/common/apis/services/doctor/getDoctorCenterServices';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { getDoctorMedicalCode } from '@/common/apis/services/doctor/getDoctorMedicalCode';
import { getDoctorOnlineChannels } from '@/common/apis/services/doctor/getDoctorOnlineChannels';
import { getProfileMicroserviceBundle } from '@/common/apis/services/profile-microservice/getProfileMicroserviceBundle';
import { mapMicroserviceToLegacy } from '@/common/apis/services/profile-microservice/mapMicroserviceToLegacy';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { CENTERS } from '@/common/types/centers';
import { filterBookableMappedCenterServices, isInvalidProfileServiceId, mapDoctorCenterServices } from '@/modules/booking/functions/mapDoctorCenterServices';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import isEmpty from 'lodash/isEmpty';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { formatDoctorCitiesForTitle } from './getDoctorCities';
import { getRateDetailsData } from './getRateDetailsData';
import { overwriteProfileData } from './overwriteProfileData';
import { mergeMsLocationsWithLegacyBooking } from './mergeMsLocationsWithLegacyBooking';
import { buildDoctorProfileDocumentTitle } from '@/modules/profile/utils/buildDoctorProfileDocumentTitle';
import { buildRismanDoctorId } from '@/modules/profile/utils/buildRismanDoctorId';
import { fetchDoctorGalleryFromDrprofile } from '@/modules/profile/utils/fetchDoctorGalleryFromDrprofile';

const HAMDAST_WIDGETS = '/api/v1/widgets/';
const RISMAN_DOCTORS = 'https://apigw.paziresh24.com/v1/risman/doctors/';
/** Hamdast is below-the-fold for CWV — soft-cap SSR wait. */
const HAMDAST_SSR_BUDGET_MS = 900;

export type ProfileMsPerfTimings = {
  total_ms: number;
  bundle_ms: number;
  parallel_ms: number;
  reviews_ms: number;
  services_ms: number;
  widgets_ms: number;
  /** True when drprofile centers hydrate succeeded (replaces legacy full-profile gate). */
  legacy_fp_ok: boolean;
  booking_centers_ok?: boolean;
  services_hydrated: number;
  saman_ssr: 'skipped_client';
  parallelized: true;
};

const createBreadcrumb = (links: { orginalLink: string; title: string }[], displayName: string, currentPathName: string) => {
  const reformattedBreadcrumb = links?.map(link => ({ href: link.orginalLink, text: link.title })) ?? [];
  reformattedBreadcrumb.unshift({ href: '/', text: 'پذیرش۲۴' });
  reformattedBreadcrumb.push({ href: currentPathName, text: displayName });
  return reformattedBreadcrumb;
};

const withBudget = async <T,>(promise: Promise<T>, budgetMs: number, fallback: T): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>(resolve => {
        timer = setTimeout(() => resolve(fallback), budgetMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
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
 * Hybrid aggregation for allowlisted slugs (PageSpeed-oriented):
 * - Identity/content from PROFILE_API_BASE_URL
 * - Parallel secondary fetches (gallery hydrate, rates, waiting, risman, getDoctorCenters for booking)
 * - Online visit channels from drprofile /online-channels (not service-title heuristics)
 * - Saman availability is client-only on MS (does not block HTML)
 * - Hamdast SSR soft-budget
 * Legacy getAggregatedProfileData path is untouched.
 */
export async function getAggregatedProfileDataFromMicroservice(
  slug: string,
  university: string | undefined,
  isServer: boolean,
  options?: { prefetchSamanAvailability?: boolean },
) {
  const startedAt = Date.now();
  const queryClient = new QueryClient();

  const bundleStartedAt = Date.now();
  const bundle = await getProfileMicroserviceBundle(slug);
  const bundle_ms = Date.now() - bundleStartedAt;

  if ('error' in bundle) {
    const err = new Error(bundle.error || 'Profile not found in microservice') as Error & { status?: number };
    err.status = bundle.status ?? 404;
    throw err;
  }

  const { slugInfo, fullProfileLike, overwrite, seo, displayName: mappedDisplayName } = mapMicroserviceToLegacy(bundle);
  const validatedSlug = slugInfo.slug || slug;
  const pageSlug = `/dr/${validatedSlug}`;
  const msLocationsAsCenters = Array.isArray(overwrite.centers) ? [...overwrite.centers] : [];
  const rismanDoctorId = buildRismanDoctorId(slugInfo.owner_id, slugInfo.server_id);

  const parallelStartedAt = Date.now();
  const [drprofileGallery, rateDetailsResult, rismanResult, averageWaitingTimeResult, doctorCenters, doctorMedicalCode] =
    await Promise.all([
      fetchDoctorGalleryFromDrprofile(validatedSlug, university).catch(error => {
        console.error('Error hydrating gallery from drprofile (microservice path):', error);
        return [] as Awaited<ReturnType<typeof fetchDoctorGalleryFromDrprofile>>;
      }),
      getRateDetailsData({ slug: validatedSlug }).catch(() => null),
      rismanDoctorId
        ? axios
            .get(RISMAN_DOCTORS, { params: { doctor_id: rismanDoctorId }, timeout: 1500 })
            .then(response => response.data)
            .catch(() => null)
        : Promise.resolve(null),
      getAverageWaitingTime({ slug: validatedSlug }).catch(() => null),
      getDoctorCenters(validatedSlug, university, { onlyBookable: false }).catch(error => {
        console.error('Error fetching drprofile centers for MS booking hydrate:', error);
        return [] as Awaited<ReturnType<typeof getDoctorCenters>>;
      }),
      getDoctorMedicalCode(validatedSlug, {
        id: slugInfo.owner_id,
        server_id: slugInfo.server_id,
      }).catch(() => ({ medical_code: '' })),
    ]);
  const parallel_ms = Date.now() - parallelStartedAt;

  if (Array.isArray(drprofileGallery) && drprofileGallery.length > 0) {
    overwrite.gallery = drprofileGallery;
  }

  const councilMedicalCode = doctorMedicalCode?.medical_code?.trim() || '';
  if (councilMedicalCode) {
    overwrite.councilMedicalCode = councilMedicalCode;
  }

  const bookingCentersOk = Array.isArray(doctorCenters) && doctorCenters.length > 0;

  const shouldFetchReviews = !!rateDetailsResult && !rateDetailsResult.hide_rates;
  const reviewsStartedAt = Date.now();
  const reviewsResult = shouldFetchReviews
    ? await queryClient
        .fetchQuery([ServerStateKeysEnum.Feedbacks, { slug: validatedSlug, sort: 'default_order' }], () =>
          getReviews({ slug: validatedSlug, sort: 'default_order' }),
        )
        .then(value => ({ status: 'fulfilled' as const, value }))
        .catch(reason => ({ status: 'rejected' as const, reason }))
    : { status: 'fulfilled' as const, value: null };
  const reviews_ms = Date.now() - reviewsStartedAt;

  const mergedCenters = mergeMsLocationsWithLegacyBooking(msLocationsAsCenters as any[], doctorCenters);
  overwrite.centers = mergedCenters as any;

  overwrite.feedbacks = {
    averageRates: rateDetailsResult?.averageRates ?? overwrite.feedbacks.averageRates,
    countOfFeedbacks: rateDetailsResult?.countOfFeedbacks ?? overwrite.feedbacks.countOfFeedbacks ?? undefined,
    satisfactionPercent: overwrite.feedbacks.satisfactionPercent,
    waiting_time_statistics: overwrite.feedbacks.waiting_time_statistics,
    hideRates: rateDetailsResult?.hide_rates,
    reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
    waiting_time_info: averageWaitingTimeResult ?? [],
  };

  const {
    centers: initialCenters,
    expertises,
    feedbacks,
    history,
    information,
    media,
    onlineVisit: initialOnlineVisit,
    similarLinks,
    symptomes,
    waitingTimeInfo,
  } = overwriteProfileData(overwrite, fullProfileLike);

  let centers = initialCenters;
  let onlineVisit = initialOnlineVisit;

  // Always hydrate CONSULT; other centers only when service ids are missing/invalid.
  const centersNeedingServices = (centers || []).filter((center: any) => {
    if (!center?.id) return false;
    if (String(center.id) === CENTERS.CONSULT) return true;
    return (
      !(center.services?.length > 0) || center.services.some((service: any) => isInvalidProfileServiceId(service?.id))
    );
  });

  const onlineCenter = (centers || []).find((center: any) => String(center?.id) === CENTERS.CONSULT);
  const servicesStartedAt = Date.now();
  const [servicesHydrationResult, onlineChannelsResult] = await Promise.allSettled([
    (async () => {
      if (centersNeedingServices.length === 0) return centers;
      const serviceResults = await Promise.allSettled(
        centersNeedingServices.map((center: any) => getDoctorCenterServices(validatedSlug, String(center.id))),
      );
      return centers.map((center: any) => {
        const idx = centersNeedingServices.findIndex((c: any) => String(c.id) === String(center.id));
        if (idx < 0) return center;
        const result = serviceResults[idx];
        if (result.status !== 'fulfilled' || !result.value?.length) return center;
        const mapped = mapDoctorCenterServices(result.value, center.user_center_id);
        const services =
          String(center.id) === CENTERS.CONSULT ? filterBookableMappedCenterServices(mapped) : mapped;
        if (isServer) {
          queryClient.setQueryData([ServerStateKeysEnum.DoctorCenterServices, validatedSlug, String(center.id)], result.value);
        }
        return { ...center, services };
      });
    })(),
    onlineCenter ? getDoctorOnlineChannels(validatedSlug) : Promise.resolve([] as string[]),
  ]);
  if (servicesHydrationResult.status === 'fulfilled') {
    centers = servicesHydrationResult.value;
  } else {
    console.error('Error hydrating center services (microservice path):', servicesHydrationResult.reason);
  }
  const services_ms = Date.now() - servicesStartedAt;

  onlineVisit = {
    ...onlineVisit,
    enabled: !!onlineCenter,
    channels: onlineChannelsResult.status === 'fulfilled' ? onlineChannelsResult.value : [],
  };

  const doctorCityNames = formatDoctorCitiesForTitle(centers);
  const displayName = information?.display_name || mappedDisplayName || validatedSlug;
  const seoTitleHint = seo?.title_hint;
  const seoDescriptionHint = seo?.description_hint;

  let hamdastWidgets: any[] = [];
  let hamdastWidgetsData: any = {};
  const widgetsStartedAt = Date.now();
  if (!university) {
    const widgetsResult = await withBudget(
      fetchWidgetsData(information, { user_id: slugInfo.user_id }),
      HAMDAST_SSR_BUDGET_MS,
      { widgets: [], widgetsData: {} },
    );
    hamdastWidgets = widgetsResult.widgets;
    hamdastWidgetsData = widgetsResult.widgetsData;
  }
  const widgets_ms = Date.now() - widgetsStartedAt;

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

  const isBulk = !!(
    centers?.every?.((c: any) => c.status === 2) || centers?.every?.((c: any) => c.services?.every?.((s: any) => !s.hours_of_work))
  );

  const servicesCount = (centers || []).reduce(
    (sum: number, center: any) => sum + (Array.isArray(center?.services) ? center.services.length : 0),
    0,
  );

  const profile_perf: ProfileMsPerfTimings = {
    total_ms: Date.now() - startedAt,
    bundle_ms,
    parallel_ms,
    reviews_ms,
    services_ms,
    widgets_ms,
    legacy_fp_ok: bookingCentersOk,
    booking_centers_ok: bookingCentersOk,
    services_hydrated: centersNeedingServices.length,
    saman_ssr: 'skipped_client',
    parallelized: true,
  };

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
      isBulk,
      fragmentComponents: {
        raviComponentTopOrderProfile: false,
        risman: rismanResult,
      },
      hamdastWidgets,
      hamdastWidgetsData,
      user_id: information?.user_id ?? slugInfo.user_id ?? null,
      shouldFetchOnClient: false,
      useSamanAvailabilityStatus: true,
      profile_backend: 'microservice',
      profile_api_id:
        bundle.profile?.id != null ? String(bundle.profile.id) : slugInfo.profile_api_id ?? null,
      profile_type: slugInfo.type,
      doctor_city_names: doctorCityNames,
      profile_perf,
      profile_debug_meta: {
        centers: centers?.length ?? 0,
        services: servicesCount,
        channels: onlineVisit?.channels ?? [],
        similar_links: Array.isArray(similarLinks) ? similarLinks.length : 0,
        hamdast_widgets: hamdastWidgets?.length ?? 0,
        page_views: history?.count_of_page_view ?? null,
      },
      ...(isServer ? { dehydratedState: dehydrate(queryClient) } : {}),
      status: 200,
    },
  };
}
