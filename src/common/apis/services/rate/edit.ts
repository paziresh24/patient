import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
  description: string;
  like: string;
}

export const editFeedback = ({ feedback_id, description, like }: Params) => {
  return paziresh24AppClient.patch(`/mizaan/v1/feedbacks/${feedback_id}`, {
    description,
    like,
  });
};

export const useEditFeedback = () => {
  return useMutation(editFeedback);
};
