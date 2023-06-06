import { clinicClient } from '@/common/apis/client';
import { formData } from '@/common/utils/formData';
import { getCookie } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';

export const getUserActiveTurnsCount = () => {
  return clinicClient.post(
    '/api/getUserActiveTurnsCount',
    formData({
      certificate: getCookie('certificate'),
    }),
  );
};

export const useGetUserActiveTurnsCount = () => {
  return useMutation(getUserActiveTurnsCount);
};
