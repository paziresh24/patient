/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: false,
  assetPrefix: isProduction ? '/patient' : '',
  async rewrites() {
    return [
      {
        source: `${isProduction ? '/patient' : ''}/_next/:path*`,
        destination: '/_next/:path*',
      },
    ];
  },
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    PAZIRESH24_API: process.env.PAZIRESH24_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
  },
};

module.exports = nextConfig;
