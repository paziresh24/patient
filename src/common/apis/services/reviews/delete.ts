import { raviClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  id: string;
}

export const deleteFeedback = ({ id }: Params) => {
  return raviClient.delete(`/posts/${id}.json`);
};

export const useDeleteFeedback = () => {
  return useMutation(deleteFeedback);
};
