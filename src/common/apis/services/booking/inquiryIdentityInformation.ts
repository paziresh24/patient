import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  nationalCode: string;
  yearOfBirth: string;
  centerId: string;
}

export const inquiryIdentityInformation = async ({ nationalCode, yearOfBirth, centerId }: Params) => {
  const { data } = await paziresh24AppClient.get(`/user/v1/centers/${centerId}/inquiry-identity-information`, {
    params: {
      year_of_birth: yearOfBirth,
      national_code: nationalCode,
    },
  });
  return data;
};

export const useInquiryIdentityInformation = () => {
  return useMutation(inquiryIdentityInformation);
};
