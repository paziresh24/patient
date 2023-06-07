import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export interface Params {
  feedback_id: string;
}

export const reportFeedback = ({ feedback_id }: Params) => {
  return paziresh24AppClient.post(`/mizaan/v1/report-feedback`, {
    feedback_id: feedback_id,
  });
};

export const useReportFeedback = () => {
  return useMutation(reportFeedback);
};
