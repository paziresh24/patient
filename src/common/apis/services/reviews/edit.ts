import { raviClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  raw: string;
  id: string;
}

export const editComment = ({ raw, id }: Params) => {
  return raviClient.put(`/posts/${id}.json`, {
    raw,
  });
};

export const useEditComment = () => {
  return useMutation(editComment);
};
