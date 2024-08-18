import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const oneApp = ({ appKey, pageKey }: { appKey: string; pageKey: string }) => {
  return axios.get(`https://hamdast.paziresh24.com/api/v1/apps/${appKey}/pages/${pageKey}`, { withCredentials: true });
};

export const useOneApp = (params: { appKey: string; pageKey: string }, option?: Record<string, any>) =>
  useQuery(['app', params], () => oneApp(params), { ...option });
