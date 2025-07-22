import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  app_id: string;
}

export const getWidgetInfo = ({ app_id }: Params) => {
  return axios.get(`https://hamdast.paziresh24.com/api/v1/apps/${app_id}/widgets/info/`, { withCredentials: true });
};

export const useGetWidgetInfo = (data: Params, options: any) => {
  return useQuery(['getWidget', data], () => getWidgetInfo(data), options);
};
