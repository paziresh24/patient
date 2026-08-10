import axios, { AxiosInstance } from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import getConfig from 'next/config';
import { isPWA } from '../utils/isPwa';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();
import http from 'http';
import https from 'https';

const isServer = typeof window === 'undefined';

export const httpAgent = new http.Agent({ keepAlive: true, timeout: 15_000 });
export const httpsAgent = new https.Agent({ keepAlive: true, timeout: 15_000 });

const baseConfig = {
  maxRedirects: 5,
  httpAgent,
  httpsAgent,
  transitional: { clarifyTimeoutError: true },
  ...(isServer && {
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    },
  }),
};


const attachServerErrorLogger = (client: AxiosInstance, source: string) => {
  if (!isServer) return client;
  client.interceptors.response.use(
    res => res,
    err => {
      // Skip expected auth refresh flows; still count real upstream failures.
      const status = err?.response?.status;
      if (status !== 401) {
        // Lazy require keeps this module client-bundle safe.
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { trackSsrError } = require('@/common/utils/ssrErrorTracker') as typeof import('@/common/utils/ssrErrorTracker');
        trackSsrError(err, {
          source,
          message: 'Upstream API request failed',
        });
      }
      return Promise.reject(err);
    },
  );
  return client;
};

export const paziresh24AppClient = axios.create({
  baseURL: serverRuntimeConfig.DOCTORS_BASE_URL ?? publicRuntimeConfig.DOCTORS_BASE_URL,
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  withCredentials: true,
  ...baseConfig,
});

export const feedbacksClient = axios.create({
  baseURL: publicRuntimeConfig.FEEDBACKS_BASE_URL,
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  timeout: 3000,
  withCredentials: true,
  ...baseConfig,
});

export const apiGatewayClient = axios.create({
  baseURL: publicRuntimeConfig.API_GATEWAY_BASE_URL ? publicRuntimeConfig.API_GATEWAY_BASE_URL : 'https://apigw.paziresh24.com',
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  withCredentials: true,
  ...baseConfig,
});

export const katibeApiClient = axios.create({
  baseURL: publicRuntimeConfig.KATIBE_API_BASE_URL ? publicRuntimeConfig.KATIBE_API_BASE_URL : 'https://katibe-api.paziresh24.com',
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  withCredentials: true,
  ...baseConfig,
});

export const raviApiClient = axios.create({
  baseURL: publicRuntimeConfig.RAVI_API_BASE_URL ? publicRuntimeConfig.RAVI_API_BASE_URL : 'https://ravi-api.paziresh24.com',
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  ...baseConfig,
});

export const raviApisClient = axios.create({
  baseURL:
    !isServer && process.env.NODE_ENV !== 'production'
      ? '/__dev-proxy/ravi-apis'
      : publicRuntimeConfig.RAVI_APIS_BASE_URL
        ? publicRuntimeConfig.RAVI_APIS_BASE_URL
        : 'https://ravi-apis.paziresh24.com',
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  withCredentials: true,
  ...baseConfig,
});

export const searchClient = axios.create({
  // Local browser: proxy via custom server.js (strips Origin). apigw returns [] for Origin=localhost.
  baseURL:
    !isServer && process.env.NODE_ENV !== 'production'
      ? '/__dev-proxy/search'
      : publicRuntimeConfig.SEARCH_BASE_URL
        ? publicRuntimeConfig.SEARCH_BASE_URL
        : 'https://apigw.paziresh24.com',
  withCredentials: true,
  ...baseConfig,
});

export const clinicClient = axios.create({
  baseURL: publicRuntimeConfig.CLINIC_BASE_URL ? publicRuntimeConfig.CLINIC_BASE_URL : 'https://www.paziresh24.com',
  withCredentials: true,
  ...baseConfig,
});

export const contentClient = axios.create({
  baseURL: publicRuntimeConfig.CONTENT_BASE_URL,
  ...baseConfig,
});

export const workflowClient = axios.create({
  baseURL: publicRuntimeConfig.WORKFLOW_BASE_URL,
  withCredentials: true,
  ...baseConfig,
});

export const hamdastClient = axios.create({
  baseURL: `https://hamdast.paziresh24.com`,
  withCredentials: true,
  ...baseConfig,
});

export const drProfileClient = axios.create({
  baseURL: `https://drprofile.paziresh24.com`,
  ...baseConfig,
  httpAgent: new http.Agent({ keepAlive: false }),
  httpsAgent: new https.Agent({ keepAlive: false }),
});

export const samanClient = axios.create({
  baseURL: publicRuntimeConfig.SAMAN_BASE_URL ?? 'https://saman.paziresh24.com',
  ...baseConfig,
});


attachServerErrorLogger(paziresh24AppClient, 'DoctorsAPI');
attachServerErrorLogger(feedbacksClient, 'FeedbacksAPI');
attachServerErrorLogger(apiGatewayClient, 'API_Gateway');
attachServerErrorLogger(katibeApiClient, 'KatibeAPI');
attachServerErrorLogger(raviApiClient, 'RaviAPI');
attachServerErrorLogger(raviApisClient, 'RaviAPIs');
attachServerErrorLogger(searchClient, 'SearchAPI');
attachServerErrorLogger(clinicClient, 'ClinicAPI');
attachServerErrorLogger(contentClient, 'ContentAPI');
attachServerErrorLogger(workflowClient, 'WorkflowAPI');
attachServerErrorLogger(hamdastClient, 'HamdastAPI');
attachServerErrorLogger(drProfileClient, 'DrProfileAPI');
attachServerErrorLogger(samanClient, 'SamanAPI');

clinicClient.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      if (window.user?.id) (config as any).headers['user_id'] = window.user?.id;
      (config as any).headers['terminal_id'] = getCookie('terminal_id');
    }
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
    }
    if (typeof Intl?.DateTimeFormat?.()?.resolvedOptions()?.timeZone == 'string') {
      (config as any).headers['accept-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    config = {
      ...config,
      meta: {
        requestStartedAt: new Date().getTime(),
      },
    } as any;
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

clinicClient.interceptors.response.use(
  res => {
    res = { ...res, meta: { responseTime: new Date().getTime() - (res.config as any).meta.requestStartedAt } } as any;
    return res;
  },
  err => {
    return Promise.reject(err);
  },
);

apiGatewayClient.interceptors.request.use(
  config => {
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
    }
    if (isPWA()) {
      (config as any).headers['isApplication'] = true;
    }
    if (typeof Intl?.DateTimeFormat?.()?.resolvedOptions()?.timeZone == 'string') {
      (config as any).headers['accept-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

paziresh24AppClient.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      if (window.user?.id) (config as any).headers['user_id'] = window.user?.id;
      (config as any).headers['terminal_id'] = getCookie('terminal_id');
    }
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
    }
    if (typeof Intl?.DateTimeFormat?.()?.resolvedOptions()?.timeZone == 'string') {
      (config as any).headers['accept-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

workflowClient.interceptors.response.use(
  res => {
    return res.data;
  },
  async err => {
    const originalRequest = err.config;
    if (err?.response?.status === 401) {
      try {
        const { data } = (await refresh()) as any;
        if (data.access_token) {
          setCookie('token', data.access_token);
          return workflowClient(originalRequest);
        }
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { trackSsrError } = require('@/common/utils/ssrErrorTracker') as typeof import('@/common/utils/ssrErrorTracker');
        trackSsrError(error, { source: 'WorkflowAPI', message: 'Token refresh failed' });
      }
    }
    return Promise.reject(err);
  },
);
