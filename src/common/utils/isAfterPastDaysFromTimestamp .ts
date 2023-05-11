import { dayToSecond } from './dayToSecond';

interface Props {
  timestamp: number;
  numDays: number;
  currentTime: number;
}

export const isAfterPastDaysFromTimestamp = ({ numDays, timestamp, currentTime }: Props) => {
  const numDaysInSecond = timestamp + dayToSecond(numDays);
  return currentTime > numDaysInSecond;
};

export default isAfterPastDaysFromTimestamp;
