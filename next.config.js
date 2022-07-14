/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: false,
  basePath: isProduction ? "/patient" : "",
  output: "standalone",
  publicRuntimeConfig: {
    IS_PRODUCTION: isProduction,
    CLINIC_BASE_URL: process.env.CLINIC_BASE_URL,
    PAZIRESH24_API: process.env.PAZIRESH24_API,
    PRESCRIPTION_API: process.env.PRESCRIPTION_API,
  },
};

module.exports = nextConfig;
