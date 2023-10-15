import { apiGatewayClient, clinicClient } from '@/common/apis/client';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

interface Params {
  user_id?: string;
  name?: string;
  family?: string;
  national_code?: string;
  gender?: string;
  cell?: string;
  city?: string;
  province?: string;
  image?: any;
}

export const updateUser = async ({ user_id, ...params }: Params) => {
  const data = await clinicClient.post(
    `/api/userUpdate`,
    formData({
      certificate: getCookie('certificate'),
      ...params,
    }),
  );
  if (!params?.image && data.data.status === ClinicStatus.SUCCESS) {
    await apiGatewayClient.patch(`/v1/users/${user_id}`, {
      name: params.name,
      family: params.family,
      ...(params?.national_code && { national_code: params.national_code }),
    });
  }

  return data;
};

export const useUpdateUser = () => {
  return useMutation(updateUser);
};
