import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
}

export const removeFeedback = ({ feedback_id }: Params) => {
  return paziresh24AppClient.post(`/mizaan/v1/delete-feedback`, {
    feedback_id,
  });
};

export const useRemoveFeedback = () => {
  return useMutation(removeFeedback);
};
