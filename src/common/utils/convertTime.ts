import { digitsFaToEn } from '@persian-tools/persian-tools';
import moment from 'jalali-moment';

export const convertTime = (time: string) => {
  return moment.from(digitsFaToEn(time), 'fa', 'JYYYY/JMM/JDD HH:mm')?.locale('fa')?.calendar(undefined, {
    nextWeek: 'dddd',
    sameElse: 'dddd',
  });
};

export default convertTime;
