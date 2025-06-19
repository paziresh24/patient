import { useMutation } from '@tanstack/react-query';
import { paziresh24AppClient } from '../../client';

export const enablePassword = async () => {
  return await paziresh24AppClient.patch(`/V1/user/enable-static-password`);
};

export const useEnablePassword = () => {
  return useMutation(enablePassword);
};
