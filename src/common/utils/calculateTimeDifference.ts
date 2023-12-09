import { digitsFaToEn } from '@persian-tools/persian-tools';
import moment from 'jalali-moment';

const calculateTimeDifference = (targetTime: string, timeUnit: 'minutes' | 'hours') => {
  return moment(digitsFaToEn(targetTime), 'HH:mm').diff(moment(), timeUnit);
};

export default calculateTimeDifference;
