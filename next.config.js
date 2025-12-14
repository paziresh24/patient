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
  productionBrowserSourceMaps: true,
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB'],
    optimizePackageImports: [
      '@plasmicpkgs/antd5',
      '@plasmicpkgs/plasmic-basic-components',
      '@plasmicpkgs/plasmic-rich-components',
      '@plasmicapp/react-web',
      'antd',
      '@ant-design/icons',
      '@ant-design/pro-components',
      'lodash',
      'lucide-react',
    ],
  },
  modularizeImports: {
    '@ant-design/icons': {
      transform: '@ant-design/icons/lib/icons/{{member}}',
    },
    'antd': {
      transform: 'antd/lib/{{kebabCase member}}',
    },
    '@ant-design/pro-components': {
      transform: '@ant-design/pro-components/lib/{{member}}',
      skipDefaultConversion: true,
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
  transpilePackages: [
    '@plasmicpkgs/antd5',
    '@plasmicpkgs/plasmic-rich-components',
    'antd',
    '@ant-design/icons',
    '@ant-design/pro-components',
    '@ant-design/cssinjs',
    '@ant-design/icons-svg',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-table',
    'rc-tree',
    'rc-input',
  ],
  compress: true,
  poweredByHeader: false,
  webpack: (config, { webpack, isServer }) => {
    config.module.rules.push({
      test: [/lib\/.*.tsx?/i],
      sideEffects: false,
    });

    config.module.rules.push({
      test: /[\\/]node_modules[\\/](antd|@ant-design|@plasmicpkgs)[\\/].*\.(js|mjs|jsx|ts|tsx)$/,
      sideEffects: false,
    });

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@ant-design/icons/lib/dist$': '@ant-design/icons/lib/icons',
      };
    }

    // بهینه‌سازی webpack splitChunks
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: true,
      moduleIds: 'deterministic',
      usedExports: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 4,
            priority: 5,
          },
          antdIcons: {
            test: /[\\/]node_modules[\\/]@ant-design[\\/]icons/,
            name: 'antd-icons',
            chunks: 'all',
            priority: 40,
            reuseExistingChunk: true,
          },
          antdCore: {
            test: /[\\/]node_modules[\\/](antd|@ant-design[\\/]cssinjs|rc-)/,
            name: 'antd-core',
            chunks: 'all',
            priority: 35,
            reuseExistingChunk: true,
          },
          antdPro: {
            test: /[\\/]node_modules[\\/]@ant-design[\\/]pro-components/,
            name: 'antd-pro',
            chunks: 'async',
            priority: 32,
            reuseExistingChunk: true,
          },
          plasmicAntd: {
            test: /[\\/]node_modules[\\/]@plasmicpkgs[\\/]antd5/,
            name: 'plasmic-antd',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
          plasmic: {
            test: /[\\/]node_modules[\\/](@plasmicapp|@plasmicpkgs)[\\/](?!antd5)/,
            name: 'plasmic',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/](?!html2pdf\.js|html2canvas|jspdf|leaflet|react-leaflet|recharts|react-hook-form|jalali-moment)/,
            name: 'lib',
            chunks: 'all',
            priority: 10,
          },
          lodash: {
            test: /[\\/]node_modules[\\/]lodash/,
            name: 'lodash',
            chunks: 'async',
            priority: 50,
          },
          moment: {
            test: /[\\/]node_modules[\\/]moment/,
            name: 'moment',
            chunks: 'async',
            priority: 50,
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design|@plasmicpkgs\/antd5|rc-)/,
            name: 'antd',
            priority: 20,
            chunks: 'all',
            enforce: true,
          },
          swr: {
            test: /[\\/]node_modules[\\/]swr/,
            name: 'swr',
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
