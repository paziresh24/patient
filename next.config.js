/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  basePath: isProduction ? "/patient" : "",
};

module.exports = nextConfig;
