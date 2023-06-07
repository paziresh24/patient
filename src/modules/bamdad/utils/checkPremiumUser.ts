import { getPremiumDuration } from './getPremiumDuration';

export const checkPremiumUser = (expireDate?: string | null) => {
  if (!expireDate) return false;
  if (getPremiumDuration(expireDate) <= 0) return false;
  return true;
};
