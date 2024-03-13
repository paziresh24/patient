import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import getConfig from 'next/config';
import { isPWA } from '../utils/isPwa';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig, serverRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: serverRuntimeConfig.DOCTORS_BASE_URL ?? publicRuntimeConfig.DOCTORS_BASE_URL,
  withCredentials: true,
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
});

export const feedbacksClient = axios.create({
  baseURL: publicRuntimeConfig.FEEDBACKS_BASE_URL,
  withCredentials: true,
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
  timeout: 3000,
});

export const apiGatewayClient = axios.create({
  baseURL: publicRuntimeConfig.API_GATEWAY_BASE_URL,
  withCredentials: true,
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
});

export const searchClient = axios.create({
  baseURL: publicRuntimeConfig.SEARCH_BASE_URL,
  withCredentials: true,
});

export const clinicClient = axios.create({
  baseURL: publicRuntimeConfig.CLINIC_BASE_URL,
  withCredentials: true,
});

export const contentClient = axios.create({
  baseURL: publicRuntimeConfig.CONTENT_BASE_URL,
  withCredentials: true,
});

export const workflowClient = axios.create({
  baseURL: publicRuntimeConfig.WORKFLOW_BASE_URL,
  withCredentials: true,
});

clinicClient.interceptors.request.use(
  config => {
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
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
    return config;
  },
  err => {
    return Promise.reject(err);
  },
);

paziresh24AppClient.interceptors.request.use(
  config => {
    if (getCookie('token')) {
      (config as any).headers['Authorization'] = 'Bearer ' + getCookie('token');
    }
    if (typeof window !== 'undefined' && window.localStorage?.getItem('fragment::previewToken')) {
      (config as any).headers['Authorization'] = 'Bearer ' + window.localStorage.getItem('fragment::previewToken');
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
