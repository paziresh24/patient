import axios from 'axios';
import { setCookie } from 'cookies-next';
import getConfig from 'next/config';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: publicRuntimeConfig.PAZIRESH24_API,
  withCredentials: true,
  validateStatus: status => (status >= 200 && status < 300) || status === 423,
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

apiGatewayClient.interceptors.response.use(
  async res => {
    return res;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      try {
        window.location.assign(`/login?redirect_url=${encodeURI(location.href)}`);
      } catch (error) {
        console.error(error);
      }
    }
    return Promise.reject(error);
  },
);

paziresh24AppClient.interceptors.response.use(
  async res => {
    if (res.data?.message === 'Unauthenticated!') {
      try {
        const { data } = await refresh();
        if (data.access_token) setCookie('token', data.access_token);
        return paziresh24AppClient(res.config);
      } catch (error) {
        return paziresh24AppClient(res.config);
      }
    }
    return res;
  },
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      try {
        const { data } = await refresh();
        if (data.access_token) setCookie('token', data.access_token);
        return paziresh24AppClient(originalRequest);
      } catch (error) {
        console.error(error);
      }
    }
    return Promise.reject(error);
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
