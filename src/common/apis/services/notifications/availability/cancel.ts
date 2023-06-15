import { paziresh24AppClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

interface Params {
  user_center_id: string;
  center_id: string;
  service_id: string;
}

export const cancelAvailabilityNotification = (params: Params) => {
  return paziresh24AppClient.delete('/V1/request-availability', {
    params,
  });
};

export const useCancelAvailabilityNotification = () => {
  return useMutation(cancelAvailabilityNotification);
};
