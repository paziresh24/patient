import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  nationalCode: string;
  centerId: string;
}

export const getNationalCodeConfirmation = async ({ nationalCode, centerId }: Params) => {
  const { data } = await paziresh24AppClient.get(`/user/v1/centers/${centerId}/national-code-confirmation/${nationalCode}`);
  return data;
};

export const useGetNationalCodeConfirmation = () => {
  return useMutation(getNationalCodeConfirmation);
};
