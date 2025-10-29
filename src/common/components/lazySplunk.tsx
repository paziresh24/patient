import { useEffect, useState } from 'react';
import { splunkInstance } from '@/common/services/splunk';

interface LazySplunkProps {
  eventName: string;
  eventData: any;
  delay?: number;
}

const LazySplunk = ({ eventName, eventData, delay = 1000 }: LazySplunkProps) => {
  const [shouldSend, setShouldSend] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldSend(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (shouldSend) {
      try {
        (splunkInstance as any)(eventName).sendEvent(eventData);
      } catch (error) {
        console.warn('Splunk event failed:', error);
      }
    }
  }, [shouldSend, eventName, eventData]);

  return null;
};

export default LazySplunk;
