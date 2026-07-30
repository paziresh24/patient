import { withServerUtils } from '@/common/hoc/withServerUtils';
import { GetServerSideProps, GetServerSidePropsContext, NextApiRequest } from 'next';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { getAggregatedProfileData } from './getAggregatedProfileData'; // ۱. وارد کردن تابع مشترک
import axios from 'axios';
import { sanitizeObject } from '@/common/utils/sanitizeObject';
import { handleSsrError } from '@/common/utils/handleSsrError';
import { trackSsrError } from '@/common/utils/ssrErrorTracker';
import { getServerSideGrowthBookContext } from '@/common/helper/getServerSideGrowthBookContext';
import { GrowthBook } from '@growthbook/growthbook-react';
import { getHost, HeaderBag } from '@/common/utils/getHost';
import { getProfileMicroserviceConfig } from '@/common/apis/clients/profileMicroserviceClient';
import {
  isSlugInProfileApiSourceAllowlist,
  PROFILE_API_SOURCE_FEATURE_KEY,
} from '@/modules/profile/utils/profileApiSourceBySlugFlag';
import { isExpertiseChipsLikeSearchEnabledForSlug } from '@/modules/profile/utils/expertiseChipsLikeSearchFlag';
import { sendDoctorProfileEventServer } from '@/modules/profile/events/nightBatEvents';

const clientFetchFallbackProps = (slug: string) =>
  sanitizeObject({
    slug,
    shouldFetchOnClient: true,
    status: 200,
    title: 'درحال بارگذاری اطلاعات پزشک...',
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
  });

export const getProfileServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    context.res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
    const ssrStartedAt = Date.now();
    const userAgent = context.req.headers['user-agent'] ?? null;

    const { slug: rawSlug } = context.query;
    if (!rawSlug) {
      return { notFound: true };
    }
    const slug = decodeURIComponent(rawSlug as string);
    const university = themeConfing?.partnerKey as string;

    // Client navigations hit /_next/data — skip heavy SSR but keep slug + loading title for the tab.
    // (Global withCSR returned props:{} which made Seo render "| پذیرش24".)
    if (context.req.url?.startsWith('/_next')) {
      return { props: clientFetchFallbackProps(slug) };
    }

    let prefetchSamanAvailability = false;
    // Explicit false = legacy for this request (no second GB check in aggregator).
    let useProfileMicroservice = false;
    let fetchExpertiseKeywordTags = false;
    try {
      const host = getHost(context.req.headers as HeaderBag);
      const url = `https://${host}${context.resolvedUrl}`;
      const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
      const growthbook = new GrowthBook(growthbookContext);
      growthbook.setAttributes({ url, host, slug });
      await growthbook.loadFeatures({ timeout: 500 });
      prefetchSamanAvailability = growthbook.isOn('use-saman-availability-status');

      const { baseURL } = getProfileMicroserviceConfig();
      if (baseURL) {
        const apiSource = growthbook.getFeatureValue<{ slugs?: string[] }>(PROFILE_API_SOURCE_FEATURE_KEY, {
          slugs: [],
        });
        useProfileMicroservice = isSlugInProfileApiSourceAllowlist(apiSource?.slugs, slug);
      }
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
        useProfileMicroservice,
        fetchExpertiseKeywordTags,
      });

      const durationMs = Date.now() - ssrStartedAt;
      const httpStatus = context.res.statusCode || 200;
      void sendDoctorProfileEventServer(
        'profile_ssr',
        'success',
        {
          slug,
          path: context.resolvedUrl,
          duration_ms: durationMs,
          http_status: httpStatus,
          csr_fallback: false,
          doctor_id: (finalProps as any)?.props?.information?.id ?? null,
        },
        userAgent,
      );

      return {
        ...finalProps,
        props: sanitizeObject({
          ...finalProps?.props,
          expertiseChipsLikeSearchEnabled: fetchExpertiseKeywordTags,
          status: context.res.statusCode,
        }),
      };
    } catch (error) {
      const durationMs = Date.now() - ssrStartedAt;

      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const statusCode = status === 404 ? 410 : error.message.includes('timeout') || status === 504 ? 504 : status;
        const csrFallback = [500, 502, 504].includes(statusCode);

        await sendDoctorProfileEventServer(
          'profile_error',
          'profile_error',
          {
            endpoint: error?.config?.url,
            error_status: error.response?.status,
            error: error?.response?.data,
            message: error.message,
            handle_error_status: statusCode,
            http_status: statusCode,
            slug,
            path: context.resolvedUrl,
            stack: error?.stack,
            duration_ms: durationMs,
            csr_fallback: csrFallback,
          },
          userAgent,
        );

        void sendDoctorProfileEventServer(
          'profile_ssr',
          csrFallback ? 'csr_fallback' : 'error',
          {
            slug,
            path: context.resolvedUrl,
            duration_ms: durationMs,
            http_status: statusCode,
            csr_fallback: csrFallback,
            error_status: error.response?.status,
            message: error.message,
          },
          userAgent,
        );

        if (csrFallback) {
          console.warn(`SSR Timeout/Error for slug: ${slug}. Falling back to client-side rendering.`);
          return {
            props: clientFetchFallbackProps(slug),
          };
        }

        context.res.statusCode = statusCode;

        return handleSsrError(context.res.statusCode, slug);
      }

      trackSsrError(error, { source: 'ProfileSSR', message: 'A non-Axios error occurred in getProfileServerSideProps', path: context.resolvedUrl });
      context.res.statusCode = 500;

      await sendDoctorProfileEventServer(
        'profile_error',
        'profile_error_non_axios',
        {
          slug,
          path: context.resolvedUrl,
          message: error instanceof Error ? error.message : String(error),
          handle_error_status: 500,
          http_status: 500,
          duration_ms: durationMs,
          csr_fallback: false,
        },
        userAgent,
      );

      void sendDoctorProfileEventServer(
        'profile_ssr',
        'error',
        {
          slug,
          path: context.resolvedUrl,
          duration_ms: durationMs,
          http_status: 500,
          csr_fallback: false,
          message: error instanceof Error ? error.message : String(error),
        },
        userAgent,
      );

      return handleSsrError(context.res.statusCode, slug);
    }
  },
);
