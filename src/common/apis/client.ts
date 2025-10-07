import axios from 'axios';
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

export const searchClient = axios.create({
  baseURL: publicRuntimeConfig.SEARCH_BASE_URL ? publicRuntimeConfig.SEARCH_BASE_URL : 'https://apigw.paziresh24.com',
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
    // Add token if available
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    
    // Add preview token if available
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
    }
    
    // Add PWA header if applicable
    if (isPWA()) {
      (config as any).headers['isApplication'] = true;
    }
    
    // Add timezone if available
    if (typeof Intl?.DateTimeFormat?.()?.resolvedOptions()?.timeZone == 'string') {
      (config as any).headers['accept-timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    
    // Add CORS headers for proper cross-origin requests
    if (typeof window !== 'undefined') {
      // Add origin header to match working requests
      (config as any).headers['origin'] = window.location.origin;
      
      // Add proper accept headers
      if (!(config as any).headers['Accept']) {
        (config as any).headers['Accept'] = 'application/json, text/plain, */*';
      }
      
      // Add fetch-related headers - use 'cross-site' for external API calls
      (config as any).headers['sec-fetch-dest'] = 'empty';
      (config as any).headers['sec-fetch-mode'] = 'cors';
      (config as any).headers['sec-fetch-site'] = 'cross-site';
    }
    
    // Add user_id and terminal_id only if available (to prevent console errors)
    if (typeof window !== 'undefined') {
      try {
        if (window.user?.id) {
          (config as any).headers['user_id'] = window.user.id;
        }
        const terminalId = getCookie('terminal_id');
        if (terminalId) {
          (config as any).headers['terminal_id'] = terminalId;
        }
      } catch (error) {
        // Silently ignore user context errors for map search
        console.debug('User context not available:', error);
      }
    }
    
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

paziresh24AppClient.interceptors.request.use(
  config => {
    // Safely handle user context
    if (typeof window !== 'undefined') {
      try {
        if (window.user?.id) {
          (config as any).headers['user_id'] = window.user.id;
        }
        const terminalId = getCookie('terminal_id');
        if (terminalId) {
          (config as any).headers['terminal_id'] = terminalId;
        }
      } catch (error) {
        // Silently ignore user context errors
        console.debug('User context not available:', error);
      }
    }
    
    // Add authentication token
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    
    // Add preview token if available
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
    }
    
    // Add timezone if available
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
        console.error(error);
      }
    }
    return Promise.reject(err);
  },
);
