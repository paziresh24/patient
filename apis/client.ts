import axios from 'axios';
import { refresh } from './auth/refresh/api';

export const paziresh24AppClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PAZIRESH24_API,
    withCredentials: true
});

export const clinicClient = axios.create({
    withCredentials: true,
    baseURL: `${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/api`
});

export const prescriptionClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_PRESCRIPTION_API
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
                return window.location.replace(
                    `${`${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/signin/?url=${window.location.href}`}/auth`
                );
            }
        }
        return Promise.reject(error);
    }
);
