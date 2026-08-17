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
import { isProfileMicroserviceAllowlistedSlug } from '@/modules/profile/utils/profileApiSourceAllowlist.server';
import { isExpertiseChipsLikeSearchEnabledForSlug } from '@/modules/profile/utils/expertiseChipsLikeSearchFlag';
import { sendDoctorProfileEventServer, sendProfileMicroserviceErrorEvent } from '@/modules/profile/events/nightBatEvents';
import {
  isPicUserImageUrl,
  resolveDoctorProfileLcpImageUrl,
} from '@/modules/profile/utils/doctorProfileImageUrl';

const MS_UNAVAILABLE_MESSAGE = 'اطلاعات این پزشک در حال به‌روزرسانی است. لطفاً کمی بعد دوباره تلاش کنید.';

const getErrorStatus = (error: unknown): number | undefined => {
  const maybe = error as { status?: number; response?: { status?: number } };
  return maybe?.response?.status ?? maybe?.status;
};

const resolveMicroservicePublicError = (error: unknown): { statusCode: number; message: string } => {
  const status = getErrorStatus(error);
  const message = error instanceof Error ? error.message : String(error);
  const timedOut = /timeout/i.test(message);
  if (
    status === 404 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    timedOut ||
    (typeof status === 'number' && status >= 500)
  ) {
    return { statusCode: 503, message: MS_UNAVAILABLE_MESSAGE };
  }
  return { statusCode: 500, message: MS_UNAVAILABLE_MESSAGE };
};

const serveMicroserviceErrorPage = (
  context: GetServerSidePropsContext,
  slug: string,
  error: unknown,
  extras: { durationMs: number; userAgent?: string | null },
) => {
  const { statusCode, message } = resolveMicroservicePublicError(error);
  const apiStatus = getErrorStatus(error) ?? null;
  const axiosError = axios.isAxiosError(error) ? error : null;

  context.res.statusCode = statusCode;
  context.res.setHeader('Cache-Control', 'private, no-store');
  if (statusCode === 503) {
    context.res.setHeader('Retry-After', '120');
  }

  void sendProfileMicroserviceErrorEvent(
    {
      slug,
      path: context.resolvedUrl,
      api_status: apiStatus,
      http_status: statusCode,
      message: error instanceof Error ? error.message : String(error),
      duration_ms: extras.durationMs,
      endpoint: axiosError?.config?.url ?? null,
    },
    extras.userAgent,
  );

  void sendDoctorProfileEventServer(
    'profile_ssr',
    'ms_unavailable',
    {
      slug,
      path: context.resolvedUrl,
      duration_ms: extras.durationMs,
      http_status: statusCode,
      api_status: apiStatus,
      csr_fallback: false,
      profile_backend: 'microservice',
      message: error instanceof Error ? error.message : String(error),
    },
    extras.userAgent,
  );

  return handleSsrError(statusCode, slug, {
    message,
    noIndex: true,
    profile_backend: 'microservice',
  });
};

const clientFetchFallbackProps = (slug: string, extras?: Record<string, unknown>) =>
  sanitizeObject({
    slug,
    shouldFetchOnClient: true,
    // Soft shell only — never indexable; real title/description arrive after client fetch.
    noIndex: true,
    status: 200,
    title: '',
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
    profile_backend: 'legacy',
    profile_fallback_reason: 'client_soft_shell',
    ...extras,
  });

export const getProfileServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    // Longer shared-cache window for edge TTFB; SWR keeps serving while revalidating.
    // DevOps: CDN must honor s-maxage (not strip Cache-Control) for this to help origin TTFB.
    context.res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120');
    const ssrStartedAt = Date.now();
    const userAgent = context.req.headers['user-agent'] ?? null;

    const { slug: rawSlug } = context.query;
    if (!rawSlug) {
      return { notFound: true };
    }
    const slug = decodeURIComponent(rawSlug as string);
    const university = themeConfing?.partnerKey as string;

    let prefetchSamanAvailability = false;
    // Explicit false = legacy for this request (no second GB check in aggregator).
    let useProfileMicroservice = false;
    let fetchExpertiseKeywordTags = false;

    // Allowlist comes from GrowthBook via a dedicated cached loader (not the 500ms Saman GB load),
    // so editing GB still works and SSR does not coin-flip to full legacy on slow GB/CDN.
    const allowlistPromise = (async () => {
      try {
        const { baseURL } = getProfileMicroserviceConfig();
        if (!baseURL) return false;
        return await isProfileMicroserviceAllowlistedSlug(slug);
      } catch (error) {
        trackSsrError(error, {
          source: 'ProfileSSR',
          message: 'Error resolving profile.api-source-by-slug allowlist',
          path: context.resolvedUrl,
        });
        return false;
      }
    })();

    // Client navigations hit /_next/data — soft shell is OK for legacy, but allowlisted doctors
    // must stay on the hybrid/MS path (CSR always forced legacy before and confused ops).
    const isNextData = !!context.req.url?.startsWith('/_next');
    if (isNextData) {
      const allowlisted = await allowlistPromise;
      if (!allowlisted) {
        return { props: clientFetchFallbackProps(slug) };
      }
      // Fall through to full SSR hybrid for allowlisted slugs.
    }

    // Run Saman GB (short timeout), allowlist cache, and chips GB in parallel.
    const profileFlagsPromise = (async () => {
      try {
        const host = getHost(context.req.headers as HeaderBag);
        const url = `https://${host}${context.resolvedUrl}`;
        const growthbookContext = getServerSideGrowthBookContext(context.req as NextApiRequest);
        const growthbook = new GrowthBook(growthbookContext);
        growthbook.setAttributes({ url, host, slug });
        await growthbook.loadFeatures({ timeout: 500 });
        return { samanOn: growthbook.isOn('use-saman-availability-status') };
      } catch (error) {
        trackSsrError(error, {
          source: 'ProfileSSR',
          message: 'Error loading GrowthBook for Saman availability SSR',
          path: context.resolvedUrl,
        });
        return { samanOn: false };
      }
    })();

    const chipsFlagPromise = (async () => {
      try {
        return await isExpertiseChipsLikeSearchEnabledForSlug(slug);
      } catch (error) {
        trackSsrError(error, {
          source: 'ProfileSSR',
          message: 'Error resolving profile.expertise-chips-like-search',
          path: context.resolvedUrl,
        });
        return false;
      }
    })();

    const [profileFlags, chipsEnabled, allowlisted] = await Promise.all([
      profileFlagsPromise,
      chipsFlagPromise,
      allowlistPromise,
    ]);
    prefetchSamanAvailability = profileFlags.samanOn;
    useProfileMicroservice = allowlisted;
    fetchExpertiseKeywordTags = chipsEnabled;

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
      const props = (finalProps as any)?.props ?? {};
      const lcpImageUrl = resolveDoctorProfileLcpImageUrl(props.information, props.user_id);
      if (isPicUserImageUrl(lcpImageUrl)) {
        // HTTP Link preload reaches the browser before HTML parse finishes (helps LCP).
        context.res.setHeader('Link', `<${lcpImageUrl}>; rel=preload; as=image`);
      }

      void sendDoctorProfileEventServer(
        'profile_ssr',
        'success',
        {
          slug,
          path: context.resolvedUrl,
          duration_ms: durationMs,
          http_status: httpStatus,
          csr_fallback: false,
          doctor_id: props?.information?.id ?? null,
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

      // MS-only: never swap to legacy; public 503 + dedicated Splunk counter.
      if (useProfileMicroservice) {
        console.warn(`SSR error for allowlisted MS slug: ${slug}. Serving unavailable page (no legacy swap).`);
        return serveMicroserviceErrorPage(context, slug, error, { durationMs, userAgent });
      }

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
          csr_fallback: true,
        },
        userAgent,
      );

      void sendDoctorProfileEventServer(
        'profile_ssr',
        'csr_fallback',
        {
          slug,
          path: context.resolvedUrl,
          duration_ms: durationMs,
          http_status: 500,
          csr_fallback: true,
          message: error instanceof Error ? error.message : String(error),
        },
        userAgent,
      );

      // Soft-fail: keep the page up via CSR instead of a hard 500.
      console.warn(`SSR non-Axios error for slug: ${slug}. Falling back to client-side rendering.`);
      return {
        props: clientFetchFallbackProps(slug),
      };
    }
  },
);
