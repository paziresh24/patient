import { dayToSecond } from './dayToSecond';

interface Props {
  timestamp: number;
  numberDay: number;
  currentTime: number;
}

export const isAfterPastDaysFromTimestamp = ({ numberDay, timestamp, currentTime }: Props) => {
  const numDaysInSecond = timestamp + dayToSecond(numberDay);
  return currentTime > numDaysInSecond;
};

export default isAfterPastDaysFromTimestamp;
