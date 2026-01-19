import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  id: string;
}

export const markAsRead = (params: Params) => {
  return axios.patch(`https://apigw.paziresh24.com/v1/hamdast/notifications/mark-as-read/${params.id}`, undefined, {
    withCredentials: true,
  });
};

export const useMarkAsRead = () => useMutation(markAsRead);
