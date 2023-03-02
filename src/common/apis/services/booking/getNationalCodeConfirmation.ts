import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from 'react-query';

interface Params {
  nationalCode: string;
}

export const getNationalCodeConfirmation = ({ nationalCode }: Params) => {
  return paziresh24AppClient.get(`/user/v1/national-code-confirmation/${nationalCode}`);
};

export const useGetNationalCodeConfirmation = () => {
  return useMutation(getNationalCodeConfirmation);
};
