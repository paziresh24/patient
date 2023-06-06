import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
}

export const likeFeedback = ({ feedback_id }: Params) => {
  return clinicClient.post(
    `/api/likeOrDislikeFeedback/`,
    formData({
      certificate: getCookie('certificate'),
      feedback_id: feedback_id,
    }),
  );
};

export const useLikeFeedback = () => {
  return useMutation(likeFeedback);
};
