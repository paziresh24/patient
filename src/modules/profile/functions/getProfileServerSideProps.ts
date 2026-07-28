import { withServerUtils } from '@/common/hoc/withServerUtils';
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { getAggregatedProfileData } from './getAggregatedProfileData'; // ۱. وارد کردن تابع مشترک
import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';
import { sanitizeObject } from '@/common/utils/sanitizeObject';
import { handleSsrError } from '@/common/utils/handleSsrError';
import { withCSR } from '@/common/hoc/withCsr';
import { trackSsrError } from '@/common/utils/ssrErrorTracker';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { GrowthBook } from '@growthbook/growthbook-react';
import { getHost, HeaderBag } from '@/common/utils/getHost';
import { isExpertiseChipsLikeSearchEnabledForSlug } from '@/modules/profile/utils/expertiseChipsLikeSearchFlag';

export const getProfileServerSideProps: GetServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');

    const { slug: rawSlug } = context.query;
    if (!rawSlug) {
      return { notFound: true };
    }
    const slug = decodeURIComponent(rawSlug as string);
    const university = themeConfing?.partnerKey as string;

    let prefetchSamanAvailability = false;
    let fetchExpertiseKeywordTags = false;
    try {
      const host = getHost(context.req.headers as HeaderBag);
      const url = `https://${host}${context.resolvedUrl}`;
      const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
      const growthbook = new GrowthBook(growthbookContext);
      growthbook.setAttributes({ url, host, slug });
      await growthbook.loadFeatures({ timeout: 500 });
      prefetchSamanAvailability = growthbook.isOn('use-saman-availability-status');
    } catch (error) {
      trackSsrError(error, { source: 'ProfileSSR', message: 'Error loading GrowthBook for Saman availability SSR', path: context.resolvedUrl });
    }

    try {
      fetchExpertiseKeywordTags = await isExpertiseChipsLikeSearchEnabledForSlug(slug);
    } catch (error) {
      trackSsrError(error, {
        source: 'ProfileSSR',
        message: 'Error resolving profile.expertise-chips-like-search',
        path: context.resolvedUrl,
      });
      fetchExpertiseKeywordTags = false;
    }

    try {
      const finalProps = await getAggregatedProfileData(slug, university, true, {
        useNewDoctorFullNameAPI: true,
        useNewDoctorExpertiseAPI: true,
        useNewDoctorImageAPI: true,
        useNewDoctorBiographyAPI: true,
        useNewDoctorCentersAPI: true,
        useNewDoctorGalleryAPI: true,
        prefetchSamanAvailability,
        fetchExpertiseKeywordTags,
      });

      return {
        ...finalProps,
        props: sanitizeObject({
          ...finalProps?.props,
          expertiseChipsLikeSearchEnabled: fetchExpertiseKeywordTags,
          status: context.res.statusCode,
        }),
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
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

      trackSsrError(error, { source: 'ProfileSSR', message: 'A non-Axios error occurred in getProfileServerSideProps', path: context.resolvedUrl });
      context.res.statusCode = 500;
      return handleSsrError(context.res.statusCode, slug);
    }
  }),
);
