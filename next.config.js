/** @type {import('next').NextConfig} */

const nextTranslate = require('next-translate');
const { withSentryConfig } = require('@sentry/nextjs');

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
  eslint: {
    ignoreDuringBuilds: true,
  },
  productionBrowserSourceMaps: true,
  experimental: {
    instrumentationHook: true,
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
    '@plasmicpkgs/plasmic-rich-components',
  ],
  compress: true,
  poweredByHeader: false,
  webpack: (config, { isServer, dev }) => {
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

    // splitChunks فقط در production — در dev کامپایل را خیلی کند می‌کند
    if (dev) {
      return config;
    }

    // بهینه‌سازی webpack splitChunks
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
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
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design|rc-)/,
            name: 'antd',
            chunks: 'all',
            priority: 40,
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
          // DR-08 §۱۲ (ghane/docs/dev-requests/dr-08-listing-pagespeed.md) — firebase فقط از پشتِ یک
          // dynamic import مصرف می‌شود (src/firebase/analytics.ts، گیتِ isPWA()/IS_FIREBASE_ENABLE).
          // این گروه با chunks:'async' تضمین می‌کند هرگز داخلِ chunkِ initial ننشیند.
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'firebase',
            chunks: 'async',
            priority: 60,
            reuseExistingChunk: true,
          },
          // DR-08 §۱۲ — چرا name دیگر ثابت نیست:
          // یک cacheGroupِ با نامِ ثابتِ `lib` + `chunks: 'all'` همه‌ی node_modulesها را — چه آن‌هایی که
          // کدِ initial لازم دارد و چه آن‌هایی که فقط از پشتِ یک dynamic import قابل‌دسترس‌اند — در
          // **یک** chunk ادغام می‌کند. کافی است یک ماژولِ آن chunk برای رندرِ اولیه لازم باشد تا مرورگر
          // کلِ آن را eager دانلود/parse کند. اندازه‌گیریِ زنده‌ی 2026-07-28 روی production:
          // `lib-*.js` = ۶۳۱KB transfer / ۲.۱MB خام، `<script defer>`ِ صفحه‌ی `/s/*`، **۹.۱ ثانیه
          // script-time**، ۴۳۹KB unused — و `@firebase/analytics@0.10.0` با این‌که پس از فیکسِ قبلیِ
          // DR-08 دیگر هرگز execute نمی‌شد، همچنان داخلش حمل می‌شد (هزینه‌ی دانلود/parse سرِ جایش بود).
          // نام‌گذاریِ per-package (همان الگویی که خودِ Next برای کتابخانه‌های بزرگ دارد) این ادغام را
          // می‌شکند: هر پکیج chunkِ خودش را می‌گیرد، پس فقط پکیج‌هایی initial می‌مانند که واقعاً از
          // مسیرِ initial رفرنس شده‌اند.
          // مرزِ اعتبار: پکیج‌های کوچک‌تر از minSize همچنان split نمی‌شوند و در chunkِ والد/`commons`
          // می‌مانند — عمدی، تا تعدادِ درخواستِ initial منفجر نشود (maxInitialRequests: 25).
          lib: {
            test: /[\\/]node_modules[\\/](?!html2pdf\.js|html2canvas|jspdf|leaflet|react-leaflet|recharts|react-hook-form|jalali-moment)/,
            name(module) {
              const context = module.context || module.resource || '';
              const matched = context.match(/[\\/]node_modules[\\/](@[^\\/]+[\\/][^\\/]+|[^\\/]+)/);
              const packageName = matched ? matched[1].replace(/[\\/]/g, '-').replace(/^@/, '') : 'vendor';
              return `lib-${packageName}`;
            },
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
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
    // Profile microservice (GrowthBook profile.api-source-by-slug → these APIs)
    PROFILE_API_BASE_URL: process.env.PROFILE_API_BASE_URL || '',
    PROFILE_API_TOKEN: process.env.PROFILE_API_TOKEN || '',
    PROFILE_API_SOURCE_SLUGS: process.env.PROFILE_API_SOURCE_SLUGS || '',
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
    VOICE_API_BASE_URL: process.env.VOICE_API_BASE_URL || process.env.NEXT_PUBLIC_VOICE_API_BASE_URL,
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
    RAVI_API_BASE_URL: process.env.RAVI_API_BASE_URL,
    RAVI_APIS_BASE_URL: process.env.RAVI_APIS_BASE_URL,
    RAVI_IFRAME_BASE_URL: process.env.RAVI_IFRAME_BASE_URL,
    PLASMIC_PROJECT_ID: process.env.PLASMIC_PROJECT_ID,
    PLASMIC_PROJECT_TOKEN: process.env.PLASMIC_PROJECT_TOKEN,
    PLASMIC_PREVIEW: process.env.PLASMIC_PREVIEW,
    CDN_BASE_URL: process.env.CDN_BASE_URL,
    SAMAN_BASE_URL: process.env.SAMAN_BASE_URL,
    NO_INDEX: process.env.NO_INDEX,
    DESABLED_GTM: process.env.DESABLED_GTM,
    FULL_PROFILE_API_URL: process.env.FULL_PROFILE_API_URL,
    PROFILE_API_BASE_URL: process.env.PROFILE_API_BASE_URL || '',
    PROFILE_API_TOKEN: process.env.PROFILE_API_TOKEN || '',
    PROFILE_API_SOURCE_SLUGS: process.env.PROFILE_API_SOURCE_SLUGS || '',
    // DR-11 conversational layer. These MUST live here and not as `NEXT_PUBLIC_*`
    // read from client code: the Dockerfile runs `npm run build` with no build
    // args, so a NEXT_PUBLIC_* value inlines as `undefined` in the production
    // bundle — the flag could never be turned on and there would be no
    // seconds-level kill-switch. publicRuntimeConfig is read from the process env
    // at server start, so flipping it is a pod restart, not a rebuild.
    CHAT_MVP_ENABLED: process.env.CHAT_MVP_ENABLED,
    CHAT_MVP_PREVIEW_KEY: process.env.CHAT_MVP_PREVIEW_KEY,
    CHAT_API_BASE: process.env.CHAT_API_BASE,
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
      {
        source: '/home/privacy-policy/',
        destination: '/privacy-policy/',
        permanent: true,
      },
      {
        source: '/home/faq/',
        destination: '/faq/',
        permanent: true,
      },
      {
        source: '/home/contact-us/',
        destination: '/contact-us/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const rules = [
      { source: '/patient/api/:path*', destination: '/api/:path*' },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];

    // Browser calls to ravi-apis are CORS-blocked from localhost / local.paziresh24.com
    // (allowlist is only www.paziresh24.com). Proxy same-origin in local dev.
    if (!isProduction) {
      rules.push({
        source: '/__dev-proxy/ravi-apis/:path*',
        destination: 'https://ravi-apis.paziresh24.com/:path*',
      });
    }

    return rules;
  },
  async headers() {
    return [
      {
        // DR-13: صفحه‌ی static «نظر شما برای ما مهم است» — long-cache روی CDN، revalidate روزانه در مرورگر
        source: '/rate-us/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

const moduleExports = () => plugins.reduce((acc, next) => next(acc), nextConfig);

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
};

// Sentry webpack plugin فقط در production — در dev کامپایل را کند می‌کند
module.exports = isProduction
  ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
  : moduleExports();
