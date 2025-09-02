import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { getProfile } from './getProfileData';
import { getRateDetailsData } from './getRateDetailsData';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { splunkInstance } from '@/common/services/splunk';

// ================= Constants =================
const API_ENDPOINTS = {
  GOZARGARH_USER_ID: 'https://apigw.paziresh24.com/v1/gozargah/dr-userid',
  HAMDAST_WIDGETS: 'https://hamdast.paziresh24.com/api/v1/widgets/',
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

    const { data: widgets } = await axios.get(API_ENDPOINTS.HAMDAST_WIDGETS, {
      params: { user_id: userData.user_id },
      timeout: 1000,
    });

    if (!widgets || widgets.length === 0) return { widgets: [], widgetsData: {} };

    const dataEndpoints = widgets.filter((item: any) => item.data_endpoint);
    const responses = await Promise.allSettled(
      dataEndpoints.map((item: any) =>
        axios.get(item.data_endpoint, {
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

export async function getAggregatedProfileData(slug: string, university: string | undefined, isServer: boolean, options?: any) {
  const queryClient = new QueryClient();
  const pageSlug = `/dr/${slug}`;

  let userInfo = null;

  if (options?.useClApi) {
    const slugInfoEndpoint = `https://apigw.paziresh24.com/prapi/v1/slugs/${slug}`;
    splunkInstance('doctor-profile').sendEvent({
      group: 'profile_api_request',
      type: 'profile_api_request',
      event: {
        endpoint: slugInfoEndpoint,
        slug: slug,
        isServer: isServer,
      },
    });
    const data = await axios.get(slugInfoEndpoint, {
      headers: {
        Accept: 'application/json',
      },
      timeout: 1000,
    });
    userInfo = data?.data?.user_info;
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

  const [internalLinksResult, reviewsResult, averageWaitingTimeResult, rismanResult] = await Promise.allSettled([
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
  ]);

  // Step 3: Overwrite and assemble data
  const overwriteData: OverwriteProfileData = {
    provider: {
      user_id: userInfo?.user_id ?? null,
    },
    feedbacks: {
      ...fullProfileData?.feedbacks,
      ...rateDetailsResult,
      hideRates: rateDetailsResult?.hide_rates,
      reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      waiting_time_info: averageWaitingTimeResult?.status === 'fulfilled' ? averageWaitingTimeResult.value : [],
    },
    history: {},
  };

  const { centers, expertises, feedbacks, history, information, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo } =
    overwriteProfileData(overwriteData, {
      ...fullProfileData,
      id: userInfo?.id ?? fullProfileData?.id,
      server_id: userInfo?.server_id ?? fullProfileData?.server_id,
      name: userInfo?.name ?? fullProfileData?.name,
      family: userInfo?.family ?? fullProfileData?.family,
    });

  // Step 4: Fetch server-specific data only if running on the server
  let userData = overwriteData?.provider ?? null;
  let widgets: any[] = [];
  let widgetsData = {};

  if (!university) {
    try {
      if (!userInfo?.user_id) {
        const { data } = await axios.get(API_ENDPOINTS.GOZARGARH_USER_ID, {
          params: { server_id: information.server_id, user_info_id: information?.id },
          headers: { authorization: `Bearer tzDWVALYrMpF6w9Msju87wmc@kd)` },
          timeout: 500,
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
