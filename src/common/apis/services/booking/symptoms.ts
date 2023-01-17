import { searchClient } from '@/common/apis/client';
import { useMutation } from 'react-query';

export const symptoms = (text: string) => {
  return searchClient.get(`/seapi/autoComplete?q=${text}&return_type[]=suggestion`);
};

export const useSymptoms = () => {
  return useMutation(symptoms);
};
