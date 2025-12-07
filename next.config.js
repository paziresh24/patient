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
  },
  compress: true,
  poweredByHeader: false,
  webpack: (config, { webpack }) => {
    /**
     * TODO: Find more possible barrels for this project.
     *  @see https://github.com/vercel/next.js/issues/12557#issuecomment-1196931845
     **/
    config.module.rules.push({
      test: [/lib\/.*.tsx?/i],
      sideEffects: false,
    });

    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: true,
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name: 'lib',
            priority: 10,
            chunks: 'all',
            exclude: /[\\/]node_modules[\\/](html2pdf\.js|jspdf|html2canvas|antd|@ant-design|@plasmicpkgs\/antd5|rc-)/,
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design|@plasmicpkgs\/antd5|rc-)/,
            name: 'antd',
            priority: 20,
            chunks: 'all',
            enforce: true,
          },
          pdfLibraries: {
            test: /[\\/]node_modules[\\/](html2pdf\.js|jspdf|html2canvas)/,
            name: 'pdf-libraries',
            priority: 20,
            chunks: 'async',
            enforce: true,
          },
        },
      },
    };

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
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.paziresh24.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.arvanstorage.**',
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

// Sentry should be the last thing to export to catch everything right
module.exports = moduleExports;
