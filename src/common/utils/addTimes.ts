import moment from 'jalali-moment';

export const addTimes = (firstTime: number, secondeTime: number) => {
  return moment
    .unix(firstTime)
    .add(secondeTime ?? '00:00:00', 'minute')
    .format('HH:mm');
};

export default addTimes;
