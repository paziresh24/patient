export const getPremiumDuration = (expireDate?: string | null) => {
  if (!expireDate) return 0;

  const currentDate = new Date();
  const expirationDate = new Date(expireDate);
  const timeDifference = expirationDate.getTime() - currentDate.getTime();
  const lengthInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return lengthInDays;
};
