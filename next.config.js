/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  ...nextTranslate(),
  reactStrictMode: false,
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    PAZIRESH24_API: process.env.PAZIRESH24_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
  },
  images: {
    domains: ['www.paziresh24.com'],
  },
};

module.exports = nextConfig;
