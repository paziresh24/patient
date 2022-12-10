/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');

const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
      }),
    );

    return config;
  },
  swcMinify: true,
  reactStrictMode: true,
  trailingSlash: true,
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    PAZIRESH24_API: process.env.PAZIRESH24_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
  },
  images: {
    domains: ['www.paziresh24.com', 'www.sepehrsalamat.ir'],
  },
  ...(isProduction && {
    sentry: {
      hideSourceMaps: false,
    },
  }),
};

const sentryWebpackPluginOptions = {
  silent: true,
};

const sentryConfig = isProduction ? withSentryConfig(nextConfig, sentryWebpackPluginOptions) : nextConfig;

module.exports = withBundleAnalyzer(nextTranslate(sentryConfig));
