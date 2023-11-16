import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';

export const getUserActiveTurnsCount = () => {
  return clinicClient.post('/api/getUserActiveTurnsCount');
};

export const useGetUserActiveTurnsCount = () => {
  return useMutation(getUserActiveTurnsCount);
};
