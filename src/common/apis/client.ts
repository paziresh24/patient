import axios, { AxiosRequestConfig } from 'axios';
import { getCookie } from 'cookies-next';
import getConfig from 'next/config';
import { splunkInstance } from '../services/splunk';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: publicRuntimeConfig.PAZIRESH24_API,
  withCredentials: true,
});

export const clinicClient = axios.create({
  baseURL: `${publicRuntimeConfig.CLINIC_BASE_URL}`,
});

paziresh24AppClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (getCookie('token'))
      config.headers = {
        Authorization: `Bearer ${getCookie('token')}`,
      };
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

paziresh24AppClient.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      try {
        await refresh();
        return paziresh24AppClient(originalRequest);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          splunkInstance().sendEvent({
            group: 'patient-app',
            type: 'error-refresh-token',
            event: {
              error: error.response?.data,
            },
          });
        }
      }
    }
    return Promise.reject(error);
  },
);
