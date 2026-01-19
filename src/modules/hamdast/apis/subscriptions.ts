import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  appKey: string;
}

export const getSubscriptions = ({ appKey }: Params) => {
  return axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${appKey}/subscriptions`, { withCredentials: true });
};

export const useGetSubscriptions = (data: Params, options?: any) => {
  return useQuery(['getSubscriptions', data], () => getSubscriptions(data), options);
};
