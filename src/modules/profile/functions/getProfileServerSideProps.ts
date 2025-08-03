import { withServerUtils } from '@/common/hoc/withServerUtils';
import { GetServerSidePropsContext } from 'next';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { getAggregatedProfileData } from './getAggregatedProfileData'; // ۱. وارد کردن تابع مشترک
import axios from 'axios';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { splunkInstance } from '@/common/services/splunk';
import { sanitizeObject } from '@/common/utils/sanitizeObject';
import { handleSsrError } from '@/common/utils/handleSsrError';

export const getProfileServerSideProps = withServerUtils(async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
  context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

  const { slug: rawSlug } = context.query;
  if (!rawSlug) {
    return { notFound: true };
  }
  const slug = decodeURIComponent(rawSlug as string);
  const university = themeConfing?.partnerKey as string;

  try {
    const finalProps = await getAggregatedProfileData(slug, university, true);

    return {
      props: sanitizeObject({
        ...finalProps,
        status: context.res.statusCode,
      }),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 500;
      const statusCode = status === 404 ? 410 : error.message.includes('timeout') || status === 504 ? 504 : status;
      context.res.statusCode = statusCode;

      if (statusCode === 504) {
        console.warn(`SSR Timeout for slug: ${slug}. Falling back to client-side rendering.`);
        return {
          props: sanitizeObject({
            slug,
            shouldFetchOnClient: true,
            status: 200,

            title: `درحال بارگذاری اطلاعات پزشک...`,
            description: '',
            information: null,
            centers: [],
            expertises: {},
            feedbacks: {},
            media: {},
            symptomes: {},
            history: {},
            onlineVisit: {},
            similarLinks: [],
            fragmentComponents: {},
            hamdastWidgets: [],
            hamdastWidgetsData: {},
            user_id: null,
            dehydratedState: dehydrate(new QueryClient()),
          }),
        };
      }

      await splunkInstance('doctor-profile').sendEvent({
        group: 'profile_ssr_error',
        type: `status_${statusCode}`,
        event: {
          slug,
          error_message: error.message,
          status_code: statusCode,
        },
      });
      return handleSsrError(context.res.statusCode, slug);
    }

    console.error('A non-Axios error occurred in getProfileServerSideProps:', error);
    context.res.statusCode = 500;
    return handleSsrError(context.res.statusCode, slug);
  }
});
