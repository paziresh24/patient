import { useMutation } from '@tanstack/react-query';
import { workflowClient } from '../../client';

export interface Params {
  doctor_id: string;
  server_id: string;
}

export const getDoctorTags = (params: Params) => {
  return workflowClient.post(`/webhook/get-doctors-tags`, params);
};

export const useGetDoctorTags = () => {
  return useMutation(getDoctorTags);
};
