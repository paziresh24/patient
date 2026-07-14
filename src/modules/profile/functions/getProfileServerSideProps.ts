import { withServerUtils } from '@/common/hoc/withServerUtils';
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { getAggregatedProfileData } from './getAggregatedProfileData'; // ۱. وارد کردن تابع مشترک
import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';
import { sanitizeObject } from '@/common/utils/sanitizeObject';
import { handleSsrError } from '@/common/utils/handleSsrError';
import { withCSR } from '@/common/hoc/withCsr';
import { slimDoctorProfileProps } from '@/modules/profile/utils/doctorProfileSsr';

export const getProfileServerSideProps: GetServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

    const { slug: rawSlug } = context.query;
    if (!rawSlug) {
      context.res.statusCode = 404;
      return handleSsrError(404, '');
    }
    const slug = decodeURIComponent(rawSlug as string);
    const university = themeConfing?.partnerKey as string;

    try {
      if (process.env.NODE_ENV !== 'production') {
        console.log('🔍 Server-side feature flags for slug:', slug);
      }

      const finalProps = await getAggregatedProfileData(slug, university, true, {
        useNewDoctorFullNameAPI: true,
        useNewDoctorExpertiseAPI: true,
        useNewDoctorImageAPI: true,
        useNewDoctorBiographyAPI: true,
        useNewDoctorCentersAPI: true,
        useNewDoctorGalleryAPI: true,
      });

      if (finalProps?.props?.status) {
        context.res.statusCode = finalProps.props.status;
      }

      return {
        props: sanitizeObject({
          ...slimDoctorProfileProps(finalProps?.props ?? {}),
          status: context.res.statusCode,
        }),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(error.response?.status);
        }

        const status = error.response?.status ?? 500;
        const statusCode = status === 404 ? 410 : error.message.includes('timeout') || status === 504 ? 504 : status;

        await splunkInstance('doctor-profile').sendEvent({
          group: 'profile_error',
          type: 'profile_error',
          event: {
            endpoint: error?.config?.url,
            error_status: error.response?.status,
            error: error?.response?.data,
            message: error.message,
            handle_error_status: context.res.statusCode,
            slug: slug,
            stack: error?.stack,
          },
        });

        if ([500, 502, 504].includes(statusCode)) {
          console.warn(`SSR Timeout/Error for slug: ${slug}. Falling back to client-side rendering.`);
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
            }),
          };
        }

        context.res.statusCode = statusCode;

        return handleSsrError(context.res.statusCode, slug);
      }

      console.error('A non-Axios error occurred in getProfileServerSideProps:', error);
      context.res.statusCode = 500;
      return handleSsrError(context.res.statusCode, slug);
    }
  }),
);
