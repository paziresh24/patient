import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { getDoctorFullName } from '@/common/apis/services/doctor/getDoctorFullName';
import { getDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { getDoctorImage } from '@/common/apis/services/doctor/getDoctorImage';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { getProfile } from './getProfileData';
import { getRateDetailsData } from './getRateDetailsData';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { splunkInstance } from '@/common/services/splunk';
import { apiGatewayClient, drProfileClient, hamdastClient } from '@/common/apis/client';

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
  options?: { useClApi?: boolean; useNewDoctorFullNameAPI?: boolean; useNewDoctorExpertiseAPI?: boolean; useNewDoctorImageAPI?: boolean },
) {
  const queryClient = new QueryClient();
  const pageSlug = `/dr/${slug}`;

  let slugInfo = null;

  if (options?.useClApi) {
    try {
      const slugInfoEndpoint = `/api/doctors/${encodeURIComponent(slug)}`;
      splunkInstance('doctor-profile').sendEvent({
        group: 'profile_api_request',
        type: 'profile_api_request',
        event: {
          endpoint: slugInfoEndpoint,
          slug: slug,
          isServer: isServer,
        },
      });
      const data = await drProfileClient.get(slugInfoEndpoint, {
        timeout: 1000,
      });
      slugInfo = data?.data;
    } catch (error) {
      //
    }
  }

  let fullProfileData;
  try {
    const { redirect, fullProfileData: data } = await getProfile({ slug, university, isServer: isServer });
    fullProfileData = data;
    if (redirect) {
      if (isServer) {
        return { redirect: { statusCode: redirect.statusCode, destination: encodeURI(redirect.route) }, props: {} };
      } else {
        return location.replace(encodeURI(redirect.route));
      }
    }
  } catch (error) {
    if (!options?.useClApi) {
      return Promise.reject(error);
    }
  }

  const rateDetailsResult = await getRateDetailsData({
    slug,
  }).catch(() => null);

  const shouldFetchReviews = !!rateDetailsResult && !rateDetailsResult.hide_rates;

  const apiCalls = [
    internalLinks({
      links: getSearchLinks({ centers: fullProfileData?.centers, group_expertises: fullProfileData?.group_expertises ?? [] }),
    }),
    shouldFetchReviews
      ? queryClient.fetchQuery([ServerStateKeysEnum.Feedbacks, { slug, sort: 'default_order', showOnlyPositiveFeedbacks: true }], () =>
          getReviews({ slug, sort: 'default_order', showOnlyPositiveFeedbacks: true }),
        )
      : Promise.resolve(null),
    getAverageWaitingTime({
      slug,
    }),
    axios.get(API_ENDPOINTS.RISMAN_DOCTORS, { params: { doctor_id: fullProfileData?.id }, timeout: 1500 }),
  ];

  // Conditionally add doctor full name API call (like clapi pattern)
  if (options?.useNewDoctorFullNameAPI) {
    apiCalls.push(getDoctorFullName(slug));
  }

  // Conditionally add doctor expertise API call (like clapi pattern)
  if (options?.useNewDoctorExpertiseAPI) {
    apiCalls.push(getDoctorExpertise(slug));
  }

  // Conditionally add doctor image API call (like clapi pattern)
  if (options?.useNewDoctorImageAPI) {
    console.log('🖼️ Using new doctor image API for slug:', slug);
    apiCalls.push(getDoctorImage(slug));
  } else {
    console.log('❌ Not using new doctor image API for slug:', slug);
  }

  const [internalLinksResult, reviewsResult, averageWaitingTimeResult, rismanResult, doctorFullNameResult, doctorExpertiseResult, doctorImageResult] =
    await Promise.allSettled(apiCalls);

  // Extract doctor full name from API response (like clapi pattern)
  const doctorFullName =
    options?.useNewDoctorFullNameAPI && doctorFullNameResult?.status === 'fulfilled' ? doctorFullNameResult.value : null;

  // Extract doctor expertise from API response (like clapi pattern)
  const doctorExpertise =
    options?.useNewDoctorExpertiseAPI && doctorExpertiseResult?.status === 'fulfilled' ? doctorExpertiseResult.value : null;

  // Extract doctor image from API response (like clapi pattern)
  const doctorImage =
    options?.useNewDoctorImageAPI && doctorImageResult?.status === 'fulfilled' ? doctorImageResult.value : null;

  console.log('🖼️ Doctor image API result:', {
    useNewDoctorImageAPI: options?.useNewDoctorImageAPI,
    resultStatus: doctorImageResult?.status,
    imageData: doctorImage,
  });

  // Transform expertise data to match expected format
  const transformedExpertise =
    doctorExpertise?.map((exp: any) => ({
      id: exp.expertise.id,
      name: exp.expertise.name,
      slug: exp.expertise.slug,
      alias_title: exp.alias_title,
      degree: exp.degree,
      groups: exp.groups,
    })) ?? [];

  // Step 3: Overwrite and assemble data
  const overwriteData: OverwriteProfileData = {
    provider: {
      user_id: slugInfo?.user_id ?? null,
    },
    feedbacks: {
      ...fullProfileData?.feedbacks,
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
  };

  console.log('🖼️ OverwriteData image:', overwriteData.image);

  const { centers, expertises, feedbacks, history, information, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo } =
    overwriteProfileData(overwriteData, {
      ...fullProfileData,
      id: slugInfo?.owner_id ?? fullProfileData?.id,
      server_id: slugInfo?.server_id ?? fullProfileData?.server_id,
      name: doctorFullName?.name ?? fullProfileData?.name,
      family: doctorFullName?.family ?? fullProfileData?.family,
    });

  // Step 4: Fetch server-specific data only if running on the server
  let userData = overwriteData?.provider ?? null;
  let widgets: any[] = [];
  let widgetsData = {};

  if (!university) {
    try {
      if (!slugInfo?.user_id) {
        const { data } = await drProfileClient.get(`/api/doctors/${encodeURIComponent(slug)}`, {
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
      dehydratedState: dehydrate(queryClient),
      media,
      symptomes,
      history,
      onlineVisit,
      similarLinks,
      waitingTimeInfo,
      isBulk: !!(
        centers?.every?.((c: any) => c.status === 2) || centers?.every?.((c: any) => c.services.every((s: any) => !s.hours_of_work))
      ),
      breadcrumbs: createBreadcrumb(
        internalLinksResult.status === 'fulfilled' ? internalLinksResult.value : [],
        information?.display_name,
        pageSlug,
      ),
      slug,
      fragmentComponents: {
        // Note: Flags would need to be handled differently on the client
        raviComponentTopOrderProfile: false, // Default value for client
        risman: rismanResult.status === 'fulfilled' ? rismanResult.value?.data : null,
      },
      hamdastWidgets: widgets,
      hamdastWidgetsData: widgetsData,
      user_id: userData?.user_id ?? null,
      shouldFetchOnClient: !fullProfileData?.id,
      isFullProfileError: !fullProfileData?.id,
    },
  };

  return finalProps;
}
