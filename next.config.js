/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');
const { withSentryConfig } = require('@sentry/nextjs');
const runtimeCaching = require('./runtimeCaching');

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
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );

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
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    CONTENT_BASE_URL: process.env.CONTENT_BASE_URL,
    PAZIRESH24_API: process.env.PAZIRESH24_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
    PARTNER_LOGO_BASE_URL: process.env.PARTNER_LOGO_BASE_URL,
    GROWTHBOOK_API_HOST: process.env.GROWTHBOOK_API_HOST,
    GROWTHBOOK_CLIENT_KEY: process.env.GROWTHBOOK_CLIENT_KEY,
  },
  images: {
    unoptimized: true,
    domains: ['www.paziresh24.com', 'www.sepehrsalamat.ir'],
  },
  async redirects() {
    return [
      {
        source: '/receipt/:id/',
        destination: '/receipt/5532/:id/',
        permanent: true,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
};

const moduleExports = () => plugins.reduce((acc, next) => next(acc), nextConfig);

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  nextConfig.sentry = {
    hideSourceMaps: true,
  };
}

// Sentry should be the last thing to export to catch everything right
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN ? withSentryConfig(moduleExports, sentryWebpackPluginOptions) : moduleExports;
