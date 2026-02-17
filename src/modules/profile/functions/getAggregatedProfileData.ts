import { apiGatewayClient, drProfileClient, hamdastClient } from '@/common/apis/client';
import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { getDoctorBiography } from '@/common/apis/services/doctor/getDoctorBiography';
import { getDoctorCenters } from '@/common/apis/services/doctor/getDoctorCenters';
import { getDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { getDoctorFullName } from '@/common/apis/services/doctor/getDoctorFullName';
import { getDoctorGallery } from '@/common/apis/services/doctor/getDoctorGallery';
import { getDoctorImage } from '@/common/apis/services/doctor/getDoctorImage';
import { validateDoctorSlug } from '@/common/apis/services/doctor/validateDoctorSlug';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { splunkInstance } from '@/common/services/splunk';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { getProfile } from './getProfileData';
import { getRateDetailsData } from './getRateDetailsData';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';

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
  },
) {
  const queryClient = new QueryClient();

  let slugInfo = null;
  let validatedSlug = slug;
  let fullProfileData = null;

  // Start both slug validation and full profile calls in parallel
  // Use retry mechanism for client-side requests
  const [slugValidationResult, fullProfileResult] = await Promise.allSettled([
    validateDoctorSlug(slug),
    getProfile({ slug, university, isServer: isServer }),
  ]);

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
      if (isServer) {
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
    }

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

  // Handle full profile result (no redirect handling - just get data)
  if (fullProfileResult.status === 'fulfilled') {
    const { fullProfileData: data } = fullProfileResult.value;
    fullProfileData = data;
  } else {
    // Full profile failed - log error but continue to show page
    console.error('Error in full profile:', fullProfileResult.reason);
    fullProfileData = null;
  }

  const pageSlug = `/dr/${validatedSlug}`;

  const rateDetailsResult = await getRateDetailsData({
    slug: validatedSlug,
  }).catch(() => null);

  const shouldFetchReviews = !!rateDetailsResult && !rateDetailsResult.hide_rates;

  const searchLinks = getSearchLinks({
    centers: fullProfileData?.centers,
    group_expertises: fullProfileData?.group_expertises ?? [],
  });

  const relatedSpecialityLinks = getRelatedSpecialityLinks({
    centers: fullProfileData?.centers,
    group_expertises: fullProfileData?.group_expertises ?? [],
  });

  const apiCalls = [
    internalLinks({
      links: searchLinks,
    }),
    relatedSpecialityLinks.length
      ? internalLinks({
          links: relatedSpecialityLinks,
        })
      : Promise.resolve([]),
    shouldFetchReviews
      ? queryClient.fetchQuery(
          [ServerStateKeysEnum.Feedbacks, { slug: validatedSlug, sort: 'default_order', showOnlyPositiveFeedbacks: true }],
          () => getReviews({ slug: validatedSlug, sort: 'default_order', showOnlyPositiveFeedbacks: true }),
        )
      : Promise.resolve(null),
    getAverageWaitingTime({
      slug: validatedSlug,
    }),
    axios.get(API_ENDPOINTS.RISMAN_DOCTORS, { params: { doctor_id: slugInfo?.owner_id }, timeout: 1500 }),
  ];

  // Conditionally add doctor full name API call
  if (options?.useNewDoctorFullNameAPI) {
    apiCalls.push(getDoctorFullName(validatedSlug));
  }

  // Conditionally add doctor expertise API call
  if (options?.useNewDoctorExpertiseAPI) {
    apiCalls.push(getDoctorExpertise(validatedSlug));
  }

  // Conditionally add doctor image API call
  if (options?.useNewDoctorImageAPI) {
    apiCalls.push(getDoctorImage(validatedSlug));
  }

  // Conditionally add doctor biography API call
  if (options?.useNewDoctorBiographyAPI) {
    apiCalls.push(getDoctorBiography(validatedSlug));
  }

  // Conditionally add doctor centers API call
  if (options?.useNewDoctorCentersAPI) {
    apiCalls.push(getDoctorCenters(validatedSlug, university));
  }

  const [
    internalLinksBreadcrumbResult,
    internalLinksRelatedResult,
    reviewsResult,
    averageWaitingTimeResult,
    rismanResult,
    doctorFullNameResult,
    doctorExpertiseResult,
    doctorImageResult,
    doctorBiographyResult,
    doctorCentersResult,
  ] = await Promise.allSettled(apiCalls);

  // Extract doctor full name from API response
  const doctorFullName =
    options?.useNewDoctorFullNameAPI && doctorFullNameResult?.status === 'fulfilled' ? doctorFullNameResult.value : null;

  // Extract doctor expertise from API response
  const doctorExpertise =
    options?.useNewDoctorExpertiseAPI && doctorExpertiseResult?.status === 'fulfilled' ? doctorExpertiseResult.value : null;

  // Extract doctor image from API response
  const doctorImage = options?.useNewDoctorImageAPI && doctorImageResult?.status === 'fulfilled' ? doctorImageResult.value : null;

  // Extract doctor biography from API response
  const doctorBiography =
    options?.useNewDoctorBiographyAPI && doctorBiographyResult?.status === 'fulfilled' ? doctorBiographyResult.value : null;

  // Extract doctor centers from API response
  const doctorCenters = options?.useNewDoctorCentersAPI && doctorCentersResult?.status === 'fulfilled' ? doctorCentersResult.value : null;

  // Handle gallery API call after all other requests (depends on centers)
  let doctorGallery = null;
  if (options?.useNewDoctorGalleryAPI) {
    const clinicCenters = Array.isArray(doctorCenters) ? doctorCenters.filter((center: any) => center.type_id === 1) : [];

    if (clinicCenters.length > 0) {
      try {
        const galleryPromises = clinicCenters.map((center: any) => getDoctorGallery(center.id));
        const galleryResults = await Promise.allSettled(galleryPromises);

        doctorGallery = galleryResults
          .filter(result => result.status === 'fulfilled')
          .map((result: any) => result.value)
          .flat()
          .filter(Boolean);
      } catch (error) {
        console.error('Error fetching doctor gallery:', error);
        doctorGallery = null;
      }
    }
  }

  // Transform expertise data to match expected format
  const transformedExpertise =
    doctorExpertise?.map((exp: any) => ({
      id: exp.expertise.id,
      name: exp.expertise.name,
      slug: exp.expertise.slug,
      alias_title: exp.alias_title,
      degree: exp.degree,
      groups: exp.groups,
      graduation_date: exp.graduation_date ?? null,
    })) ?? [];

  // محاسبه سال تجربه از تاریخ فارغ‌التحصیلی (اولین تخصص)
  const firstGraduationDate = doctorExpertise?.[0]?.graduation_date;
  const experienceYears =
    firstGraduationDate &&
    (() => {
      const year = parseInt(firstGraduationDate.slice(0, 4), 10);
      if (Number.isNaN(year)) return null;
      const currentYear = new Date().getFullYear();
      const years = currentYear - year;
      return years >= 0 ? String(years) : null;
    })();

  // Step 3: Overwrite and assemble data
  const overwriteData: OverwriteProfileData = {
    provider: {
      user_id: slugInfo?.user_id ?? null,
      ...(experienceYears && { experience: experienceYears }),
    },
    feedbacks: {
      ...rateDetailsResult,
      hideRates: rateDetailsResult?.hide_rates,
      reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      waiting_time_info: averageWaitingTimeResult?.status === 'fulfilled' ? averageWaitingTimeResult.value : [],
    },
    history: {},
    // Add expertises to overwriteData if new API is used and successful
    ...(options?.useNewDoctorExpertiseAPI &&
      doctorExpertise?.length > 0 && {
        expertises: transformedExpertise,
      }),
    // Add image to overwriteData if new API is used and successful
    ...(options?.useNewDoctorImageAPI &&
      doctorImage?.image && {
        image: doctorImage.image,
      }),
    // Add biography to overwriteData if new API is used and successful
    ...(options?.useNewDoctorBiographyAPI &&
      doctorBiography?.biography && {
        biography: doctorBiography.biography,
      }),
    // Add centers to overwriteData if new API is used and successful
    ...(options?.useNewDoctorCentersAPI &&
      doctorCenters?.length > 0 && {
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
          count_of_page_view: numericCandidate,
        };
      }
    } catch (error) {
      console.error('Error fetching doctor page-view from drProfile service:', error);
    }
  }

  // Handle null values from fullname web service
  const processedName = doctorFullName?.name;
  const processedFamily = doctorFullName?.family;

  // Set empty strings if values are null
  const finalName = processedName === null ? '' : processedName;
  const finalFamily = processedFamily === null ? '' : processedFamily;

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

  const {
    centers,
    expertises,
    feedbacks,
    history,
    information,
    media,
    onlineVisit,
    similarLinks: rawSimilarLinks,
    symptomes,
    waitingTimeInfo,
  } = overwriteProfileData(overwriteData, {
    ...(fullProfileData ?? {}),
    id: slugInfo?.owner_id,
    server_id: slugInfo?.server_id,
    name: finalName,
    family: finalFamily,
  });

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

  // Step 5: Construct the final props object
  const doctorCity = centers?.find?.((center: any) => center.id !== IGNORED_CENTER_ID)?.city;
  const title = `${information?.display_name}، ${expertises?.expertises?.[0]?.alias_title} ${
    doctorCity ? `${doctorCity}،` : ''
  } نوبت دهی آنلاین و شماره تلفن`;
  const description = `نوبت دهی اینترنتی ${information?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

  const finalProps = {
    props: {
      title: university ? information?.display_name : title,
      description: university ? '' : description,
      information: {
        ...information,
        user_id: userData?.user_id ?? information?.user_id ?? null,
      },
      centers,
      expertises,
      feedbacks: {
        ...feedbacks,
        feedbacks: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      },
      media,
      symptomes,
      history,
      onlineVisit,
      similarLinks,
      waitingTimeInfo,
      isBulk: !!(
        centers?.every?.((c: any) => c.status === 2) || centers?.every?.((c: any) => c.services?.every?.((s: any) => !s.hours_of_work))
      ),
      breadcrumbs: createBreadcrumb(
        internalLinksBreadcrumbResult.status === 'fulfilled' ? internalLinksBreadcrumbResult.value : [],
        information?.display_name,
        pageSlug,
      ),
      slug: validatedSlug,
      fragmentComponents: {
        // Note: Flags would need to be handled differently on the client
        raviComponentTopOrderProfile: false, // Default value for client
        risman: rismanResult.status === 'fulfilled' ? rismanResult.value?.data : null,
      },
      hamdastWidgets: widgets,
      hamdastWidgetsData: widgetsData,
      user_id: userData?.user_id ?? null,
      shouldFetchOnClient: !fullProfileData?.id,
    },
  };

  return finalProps;
}
