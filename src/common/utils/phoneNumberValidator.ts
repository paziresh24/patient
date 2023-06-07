import { phoneNumberValidator as validator } from '@persian-tools/persian-tools';

export const phoneNumberValidator = (phoneNumber: string) => {
  return validator(phoneNumber) || phoneNumber.startsWith('0996');
};
