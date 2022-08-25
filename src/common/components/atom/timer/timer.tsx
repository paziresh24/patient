import { useEffect, useState } from "react";
import Text from "../text";

interface TimerProps {
  target: number;
}

const calculateTimeLeft = (
  time: number
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} => {
  const difference = +new Date(time * 1000) - +new Date();

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const Timer: React.FC<TimerProps> = (props) => {
  const { target } = props;

  const [timeLeft, setTimeLeft] = useState<any>(calculateTimeLeft(target));
  const timerComponents: string[] = [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);
    return () => clearTimeout(timer);
  });

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(timeLeft[interval]);
  });

  return (
    <Text fontWeight="bold" className="text-secondary">
      {timerComponents.length ? timerComponents.join(":") : "-"}
    </Text>
  );
};

export default Timer;
