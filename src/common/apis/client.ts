import axios from 'axios';
import getConfig from 'next/config';
import { splunkInstance } from '@/common/services/splunk';
import { refresh } from './services/auth/refresh';
const { publicRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: publicRuntimeConfig.PAZIRESH24_API,
  withCredentials: true,
});

export const clinicClient = axios.create({
  withCredentials: true,
  baseURL: `${publicRuntimeConfig.CLINIC_BASE_URL}`,
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
          splunkInstance.sendEvent({
            group: 'patient-app',
            type: 'error-refresh-token',
            event: {
              error: error.response?.data,
            },
          });
        }
        return window.location.replace(`${`${publicRuntimeConfig.CLINIC_BASE_URL}/signin/?url=${window.location.href}`}/auth`);
      }
    }
    return Promise.reject(error);
  },
);
