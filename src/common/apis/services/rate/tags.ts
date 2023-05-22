import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface Params {
  doctor_id: string;
  server_id: string;
}

export const getDoctorTags = (params: Params) => {
  return axios.post(`https://ttq2asnnfxua5b3h5rpxaunr.hooks.n8n.cloud/webhook/get-doctors-tags`, {
    ...params,
  });
};

export const useGetDoctorTags = () => {
  return useMutation(getDoctorTags);
};
