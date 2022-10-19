/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');

const isProduction = process.env.NODE_ENV === 'production';

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  ...nextTranslate(),
  swcMinify: true,
  reactStrictMode: false,
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    PAZIRESH24_API: process.env.PAZIRESH24_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
    SEARCH_BASE_URL: process.env.SEARCH_BASE_URL,
  },
  images: {
    domains: ['www.paziresh24.com'],
  },
  ...nextTranslate(),
};

module.exports = withBundleAnalyzer(nextConfig);
