import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Params {
  user_id: string;
  is_doctor: boolean;
}

export const apps = (params: Params) => {
  return axios.get('/patient/api/apps/', { params });
};

export const useApps = (params: Params, option?: Record<string, any>) => useQuery(['app', params], () => apps(params), { ...option });
