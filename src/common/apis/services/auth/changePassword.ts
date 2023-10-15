import { useMutation } from '@tanstack/react-query';
import { paziresh24AppClient } from '../../client';

interface Params {
  old_password: string;
  password: string;
  password_confirmation: string;
}

export const changePassword = async (params: Params) => {
  return await paziresh24AppClient.patch(`/V1/user/change-static-password`, params);
};

export const useChangePassword = () => {
  return useMutation(changePassword);
};
