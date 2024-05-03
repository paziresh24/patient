import { clinicClient } from '@/common/apis/client';
import { useMutation } from '@tanstack/react-query';
import { growthbook } from 'src/pages/_app';

export const getUserActiveTurnsCount = () => {
  const endpoints = growthbook.getFeatureValue<Record<string, string>>('booking:api-endpoints', {});

  return clinicClient.post(endpoints?.get_user_active_turns_count ?? '/api/getUserActiveTurnsCount');
};

export const useGetUserActiveTurnsCount = () => {
  return useMutation(getUserActiveTurnsCount);
};
