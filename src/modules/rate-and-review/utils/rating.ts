import { RaviRatingBreakdownItem } from '../types';

export const toFixedRating = (value: number, digits = 1): string => {
  if (!Number.isFinite(value)) {
    return '0';
  }
  return String(Number(value.toFixed(digits)));
};

export const averageFromBreakdown = (items: RaviRatingBreakdownItem[]): number => {
  if (!items.length) {
    return 0;
  }

  const total = items.reduce((sum, item) => sum + (Number.isFinite(item.value) ? item.value : 0), 0);
  return total / items.length;
};
