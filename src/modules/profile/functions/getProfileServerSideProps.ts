import { withServerUtils } from '@/common/hoc/withServerUtils';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { getAggregatedProfileData } from './getAggregatedProfileData'; // ۱. وارد کردن تابع مشترک
import axios from 'axios';
import { sanitizeObject } from '@/common/utils/sanitizeObject';
import { handleSsrError } from '@/common/utils/handleSsrError';
import { trackSsrError } from '@/common/utils/ssrErrorTracker';
import { getProfileMicroserviceConfig } from '@/common/apis/clients/profileMicroserviceClient';
import { isProfileMicroserviceAllowlistedSlug } from '@/modules/profile/utils/profileApiSourceAllowlist.server';
import { isExpertiseChipsLikeSearchEnabledForSlug } from '@/modules/profile/utils/expertiseChipsLikeSearchFlag';
import { sendDoctorProfileEventServer } from '@/modules/profile/events/nightBatEvents';
import {
  isPicUserImageUrl,
  resolveDoctorProfileLcpImageUrl,
} from '@/modules/profile/utils/doctorProfileImageUrl';

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

    let prefetchSamanAvailability = true;
    // Explicit false = legacy for this request (no second GB check in aggregator).
    let useProfileMicroservice = false;
    let fetchExpertiseKeywordTags = false;

    // Allowlist comes from GrowthBook via a dedicated cached loader,
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

    const [chipsEnabled, allowlisted] = await Promise.all([
      chipsFlagPromise,
      allowlistPromise,
    ]);
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
          // Allowlisted hybrid must not soft-shell into CSR legacy (that was the coin-flip).
          if (useProfileMicroservice) {
            console.warn(`SSR error for allowlisted MS slug: ${slug}. Serving error page (no legacy swap).`);
            context.res.statusCode = statusCode;
            return handleSsrError(context.res.statusCode, slug);
          }
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
          csr_fallback: !useProfileMicroservice,
        },
        userAgent,
      );

      void sendDoctorProfileEventServer(
        'profile_ssr',
        useProfileMicroservice ? 'error' : 'csr_fallback',
        {
          slug,
          path: context.resolvedUrl,
          duration_ms: durationMs,
          http_status: 500,
          csr_fallback: !useProfileMicroservice,
          message: error instanceof Error ? error.message : String(error),
        },
        userAgent,
      );

      if (useProfileMicroservice) {
        console.warn(`SSR non-Axios error for allowlisted MS slug: ${slug}. Serving error page (no legacy swap).`);
        context.res.statusCode = 500;
        return handleSsrError(500, slug);
      }

      // Soft-fail: keep the page up via CSR instead of a hard 500.
      console.warn(`SSR non-Axios error for slug: ${slug}. Falling back to client-side rendering.`);
      return {
        props: clientFetchFallbackProps(slug),
      };
    }
  },
);
