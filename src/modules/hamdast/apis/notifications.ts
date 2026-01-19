import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {}

export const getNotifications = () => {
  return axios.get(`https://apigw.paziresh24.com/v1/hamdast/notifications`, { withCredentials: true });
};

export const useGetNotifications = (data?: Params, options?: any) => {
  return useQuery(['getNotifications'], getNotifications, options);
};
