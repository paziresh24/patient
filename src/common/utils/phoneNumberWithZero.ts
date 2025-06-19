export const phoneNumberWithZero = (phoneNumber: string) => {
  return phoneNumber.startsWith('0') ? phoneNumber : `0${phoneNumber}`;
};
