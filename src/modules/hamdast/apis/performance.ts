import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  appKey: string;
}

export const getPerformance = ({ appKey }: Params) => {
  return axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${appKey}/performance`, { withCredentials: true });
};

export const useGetPerformance = (data: Params, options?: any) => {
  return useQuery(['getPerformance', data], () => getPerformance(data), options);
};
