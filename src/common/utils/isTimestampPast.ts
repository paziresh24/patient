import moment from 'jalali-moment';

export const isTimestampPast = (timestamp: number) => {
  return moment().isAfter(moment(moment(timestamp).unix()));
};

export default isTimestampPast;
