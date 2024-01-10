import { useQuery } from '@tanstack/react-query';
import { apiGatewayClient } from '../../client';
import { ServerStateKeysEnum } from '../../serverStateKeysEnum';

export interface Params {
  doctor_id: string;
  server_id: string;
}

export const getDoctorTags = (params: Params) => {
  return apiGatewayClient.get(`/v1/feedbacks/doctor-tags`, { params });
};

export const useGetDoctorTags = (params: Params) => {
  return useQuery([ServerStateKeysEnum.DoctorTags, params], () => getDoctorTags(params));
};
