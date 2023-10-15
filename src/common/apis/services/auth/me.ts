import { apiGatewayClient, clinicClient } from '@/common/apis/client';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import formData from '@/common/utils/formData';
import { useMutation } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

export const getUser = async (): Promise<any> => {
  const clinicData = await clinicClient.post(
    `/api/getUser`,
    formData({
      certificate: getCookie('certificate'),
    }),
  );

  try {
    const data = await apiGatewayClient.get(`/v1/auth/me`);

    const userData = data.data?.users?.[0];
    if (clinicData.data.status === ClinicStatus.SUCCESS) {
      return {
        ...clinicData,
        data: {
          ...clinicData.data,
          result: {
            ...clinicData.data.result,
            name: userData.name,
            family: userData.family,
            national_code: userData.national_code,
          },
        },
      };
    }
    return clinicData;
  } catch (error) {
    return clinicData;
  }
};

export const useGetUser = () => {
  return useMutation(getUser);
};
