import subtract from 'lodash/subtract';

export const differenceBetweenSpecialTimeAndCurrentTime = (time: number) => {
  return Math.floor(subtract(+new Date(time), +new Date()) / (1000 * 60 * 60));
};

export default differenceBetweenSpecialTimeAndCurrentTime;
