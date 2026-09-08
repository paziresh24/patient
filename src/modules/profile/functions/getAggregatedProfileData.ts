import { apiGatewayClient, drProfileClient, hamdastClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorBiography } from '@/common/apis/services/doctor/getDoctorBiography';
import { getDoctorMedicalCode } from '@/common/apis/services/doctor/getDoctorMedicalCode';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { getDoctorCenterServices } from '@/common/apis/services/doctor/getDoctorCenterServices';
import { getDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { getDoctorFullName } from '@/common/apis/services/doctor/getDoctorFullName';
import { fetchDoctorGalleryFromDrprofile } from '@/modules/profile/utils/fetchDoctorGalleryFromDrprofile';
import { getDoctorImage } from '@/common/apis/services/doctor/getDoctorImage';
import { getDoctorOnlineChannels } from '@/common/apis/services/doctor/getDoctorOnlineChannels';
import { getDoctorKeywordTags } from '@/common/apis/services/doctor/getDoctorKeywordTags';
import { validateDoctorSlug } from '@/common/apis/services/doctor/validateDoctorSlug';
import { samanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { CENTERS } from '@/common/types/centers';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { splunkInstance } from '@/common/services/splunk';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { isProfileMicroserviceEnabledForSlug } from '@/modules/profile/utils/profileApiSourceBySlugFlag';
import { filterBookableMappedCenterServices, isInvalidProfileServiceId, mapDoctorCenterServices } from '@/modules/booking/functions/mapDoctorCenterServices';
import { enrichProfileCentersWithSamanAvailability } from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { formatDoctorCitiesForTitle } from './getDoctorCities';
import { getRateDetailsData } from './getRateDetailsData';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';
import { computeExperienceYearsFromGraduationDate } from '@/modules/profile/utils/computeExperienceYears';
import { buildDoctorProfileDocumentTitle } from '@/modules/profile/utils/buildDoctorProfileDocumentTitle';
import { buildRismanDoctorId } from '@/modules/profile/utils/buildRismanDoctorId';
import { isDoctorProfileSelfRedirect } from '@/modules/profile/utils/isDoctorProfileSelfRedirect';
import { resolveProfileDisplayName } from '@/modules/profile/utils/resolveProfileDisplayName';

// ================= Constants =================
const API_ENDPOINTS = {
  HAMDAST_WIDGETS: '/api/v1/widgets/',
  RISMAN_DOCTORS: 'https://apigw.paziresh24.com/v1/risman/doctors/',
};

const IGNORED_CENTER_ID = '5532';

// ================= Helper Functions from original file =================

const getSearchLinks = ({ centers, group_expertises }: any): string[] => {
  const center = centers?.find?.((c: any) => c.city && c.id !== IGNORED_CENTER_ID);
  const gexp = group_expertises?.[0];
  if (!center?.city || !gexp) {
    return ['/s/'];
  }
  return ['/s/', `/s/${center.city_en_slug}/`, `/s/${center.city_en_slug}/${gexp.en_slug}/`];
};

// Build links for "related specialities" section of the profile SEO box
// - For each group expertise: /s/ir/{group_slug}/ and /consult/{group_slug}/
// - For each city      : /s/{city_slug}/doctor/ and /s/{city_slug}/center/
const getRelatedSpecialityLinks = ({ centers, group_expertises }: any): string[] => {
  const links: string[] = [];

  const groups = Array.isArray(group_expertises) ? group_expertises : [];
  const allCenters = Array.isArray(centers) ? centers : [];

  // Group-based links
  groups.forEach((g: any) => {
    const slug = g?.en_slug || g?.slug;
    if (!slug) return;

    links.push(`/s/ir/${slug}/`, `/consult/${slug}/`);
  });

  // City-based links (deduplicated by city slug)
  const citySlugs = new Set<string>();
  allCenters
    .filter((c: any) => c?.city_en_slug && c.id !== IGNORED_CENTER_ID)
    .forEach((c: any) => {
      const citySlug = c.city_en_slug;
      if (citySlugs.has(citySlug)) return;
      citySlugs.add(citySlug);

      links.push(`/s/${citySlug}/doctor/`, `/s/${citySlug}/center/`);
    });

  return links;
};

const getProdLikeRelatedSpecialityLinks = ({ centers, group_expertises }: any): string[] => {
  const groups = (Array.isArray(group_expertises) ? group_expertises : []).filter((group: any) => {
    const groupId = group?.group_id ?? group?.id;
    return groupId !== 35;
  });
  const uniqueCitySlugs = (Array.isArray(centers) ? centers : [])
    .filter((center: any) => center?.city_en_slug && String(center?.id) !== IGNORED_CENTER_ID)
    .map((center: any) => center.city_en_slug)
    .filter((slug: string, index: number, array: string[]) => array.indexOf(slug) === index);

  const expertiseLinks: string[] = [];
  const consultLinks: string[] = [];
  const cityLinks: string[] = [];

  groups.forEach((group: any) => {
    const slug = group?.en_slug || group?.slug;
    if (!slug) return;
    expertiseLinks.push(`/s/ir/${slug}/`);
    consultLinks.push(`/consult/${slug}/`);
  });
  uniqueCitySlugs.forEach(citySlug => {
    cityLinks.push(`/s/${citySlug}/doctor/`, `/s/${citySlug}/center/`);
  });

  return Array.from(new Set([...expertiseLinks, ...cityLinks, ...consultLinks]));
};

const createBreadcrumb = (links: { orginalLink: string; title: string }[], displayName: string, currentPathName: string) => {
  const reformattedBreadcrumb = links?.map(link => ({ href: link.orginalLink, text: link.title })) ?? [];
  reformattedBreadcrumb.unshift({ href: '/', text: 'پذیرش۲۴' });
  reformattedBreadcrumb.push({ href: currentPathName, text: displayName });
  return reformattedBreadcrumb;
};

const fetchWidgetsData = async (information: any, userData: any): Promise<{ widgets: any[]; widgetsData: any }> => {
  try {
    if (!userData?.user_id) return { widgets: [], widgetsData: {} };

    const { data: widgets } = await hamdastClient.get(API_ENDPOINTS.HAMDAST_WIDGETS, {
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
    console.error('Error fetching widgets data:', error);
    return { widgets: [], widgetsData: {} };
  }
};

// ================= Main Aggregator Function =================

export async function getAggregatedProfileData(
  slug: string,
  university: string | undefined,
  isServer: boolean,
  options?: {
    useNewDoctorFullNameAPI?: boolean;
    useNewDoctorExpertiseAPI?: boolean;
    useNewDoctorImageAPI?: boolean;
    useNewDoctorBiographyAPI?: boolean;
    useNewDoctorCentersAPI?: boolean;
    useNewDoctorGalleryAPI?: boolean;
    prefetchSamanAvailability?: boolean;
    /** Explicit SSR decision: true = microservice, false = legacy, undefined = resolve (CSR). */
    useProfileMicroservice?: boolean;
    fetchExpertiseKeywordTags?: boolean;
  },
) {
  // Only allowlisted slugs leave legacy. Callers should pass an explicit boolean
  // (SSR from GrowthBook, CSR from useFeatureValue) so this module stays client-safe.
  let useMicroservice = false;
  if (options?.useProfileMicroservice === true) {
    useMicroservice = true;
  } else if (options?.useProfileMicroservice === false) {
    useMicroservice = false;
  } else {
    // Fallback: env allowlist only (no GrowthBook / no node:crypto in this graph).
    useMicroservice = isProfileMicroserviceEnabledForSlug(slug);
  }

  if (useMicroservice) {
    try {
      const { getAggregatedProfileDataFromMicroservice } = await import('./getAggregatedProfileDataFromMicroservice');
      const microserviceResult = await getAggregatedProfileDataFromMicroservice(slug, university, isServer, options);
      // If MS explicitly returns notFound: sticky SSR must not become legacy.
      if (microserviceResult && typeof microserviceResult === 'object' && 'notFound' in microserviceResult && (microserviceResult as { notFound?: boolean }).notFound) {
        if (options?.useProfileMicroservice === true) {
          const err = new Error('Profile not found in microservice') as Error & { status?: number };
          err.status = 404;
          throw err;
        }
        console.warn('[profile] microservice profile missing; falling back to legacy', { slug });
      } else {
        return microserviceResult;
      }
    } catch (error) {
      // Allowlisted doctors must not silently become full-legacy (ops/managers see coin-flip).
      // Caller asked for MS explicitly — surface the failure instead of swapping backends.
      if (options?.useProfileMicroservice === true) {
        const status = (error as any)?.response?.status ?? (error as any)?.status;
        console.error('[profile] microservice aggregation failed; NOT falling back to legacy (allowlist sticky)', {
          slug,
          status,
          message: error instanceof Error ? error.message : String(error),
        });
        throw error;
      }
      const status = (error as any)?.response?.status ?? (error as any)?.status;
      console.error('[profile] microservice aggregation failed; falling back to legacy', {
        slug,
        status,
        message: error instanceof Error ? error.message : String(error),
        hint:
          status === 401
            ? 'Bearer rejected. For test use API_AUTH_DRIVER=static on profiles-api (token=test|write|admin), or create a db API key.'
            : status === 404
              ? 'Slug not in profiles-api DB; using legacy full-profile.'
              : undefined,
      });
    }
  }

  const queryClient = new QueryClient();

  let slugInfo = null;
  let validatedSlug = slug;
  let skipFullProfile = false;

  // Validate slug first — self-redirect slugs must not wait on full-profile (slow + bad merge).
  const slugValidationResult = await Promise.resolve(validateDoctorSlug(slug)).then(
    value => ({ status: 'fulfilled' as const, value }),
    reason => ({ status: 'rejected' as const, reason }),
  );

  // Handle slug validation result first (this handles redirects and errors)
  if (slugValidationResult.status === 'fulfilled') {
    const result = slugValidationResult.value;

    // Handle error responses (like "Slug not found")
    if ('error' in result) {
      // Send 404 event to Splunk
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_profile_404',
        type: 'page_not_found',
        event: {
          original_slug: slug,
          error_message: result.error,
          isServer: isServer,
          timestamp: new Date().toISOString(),
        },
      });

      if (isServer) {
        return {
          notFound: true,
        };
      } else {
        // For client-side, we'll let the error propagate
        throw new Error(result.error);
      }
    }

    // Handle redirects from slug validation service
    if ('redirect' in result) {
      // Backend sometimes returns 301 to the same /dr/{slug}/ path (encoding-only
      // "canonicalization"). Following that loops forever — skip and render.
      if (isDoctorProfileSelfRedirect(slug, result.redirect.route)) {
        splunkInstance('doctor-profile').sendEvent({
          group: 'doctor_slug_self_redirect_ignored',
          type: 'self_redirect_ignored',
          event: {
            original_slug: slug,
            redirect_route: result.redirect.route,
            isServer: isServer,
            timestamp: new Date().toISOString(),
          },
        });
        slugInfo = null;
        validatedSlug = slug;
        skipFullProfile = true;
      } else if (isServer) {
        return {
          redirect: {
            statusCode: result.redirect.statusCode,
            destination: encodeURI(result.redirect.route),
          },
          props: {},
        };
      } else {
        return location.replace(encodeURI(result.redirect.route));
      }
    } else {
      // Valid slug response - use the validated slug
      slugInfo = result;
      validatedSlug = result.slug;

      // Log successful slug validation
      splunkInstance('doctor-profile').sendEvent({
        group: 'profile_slug_validation_primary',
        type: 'slug_validation_primary_success',
        event: {
          original_slug: slug,
          validated_slug: validatedSlug,
          doctor_id: result.id,
          user_id: result.user_id,
          isServer: isServer,
          timestamp: new Date().toISOString(),
        },
      });
    }
  } else {
    console.error('Error validating doctor slug:', slugValidationResult.reason);
    splunkInstance('doctor-profile').sendEvent({
      group: 'profile_slug_validation_error',
      type: 'slug_validation_error',
      event: {
        original_slug: slug,
        error_message:
          slugValidationResult.reason instanceof Error ? slugValidationResult.reason.message : String(slugValidationResult.reason),
        isServer: isServer,
        timestamp: new Date().toISOString(),
      },
    });
    slugInfo = null;
    validatedSlug = slug;
  }

  const pageSlug = `/dr/${validatedSlug}`;

  const rateDetailsResult = await getRateDetailsData({
    slug: validatedSlug,
  }).catch(() => null);

  const shouldFetchReviews = !!rateDetailsResult && !rateDetailsResult.hide_rates;

  // Phase 1: fetch content APIs in parallel (centers/expertise needed for SEO links)
  const contentCalls = [
    shouldFetchReviews
      ? queryClient.fetchQuery(
          [ServerStateKeysEnum.Feedbacks, { slug: validatedSlug, sort: 'default_order' }],
          () => getReviews({ slug: validatedSlug, sort: 'default_order' }),
        )
      : Promise.resolve(null),
    getAverageWaitingTime({ slug: validatedSlug }),
    buildRismanDoctorId(slugInfo?.owner_id, slugInfo?.server_id)
      ? axios.get(API_ENDPOINTS.RISMAN_DOCTORS, {
          params: { doctor_id: buildRismanDoctorId(slugInfo?.owner_id, slugInfo?.server_id) },
          timeout: 1500,
        })
      : Promise.resolve({ data: null }),
    options?.useNewDoctorFullNameAPI ? getDoctorFullName(validatedSlug) : Promise.resolve(null),
    options?.useNewDoctorExpertiseAPI ? getDoctorExpertise(validatedSlug) : Promise.resolve(null),
    options?.useNewDoctorImageAPI ? getDoctorImage(validatedSlug) : Promise.resolve(null),
    options?.useNewDoctorBiographyAPI ? getDoctorBiography(validatedSlug) : Promise.resolve(null),
    getDoctorMedicalCode(validatedSlug, {
      id: slugInfo?.id ?? slugInfo?.owner_id,
      server_id: slugInfo?.server_id,
    }),
    options?.useNewDoctorCentersAPI
      ? getDoctorCenters(validatedSlug, university, { onlyBookable: false })
      : Promise.resolve(null),
  ] as const;

  const samanAvailabilityPromise =
    isServer && options?.prefetchSamanAvailability
      ? queryClient
          .fetchQuery([ServerStateKeysEnum.SamanDoctorAvailabilityStatus, validatedSlug], () =>
            samanDoctorAvailabilityStatus(validatedSlug),
          )
          .catch(error => {
            console.error('Error prefetching Saman availability status:', error);
            return null;
          })
      : Promise.resolve(null);

  const [
    [
      reviewsResult,
      averageWaitingTimeResult,
      rismanResult,
      doctorFullNameResult,
      doctorExpertiseResult,
      doctorImageResult,
      doctorBiographyResult,
      doctorMedicalCodeResult,
      doctorCentersResult,
    ],
    samanAvailability,
  ] = await Promise.all([Promise.allSettled(contentCalls), samanAvailabilityPromise]);

  // Extract doctor full name from API response
  const doctorFullName =
    options?.useNewDoctorFullNameAPI && doctorFullNameResult?.status === 'fulfilled' ? doctorFullNameResult.value : null;

  // Extract doctor expertise from API response
  const doctorExpertise =
    options?.useNewDoctorExpertiseAPI && doctorExpertiseResult?.status === 'fulfilled' ? doctorExpertiseResult.value : null;

  // Extract doctor image from API response
  const doctorImage = options?.useNewDoctorImageAPI && doctorImageResult?.status === 'fulfilled' ? doctorImageResult.value : null;

  // Extract doctor biography from API response
  let doctorBiography =
    options?.useNewDoctorBiographyAPI && doctorBiographyResult?.status === 'fulfilled' ? doctorBiographyResult.value : null;

  // Parallel fan-out to drprofile can drop biography on prod (timeout/connection reset) while
  // image/expertise succeed. If bio is still empty, do one dedicated follow-up outside the pool.
  if (options?.useNewDoctorBiographyAPI) {
    const hasBiography =
      typeof doctorBiography?.biography === 'string' && doctorBiography.biography.trim().length > 0;
    if (!hasBiography) {
      doctorBiography = await getDoctorBiography(validatedSlug);
    }
  }

  const doctorMedicalCode =
    doctorMedicalCodeResult?.status === 'fulfilled' ? doctorMedicalCodeResult.value?.medical_code?.trim() || '' : '';

  // Extract doctor centers from API response
  const doctorCenters = options?.useNewDoctorCentersAPI && doctorCentersResult?.status === 'fulfilled' ? doctorCentersResult.value : null;

  const processedName = doctorFullName?.name;
  const processedFamily = doctorFullName?.family;
  const finalName = processedName === null ? '' : processedName ?? '';
  const finalFamily = processedFamily === null ? '' : processedFamily ?? '';

  const keywordSearchText = [finalName, finalFamily].filter(Boolean).join(' ').trim();
  const keywordCitySlug =
    doctorCenters?.find?.((center: any) => center?.id !== '5532' && center?.city?.slug)?.city?.slug ||
    (doctorCenters as any[])?.find?.((center: any) => center?.id !== '5532' && center?.city_en_slug)?.city_en_slug ||
    'ir';
  const keywordTags = options?.fetchExpertiseKeywordTags
    ? await getDoctorKeywordTags({
        slug: validatedSlug,
        searchText: keywordSearchText || undefined,
        cityEnSlug: typeof keywordCitySlug === 'string' ? keywordCitySlug : 'ir',
      }).catch(() => [])
    : [];

  // Handle gallery API call after all other requests (depends on centers)
  let doctorGallery: Awaited<ReturnType<typeof fetchDoctorGalleryFromDrprofile>> | null = null;
  if (options?.useNewDoctorGalleryAPI) {
    try {
      doctorGallery = await fetchDoctorGalleryFromDrprofile(validatedSlug, university);
    } catch (error) {
      console.error('Error fetching doctor gallery:', error);
      doctorGallery = null;
    }
  }

  // Keep nested degree/expertise so overwriteProfileData can read *.name fields.
  const transformedExpertise =
    doctorExpertise?.map((exp: any) => ({
      alias_title: exp.alias_title,
      degree: exp.degree,
      expertise: exp.expertise,
      groups: exp.groups,
      graduation_date: exp.graduation_date ?? null,
    })) ?? [];

  // محاسبه سال تجربه از تاریخ فارغ‌التحصیلی (اولین تخصص) — جلالی/میلادی
  const firstGraduationDate = doctorExpertise?.[0]?.graduation_date;
  const experienceYears = computeExperienceYearsFromGraduationDate(firstGraduationDate);

  // Step 3: Overwrite and assemble data
  const overwriteData: OverwriteProfileData = {
    provider: {
      user_id: slugInfo?.user_id != null ? String(slugInfo.user_id) : undefined,
      ...(experienceYears && { experience: experienceYears }),
    },
    feedbacks: {
      ...rateDetailsResult,
      hideRates: rateDetailsResult?.hide_rates,
      reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      waiting_time_info: averageWaitingTimeResult?.status === 'fulfilled' ? averageWaitingTimeResult.value : [],
      countOfFeedbacks: rateDetailsResult?.countOfFeedbacks ?? undefined,
    },
    history: {},
    // Add expertises to overwriteData if new API is used and successful
    ...(options?.useNewDoctorExpertiseAPI &&
      (doctorExpertise?.length ?? 0) > 0 && {
        expertises: transformedExpertise,
      }),
    // Add image to overwriteData if new API is used and successful
    ...(options?.useNewDoctorImageAPI &&
      doctorImage?.image && {
        image: doctorImage.image,
      }),
    // Add biography to overwriteData if new API returned a non-empty string
    ...(options?.useNewDoctorBiographyAPI &&
      typeof doctorBiography?.biography === 'string' &&
      doctorBiography.biography.trim().length > 0 && {
        biography: doctorBiography.biography,
      }),
    ...(doctorMedicalCode && { councilMedicalCode: doctorMedicalCode }),
    // Add centers to overwriteData if new API is used and successful
    ...(options?.useNewDoctorCentersAPI &&
      (doctorCenters?.length ?? 0) > 0 && {
        centers: doctorCenters,
      }),
    // Add gallery to overwriteData if new API is used and successful
    ...(options?.useNewDoctorGalleryAPI &&
      doctorGallery &&
      doctorGallery.length > 0 && {
        gallery: doctorGallery,
      }),
  };

  // Fetch page-view count from drProfile service using slug and
  // override history.count_of_page_view while keeping all existing
  // frontend formatting / display rules (compact notation, SEO text, etc.)
  if (!university) {
    try {
      const { data: pageViewData } = await drProfileClient.get(
        `/api/doctors/${encodeURIComponent(validatedSlug)}/page-view`,
        {
          timeout: 2000,
        },
      );

      const candidates = [
        (pageViewData as any)?.page_view,
        (pageViewData as any)?.count_of_page_view,
        (pageViewData as any)?.number_of_visits,
        (pageViewData as any)?.views,
        (pageViewData as any)?.view,
        (pageViewData as any)?.data?.page_view,
        (pageViewData as any)?.data?.count_of_page_view,
        (pageViewData as any)?.data?.number_of_visits,
      ];

      const numericCandidate = candidates.find(value => typeof value === 'number');

      if (typeof numericCandidate === 'number' && Number.isFinite(numericCandidate)) {
        overwriteData.history = {
          ...(overwriteData.history ?? {}),
          count_of_page_view: String(numericCandidate),
        };
      }
    } catch (error) {
      console.error('Error fetching doctor page-view from drProfile service:', error);
    }
  }

  // Handle null values from fullname web service (finalName/finalFamily computed above)
  // Log to Splunk if fullname values were null
  if (options?.useNewDoctorFullNameAPI && doctorFullName && (doctorFullName.name === null || doctorFullName.family === null)) {
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_fullname_null_values',
      type: 'api_null_values',
      event: {
        slug: validatedSlug,
        name_value: doctorFullName.name,
        family_value: doctorFullName.family,
        final_name: finalName,
        final_family: finalFamily,
        timestamp: new Date().toISOString(),
      },
    });
  }

  const profileSource = {};

  const resolvedName = finalName?.trim() ? finalName : undefined;
  const resolvedFamily = finalFamily?.trim() ? finalFamily : undefined;

  const {
    centers: initialCenters,
    expertises,
    feedbacks,
    history,
    information: rawInformation,
    media,
    onlineVisit: rawOnlineVisit,
    similarLinks: rawSimilarLinks,
    symptomes,
    waitingTimeInfo,
  } = overwriteProfileData(overwriteData, {
    ...profileSource,
    id: slugInfo?.owner_id,
    server_id: slugInfo?.server_id,
    name: resolvedName,
    family: resolvedFamily,
  });

  const centerFallbackName = initialCenters?.[0]?.name;
  const displayName = resolveProfileDisplayName(
    { name: rawInformation?.name, family: rawInformation?.family },
    { centerName: centerFallbackName, slug: validatedSlug },
  );
  const information = {
    ...rawInformation,
    ...(displayName
      ? {
          display_name: displayName,
          name: rawInformation?.name?.trim() ? rawInformation.name : displayName.split(' ')[0] ?? displayName,
          family:
            rawInformation?.family?.trim() ?
              rawInformation.family
            : displayName.includes(' ') ?
              displayName.slice(displayName.indexOf(' ') + 1)
            : '',
        }
      : {}),
  };

  // When centers API adds 5532 but full-profile has no/invalid services, hydrate from center services API
  // so profile SSR can render the online-visit card (e.g. Doodangeh).
  let centers = initialCenters;
  let onlineVisit = rawOnlineVisit;
  const consultCenter = centers?.find?.((center: any) => String(center?.id) === CENTERS.CONSULT);
  // full-profile service ids (5532) can be stale; always hydrate online visit from drprofile.
  const needsOnlineServices = !!consultCenter;

  let onlineChannels: string[] = [];
  if (needsOnlineServices) {
    const [onlineServicesResult, onlineChannelsResult] = await Promise.allSettled([
      getDoctorCenterServices(validatedSlug, CENTERS.CONSULT),
      getDoctorOnlineChannels(validatedSlug),
    ]);

    if (onlineServicesResult.status === 'fulfilled' && onlineServicesResult.value?.length) {
      const mapped = filterBookableMappedCenterServices(
        mapDoctorCenterServices(onlineServicesResult.value, consultCenter.user_center_id),
      );
      centers = centers.map((center: any) =>
        String(center?.id) === CENTERS.CONSULT ? { ...center, services: mapped } : center,
      );
      if (isServer) {
        queryClient.setQueryData(
          [ServerStateKeysEnum.DoctorCenterServices, validatedSlug, CENTERS.CONSULT],
          onlineServicesResult.value,
        );
      }
    } else if (onlineServicesResult.status === 'rejected') {
      console.error('Error hydrating online visit center services:', onlineServicesResult.reason);
    }

    onlineChannels = onlineChannelsResult.status === 'fulfilled' ? onlineChannelsResult.value : [];
  }

  const hydratedConsultCenter = centers?.find?.((center: any) => String(center?.id) === CENTERS.CONSULT);
  onlineVisit = {
    ...onlineVisit,
    enabled: !!hydratedConsultCenter,
    channels: onlineChannels,
  };

  const normalizedGroupExpertisesSource =
    doctorExpertise?.flatMap((item: any) => item?.groups ?? []) ??
    expertises?.group_expertises ??
    [];
  const normalizedGroupExpertises = normalizedGroupExpertisesSource.filter((group: any, index: number, array: any[]) => {
    const slug = group?.en_slug || group?.slug;
    if (!slug) return false;
    return array.findIndex(item => (item?.en_slug || item?.slug) === slug) === index;
  });

  const expertisesWithGroups = {
    ...expertises,
    group_expertises:
      expertises?.group_expertises?.length > 0
        ? expertises.group_expertises
        : normalizedGroupExpertises.map((group: any) => ({
            id: group.id,
            en_slug: group.en_slug ?? group.slug,
            icon: group.icon ?? null,
            name: group.name,
          })),
  };

  const relatedSpecialityLinks = getProdLikeRelatedSpecialityLinks({
    centers,
    group_expertises: expertisesWithGroups.group_expertises?.length
      ? expertisesWithGroups.group_expertises
      : normalizedGroupExpertises,
  });

  const internalLinksRelatedResult = await (
    relatedSpecialityLinks.length
      ? Promise.resolve(internalLinks({ links: relatedSpecialityLinks })).then(
          value => ({ status: 'fulfilled' as const, value }),
          () => ({ status: 'rejected' as const, reason: null }),
        )
      : Promise.resolve({ status: 'fulfilled' as const, value: [] })
  );

  // Prefer internal-links based items for "تخصص های مرتبط" when available
  let similarLinks = rawSimilarLinks;
  if (internalLinksRelatedResult.status === 'fulfilled' && Array.isArray(internalLinksRelatedResult.value)) {
    const enrichedLinks = internalLinksRelatedResult.value.map((item: any) => ({
      caption: item.title,
      link: item.link || item.orginalLink,
    }));

    if (enrichedLinks.length > 0) {
      similarLinks = enrichedLinks;
    }
  }

  // Step 4: Fetch server-specific data only if running on the server
  let userData = overwriteData?.provider ?? null;
  let widgets: any[] = [];
  let widgetsData = {};

  if (!university) {
    try {
      if (!slugInfo?.user_id) {
        const { data } = await drProfileClient.get(`/api/doctors/${encodeURIComponent(validatedSlug)}`, {
          timeout: 3000,
        });

        userData = data;
      }
      const widgetResults = await fetchWidgetsData(information, userData);
      widgets = widgetResults.widgets;
      widgetsData = widgetResults.widgetsData;
    } catch (error) {
      console.error('Could not fetch server-only Gozargah/Hamdast data. Continuing without it.', error);
    }
  }

  centers = enrichProfileCentersWithSamanAvailability(centers, samanAvailability);

  // Step 5: Construct the final props object
  const doctorCitiesLabel = formatDoctorCitiesForTitle(centers);
  const title = buildDoctorProfileDocumentTitle({
    displayName: information?.display_name,
    expertiseTitle: expertisesWithGroups?.expertises?.[0]?.alias_title,
    doctorCitiesLabel,
  });
  const description = `نوبت دهی اینترنتی ${information?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

  const finalProps = {
    props: {
      title: university ? information?.display_name : title,
      description: university ? '' : description,
      information: {
        ...information,
        user_id: userData?.user_id ?? information?.user_id ?? slugInfo?.user_id ?? null,
      },
      centers,
      expertises: expertisesWithGroups,
      feedbacks: {
        ...feedbacks,
        feedbacks: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      },
      media,
      symptomes,
      history,
      onlineVisit,
      similarLinks: similarLinks ?? [],
      waitingTimeInfo,
      isBulk: !!(
        centers?.every?.((c: any) => c.status === 2) || centers?.every?.((c: any) => c.services?.every?.((s: any) => !s.hours_of_work))
      ),
      breadcrumbs: createBreadcrumb([], information?.display_name, pageSlug),
      slug: validatedSlug,
      fragmentComponents: {
        // Note: Flags would need to be handled differently on the client
        raviComponentTopOrderProfile: false, // Default value for client
        risman: rismanResult.status === 'fulfilled' ? rismanResult.value?.data : null,
      },
      hamdastWidgets: widgets,
      hamdastWidgetsData: widgetsData,
      keywordTags: Array.isArray(keywordTags) ? keywordTags : [],
      expertiseChipsLikeSearchEnabled: !!options?.fetchExpertiseKeywordTags,
      user_id: userData?.user_id ?? information?.user_id ?? slugInfo?.user_id ?? null,
      shouldFetchOnClient: false,
      useSamanAvailabilityStatus: true,
      profile_backend: 'legacy',
      ...(isServer ? { dehydratedState: dehydrate(queryClient) } : {}),
    },
  };

  return finalProps;
}
