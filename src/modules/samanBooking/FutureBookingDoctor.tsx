import Alert from '@/common/components/atom/alert';
import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text/text';
import InfoIcon from '@/common/components/icons/info';
import { formatTime } from '@/common/utils/formatTime';

interface FutureBookingDoctorProps {
  availableTime: string;
}

const FutureBookingDoctor = ({ availableTime }: FutureBookingDoctorProps) => {
  return (
    <Card className="space-y-3">
      <Alert severity="warning" className="flex items-center p-3 text-orange-600 space-s-1">
        <InfoIcon className="w-6 h-6" />
        <Text className="text-sm font-medium">زمان نوبت دهی پزشک به پایان رسیده است.</Text>
      </Alert>
      <div className="flex justify-between text-sm">
        <Text className="text-slate-500">زمان اعلام نوبت های جدید: </Text>
        <Text fontWeight="medium" className="text-slate-800">
          {formatTime(availableTime)}
        </Text>
      </div>
    </Card>
  );
};

export default FutureBookingDoctor;
