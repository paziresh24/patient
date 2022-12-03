import { useBook } from '@/common/apis/services/booking/book';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useBookingStore } from '../store/booking';
import SelectTurnTime from './selectTime';
import SelectUser from './selectUser';

interface BookingStepsProps {
  center: {
    centerId: string;
    serviceId: string;
    userCenterId: string;
    serverId: string;
  };
}

type Step = 'selectTurnTime' | 'selectUser';

const BookingSteps = (props: BookingStepsProps) => {
  const { center } = props;
  const { query, ...router } = useRouter();
  const [step, setStep] = useState<Step>('selectTurnTime');
  const setCenterInfo = useBookingStore(state => state.setCenter);
  const requestCode = useBookingStore(state => state.turnTime.requestCode);
  const book = useBook();

  useEffect(() => {
    setCenterInfo({ ...center });
  }, [center]);

  const handleBookAction = async (user: any) => {
    const { data } = await book.mutateAsync({
      request_code: requestCode,
      center_id: center.centerId,
      server_id: center.serverId,
      is_webview: query.isWebView ? 1 : 0,
      first_name: user.name,
      last_name: user.family,
      gender: user.gender,
      cell: user.cell,
      national_code: user.national_code,
    });
    if (data.status === ClinicStatus.SUCCESS) {
      if (data.payment.reqiure_payment === '1') return router.push(`/factor/${data.book_info.id}`);
      return router.push(`/receipt/${data.book_info.id}`);
    }
  };

  return (
    <div>
      {step === 'selectTurnTime' && <SelectTurnTime onSubmit={() => setStep('selectUser')} />}
      {step === 'selectUser' && <SelectUser onSubmit={handleBookAction} loading={book.isLoading} />}
    </div>
  );
};

export default BookingSteps;
