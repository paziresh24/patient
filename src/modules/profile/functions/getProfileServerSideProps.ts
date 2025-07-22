import { ServerStateKeysEnum } from '@/common/apis/serverStateKeysEnum';
import { internalLinks } from '@/common/apis/services/profile/internalLinks';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { CENTERS } from '@/common/types/centers';
import { GrowthBook } from '@growthbook/growthbook-react';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { getProfile } from './getProfileData';
import { getRateDetailsData } from './getRateDetailsData';
import { OverwriteProfileData, overwriteProfileData } from './overwriteProfileData';
import { getReviews } from '@/common/apis/services/reviews/getReviews';
import { getAverageWaitingTime } from './getAverageWaitingTime';
import { splunkInstance } from '@/common/services/splunk';

// ================= Constants =================
const API_ENDPOINTS = {
  GOZARGARH_USER_ID: 'https://apigw.paziresh24.com/v1/gozargah/dr-userid',
  HAMDAST_WIDGETS: 'https://hamdast.paziresh24.com/api/v1/widgets/',
  RISMAN_DOCTORS: 'https://apigw.paziresh24.com/v1/risman/doctors/',
};

const IGNORED_CENTER_ID = '5532';

// ================= Helper Functions =================

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

const sanitizeObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      newObj[key] = value === undefined ? null : sanitizeObject(value);
    }
  }
  return newObj;
};

const handleSsrError = (statusCode: number, slug: string): { props: any } => {
  return {
    props: sanitizeObject({
      centers: [],
      information: {},
      expertises: {},
      feedbacks: {},
      media: {},
      symptomes: {},
      history: {},
      onlineVisit: {},
      similarLinks: [],
      fragmentComponents: {},
      slug,
      status: statusCode,
      dehydratedState: dehydrate(new QueryClient()),
    }),
  };
};

const initializeFeatureFlags = async (context: GetServerSidePropsContext, slug: string): Promise<any> => {
  try {
    const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
    const growthbook = new GrowthBook(growthbookContext);
    growthbook.setAttributes({ slug });
    await growthbook.loadFeatures({ timeout: 500 });

    return {
      raviComponentTopOrderProfile: growthbook.isOn('ravi_component_top_order_profile'),
    };
  } catch (error) {
    console.error('GrowthBook initialization failed:', error);
    return {};
  }
};

const fetchWidgetsData = async (information: any, userData: any): Promise<{ widgets: any[]; widgetsData: any }> => {
  try {
    if (!userData?.user_id) return { widgets: [], widgetsData: {} };

    const { data: widgets } = await axios.get(API_ENDPOINTS.HAMDAST_WIDGETS, {
      params: { user_id: userData.user_id },
      timeout: 3000,
    });

    if (!widgets || widgets.length === 0) return { widgets: [], widgetsData: {} };

    const dataEndpoints = widgets.filter((item: any) => item.data_endpoint);
    const responses = await Promise.allSettled(
      dataEndpoints.map((item: any) =>
        axios.get(item.data_endpoint, {
          params: { user_id: userData.user_id, doctor_id: information?.id, widget_id: item?.id },
          timeout: 3000,
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

// ================= Main SSR Function =================
export const getProfileServerSideProps = withServerUtils(async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  const { slug: rawSlug } = context.query;
  const slug = decodeURIComponent(rawSlug as string);
  const pageSlug = `/dr/${slug}`;
  const university = themeConfing?.partnerKey as string;

  let fullProfileData: any;
  try {
    const { redirect, fullProfileData: data } = await getProfile({ slug, university });
    if (redirect) {
      return { redirect: { statusCode: redirect.statusCode, destination: encodeURI(redirect.route) } };
    }
    fullProfileData = data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      context.res.statusCode = status === 404 ? 410 : error.message.includes('timeout') ? 504 : status;
      await splunkInstance('doctor-profile').sendEvent({
        group: 'profile_error',
        type: 'profile_error',
        event: {
          endpoint: error?.config?.url,
          error_status: error.response?.status,
          error: error?.response?.data,
          message: error.message,
          handle_error_status: context.res.statusCode,
          stack: error?.stack,
        },
      });
      return handleSsrError(context.res.statusCode, slug);
    }
    console.dir(error);
    throw new TypeError(JSON.stringify(error));
  }

  const flags = await initializeFeatureFlags(context, slug);
  const queryClient = new QueryClient();

  const rateDetailsResult = await getRateDetailsData({
    slug,
    version: 2,
  }).catch(() => null);

  const shouldFetchReviews = !!rateDetailsResult && !rateDetailsResult.hide_rates;

  const [internalLinksResult, reviewsResult, averageWaitingTimeResult, rismanResult] = await Promise.allSettled([
    internalLinks({
      links: getSearchLinks({ centers: fullProfileData.centers, group_expertises: fullProfileData.group_expertises ?? [] }),
    }),
    shouldFetchReviews
      ? queryClient.fetchQuery([ServerStateKeysEnum.Feedbacks, { slug, sort: 'default_order', showOnlyPositiveFeedbacks: true }], () =>
          getReviews({ slug, sort: 'default_order', showOnlyPositiveFeedbacks: true }),
        )
      : Promise.resolve(null),
    getAverageWaitingTime({
      slug,
    }),
    axios.get(API_ENDPOINTS.RISMAN_DOCTORS, { params: { doctor_id: fullProfileData.id }, timeout: 2000 }),
  ]);

  // const providerInfo = providerResult.status === 'fulfilled' && providerResult.value ? providerResult.value : {};
  const overwriteData: OverwriteProfileData = {
    provider: {},
    feedbacks: {
      ...fullProfileData.feedbacks,
      ...rateDetailsResult,
      hideRates: rateDetailsResult?.hide_rates,
      reviews: reviewsResult.status === 'fulfilled' ? reviewsResult.value : {},
      waiting_time_info: averageWaitingTimeResult?.status === 'fulfilled' ? averageWaitingTimeResult.value : [],
    },
    history: {},
  };

  const { centers, expertises, feedbacks, history, information, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo } =
    overwriteProfileData(overwriteData, fullProfileData);

  let userData = null;
  try {
    const data = await axios.get(API_ENDPOINTS.GOZARGARH_USER_ID, {
      params: { server_id: information.server_id, user_info_id: information.id },
      headers: { authorization: `Bearer ${process.env.GOZARGARH_API_KEY}` },
      timeout: 3000,
    });

    userData = data?.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  }

  const { widgets, widgetsData } = await fetchWidgetsData(information, userData);

  const doctorCity = centers?.find?.((center: any) => center.id !== IGNORED_CENTER_ID)?.city;
  const title = `${information?.display_name}، ${expertises?.expertises?.[0]?.alias_title} ${
    doctorCity ? `${doctorCity}،` : ''
  } نوبت دهی آنلاین و شماره تلفن`;
  const description = `نوبت دهی اینترنتی ${information?.display_name}، آدرس مطب، شماره تلفن و اطلاعات تماس با امکان رزرو وقت و نوبت دهی آنلاین در اپلیکیشن و سایت پذیرش۲۴`;

  const finalProps = {
    title: university ? information?.display_name : title,
    description: university ? '' : description,
    information,
    centers:
      centers?.filter?.((center: any) => (context.query.centerTarget === CENTERS.CONSULT ? center.id === CENTERS.CONSULT : true)) ?? [],
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
    shouldUseIncrementPageView: flags.shouldUsePageView,
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
      raviComponentTopOrderProfile: flags.raviComponentTopOrderProfile,
      risman: rismanResult.status === 'fulfilled' ? rismanResult.value?.data : null,
    },
    status: context.res.statusCode,
    hamdastWidgets: widgets,
    hamdastWidgetsData: widgetsData,
    user_id: userData?.user_id ?? null,
  };

  return {
    props: sanitizeObject(finalProps),
  };
});
