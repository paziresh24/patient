import axios from 'axios';
import getConfig from 'next/config';
import { splunkInstance } from '../services/splunk';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: 'https://api.paziresh24.com',
  withCredentials: true,
});

export const searchClient = axios.create({
  baseURL: 'https://www.paziresh24.com',
  withCredentials: true,
});

export const clinicClient = axios.create({
  baseURL: 'https://www.paziresh24.com',
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
