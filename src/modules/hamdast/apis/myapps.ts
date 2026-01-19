import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  type: string;
}

export const getMyApps = ({ type }: Params) => {
  return axios.get(`https://apigw.paziresh24.com/v1/hamdast/myapps`, { params: { type }, withCredentials: true });
};

export const useGetMyApps = (data: Params, options?: any) => {
  return useQuery(['getMyApps', data], () => getMyApps(data), options);
};
