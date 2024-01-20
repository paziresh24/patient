import Button from '@/components/atom/button';
import { useEffect, useState } from 'react';
import { splunkBookingInstance } from '@/common/services/splunk';

type props = {
  bookId: string | string[] | undefined;
  currentTime: number;
  bookTime: number;
  visitedTurn: boolean;
};

const MedicalRecordButton = ({ bookId, currentTime, bookTime, visitedTurn }: props) => {
  const [is15SecondsPassed, setIs15SecondsPassed] = useState(false);

  useEffect(() => {
    const calculateTimeDifference = () => {
      if (currentTime >= bookTime + 15 * 60) {
        setIs15SecondsPassed(true);
      }
    };

    calculateTimeDifference();

    const intervalId = setInterval(calculateTimeDifference, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (is15SecondsPassed && !visitedTurn) {
    return (
      <Button
        block
        variant="secondary"
        className="border border-[#03c04a] text-[#03c04a] relative"
        onClick={() => {
          splunkBookingInstance().sendEvent({
            group: 'support-receipt',
            type: 'medical-record',
          });
          window.open(`https://support.paziresh24.com/mrcreator?book-id=${bookId}`);
        }}
      >
        تشکیل پرونده پزشکی
        <span className="bg-red-700 rounded-full p-1 absolute text-[10px] text-white min-w-[18px] -top-[5px] right-1/2 -translate-x-16 z-10 text-center font-bold">
          گفتگو با هوش مصنوعی
        </span>
      </Button>
    );
  } else {
    return <></>;
  }
};

export default MedicalRecordButton;
