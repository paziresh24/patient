import axios from "axios";
import getConfig from "next/config";
import { refresh } from "./auth/refresh/api";
const { publicRuntimeConfig } = getConfig();

export const paziresh24AppClient = axios.create({
  baseURL: publicRuntimeConfig.PAZIRESH24_API,
  withCredentials: true,
});

export const clinicClient = axios.create({
  withCredentials: true,
  baseURL: `${publicRuntimeConfig.CLINIC_BASE_URL}/api`,
});

export const prescriptionClient = axios.create({
  baseURL: publicRuntimeConfig.PRESCRIPTION_API,
});

paziresh24AppClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      try {
        await refresh();
        return paziresh24AppClient(originalRequest);
      } catch (error) {
        return window.location.replace(
          `${`${publicRuntimeConfig.CLINIC_BASE_URL}/signin/?url=${window.location.href}`}/auth`
        );
      }
    }
    return Promise.reject(error);
  }
);
