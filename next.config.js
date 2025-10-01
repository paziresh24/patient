/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');
const isProduction = process.env.NODE_ENV === 'production';

const plugins = [nextTranslate];

if (process.env.ANALYZE === 'true') {
  // only load dependency if env `ANALYZE` was set
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  plugins.push(withBundleAnalyzer);
}

const nextConfig = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB'],
    instrumentationHook: true,
  },
  webpack: (config, { webpack }) => {
    /**
     * TODO: Find more possible barrels for this project.
     *  @see https://github.com/vercel/next.js/issues/12557#issuecomment-1196931845
     **/
    config.module.rules.push({
      test: [/lib\/.*.tsx?/i],
      sideEffects: false,
    });

    return config;
  },
  swcMinify: true,
  reactStrictMode: true,
  trailingSlash: true,
  serverRuntimeConfig: {
    DOCTORS_BASE_URL: process.env.DOCTORS_BASE_URL,
    FULL_PROFILE_API_URL: process.env.FULL_PROFILE_API_URL,
  },
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    API_GATEWAY_BASE_URL: process.env.API_GATEWAY_BASE_URL,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    CONTENT_BASE_URL: process.env.CONTENT_BASE_URL,
    DOCTORS_BASE_URL: process.env.NEXT_PUBLIC_DOCTORS_BASE_URL,
    FEEDBACKS_BASE_URL: process.env.FEEDBACKS_BASE_URL,
    NEXT_PUBLIC_FEEDBACKS_API: process.env.NEXT_PUBLIC_FEEDBACKS_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
    PARTNER_LOGO_BASE_URL: process.env.PARTNER_LOGO_BASE_URL,
    DOCTOR_APP_BASE_URL: process.env.DOCTOR_APP_BASE_URL,
    IS_FIREBASE_ENABLE: process.env.IS_FIREBASE_ENABLE,
    WORKFLOW_BASE_URL: process.env.WORKFLOW_BASE_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SENTRY_URL: process.env.SENTRY_URL,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    GROWTHBOOK_API_HOST: process.env.GROWTHBOOK_API_HOST,
    GROWTHBOOK_CLIENT_KEY: process.env.GROWTHBOOK_CLIENT_KEY,
    GROWTHBOOK_DEV_MODE: process.env.GROWTHBOOK_DEV_MODE,
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    RAVI_BASE_URL: process.env.RAVI_BASE_URL,
    RAVI_IFRAME_BASE_URL: process.env.RAVI_IFRAME_BASE_URL,
    PLASMIC_PROJECT_ID: process.env.PLASMIC_PROJECT_ID,
    PLASMIC_PROJECT_TOKEN: process.env.PLASMIC_PROJECT_TOKEN,
    PLASMIC_PREVIEW: process.env.PLASMIC_PREVIEW,
    CDN_BASE_URL: process.env.CDN_BASE_URL,
    NO_INDEX: process.env.NO_INDEX,
    DESABLED_GTM: process.env.DESABLED_GTM,
    FULL_PROFILE_API_URL: process.env.FULL_PROFILE_API_URL,
    NEXT_PUBLIC_GRAFANA_FARO_URL: process.env.NEXT_PUBLIC_GRAFANA_FARO_URL,
    NEXT_PUBLIC_GRAFANA_FARO_APP: process.env.NEXT_PUBLIC_GRAFANA_FARO_APP,
    NEXT_PUBLIC_FARO_APP_NAMESPACE: process.env.NEXT_PUBLIC_FARO_APP_NAMESPACE,
    OTEL_EXPORTER_OTLP_ENDPOINT: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    OTEL_EXPORTER_OTLP_PROTOCOL: process.env.OTEL_EXPORTER_OTLP_PROTOCOL,
    OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
    OTEL_RESOURCE_ATTRIBUTES: process.env.OTEL_RESOURCE_ATTRIBUTES,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.paziresh24.**',
        port: '',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/receipt/:id/',
        destination: '/receipt/5532/:id/',
        permanent: true,
      },
      {
        source: '/apphome/.well-known/assetlinks.json',
        destination: '/.well-known/assetlinks.json',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/patient/api/:path*', destination: '/api/:path*' },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
};

const moduleExports = () => plugins.reduce((acc, next) => next(acc), nextConfig);

module.exports = moduleExports;
