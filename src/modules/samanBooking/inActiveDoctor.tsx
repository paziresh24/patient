import Alert from '@/common/components/atom/alert';
import Card from '@/common/components/atom/card';
import Text from '@/common/components/atom/text';

interface InActiveDoctorProps {
  displayName: string;
  expertises?: any;
  doctorCity?: string;
  availableTime?: string;
  showSubstituteButton?: boolean;
}

const InActiveDoctor = ({ displayName }: InActiveDoctorProps) => {
  return (
    <Card className="space-y-3">
      <div className="space-y-3">
        <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
          <Text className="text-sm font-medium">درحال حاضر نوبت جدیدی برای {displayName} تعریف نشده است.</Text>
        </Alert>
      </div>
    </Card>
  );
};

export default InActiveDoctor;
