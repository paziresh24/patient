import intersection from 'lodash/intersection';

export const uniqMessengers = (messengers: string[], uniqBy: string[]) => {
  return intersection(messengers, uniqBy);
};
