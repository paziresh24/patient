import { dayToSecond } from './dayToSecond';

interface Props {
  timestamp: number;
  numDays: number;
  currentTime: number;
}

export const isAfterPastDaysFromTimestamp = ({ numDays, timestamp, currentTime }: Props) => {
  const numDaysInMillis = timestamp + dayToSecond(numDays) * 1000;
  return currentTime > numDaysInMillis;
};

export default isAfterPastDaysFromTimestamp;
