/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');
const runtimeCaching = require('./runtimeCaching');
const { withSentryConfig } = require('@sentry/nextjs');

const isProduction = process.env.NODE_ENV === 'production';

const withPWA = require('next-pwa')({
  disable: !isProduction,
  dest: 'public',
  register: true,
  runtimeCaching,
});

const plugins = [nextTranslate, withPWA];

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
    MATOMO_URL: process.env.MATOMO_URL,
    MATOMO_SITE_ID: process.env.MATOMO_SITE_ID,
    FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
  images: {
    domains: ['www.paziresh24.com', 'www.paziresh24.dev', 'www.sepehrsalamat.ir', 'clinic-s3.paziresh24.com'],
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
    return [{ source: '/patient/api/:path*', destination: '/api/:path*' }];
  },
};

const moduleExports = () => plugins.reduce((acc, next) => next(acc), nextConfig);

const sentryWebpackPluginOptions = {
  silent: true,
};

// Sentry should be the last thing to export to catch everything right
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN ? withSentryConfig(moduleExports, sentryWebpackPluginOptions) : moduleExports;
