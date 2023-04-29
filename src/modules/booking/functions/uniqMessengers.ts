import intersection from 'lodash/intersection';
import uniq from 'lodash/uniq';

export const uniqMessengers = (messengers: any, uniqBy: any) => {
  return uniq(intersection(messengers, uniqBy));
};
