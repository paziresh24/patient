import axios from 'axios';
import getConfig from 'next/config';
import { splunkInstance } from '../services/splunk';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: publicRuntimeConfig.PAZIRESH24_API,
  withCredentials: true,
});

export const searchClinet = axios.create({
  baseURL: publicRuntimeConfig.SEARCH_BASE_URL,
  withCredentials: true,
});

export const clinicClient = axios.create({
  baseURL: publicRuntimeConfig.CLINIC_BASE_URL,
  withCredentials: true,
});

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
