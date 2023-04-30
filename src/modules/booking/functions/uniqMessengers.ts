import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

export const uniqMessengers = (messengers: string[], uniqBy: string[]) => {
  return uniq(intersection(messengers, uniqBy));
};
