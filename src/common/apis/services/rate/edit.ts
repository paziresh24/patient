import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
  description: string;
}

export const editFeedback = ({ feedback_id, description }: Params) => {
  return paziresh24AppClient.post(`/mizaan/v1/edit-feedback`, {
    feedback_id,
    description,
  });
};

export const useEditFeedback = () => {
  return useMutation(editFeedback);
};
