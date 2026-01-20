import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  user_id: string;
}

export const getWidgets = ({ user_id }: Params) => {
  return axios.get(`https://hamdast.paziresh24.com/api/v1/widgets/?user_id=${user_id}`, { withCredentials: true });
};

export const useGetWidgets = (data: Params, options?: any) => {
  return useQuery(['getWidgets', data], () => getWidgets(data), options);
};
