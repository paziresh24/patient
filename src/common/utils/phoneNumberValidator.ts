import { phoneNumberValidator as validator } from '@persian-tools/persian-tools';
import { phoneNumberWithZero } from './phoneNumberWithZero';

const additionalPrefixes = ['0996', '0923'];

export const phoneNumberValidator = (phoneNumber: string) => {
  return validator(phoneNumber) || additionalPrefixes.includes(phoneNumberWithZero(phoneNumber).slice(0, 4));
};
