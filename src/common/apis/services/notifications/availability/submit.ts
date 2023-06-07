import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  user_center_id: string;
  center_id: string;
  service_id: string;
  cell?: string;
}

export const submitAvailabilityNotification = (params: Params) => {
  return paziresh24AppClient.post('/V1/user/notifications/availability', params);
};

export const useSubmitAvailabilityNotification = () => {
  return useMutation(submitAvailabilityNotification);
};
