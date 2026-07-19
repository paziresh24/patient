import Alert from '@/common/components/atom/alert';
import Text from '@/common/components/atom/text';
import { formatSamanAvailabilityTime } from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import SubstituteDoctorButton from './SubstituteDoctorButton';

interface InActiveDoctorProps {
  displayName: string;
  expertises?: any;
  doctorCity?: string;
  availableTime?: string | null;
  showSubstituteButton?: boolean;
}

const InActiveDoctor = ({
  displayName,
  expertises,
  doctorCity,
  availableTime,
  showSubstituteButton = false,
}: InActiveDoctorProps) => {
  const formattedAvailableTime = availableTime ? formatSamanAvailabilityTime(availableTime) || availableTime : undefined;

  return (
    <div className="space-y-3">
      <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
        <Text className="text-sm font-medium">
          {formattedAvailableTime
            ? 'زمان نوبت دهی پزشک به پایان رسیده است.'
            : `درحال حاضر نوبت جدیدی برای ${displayName} تعریف نشده است.`}
        </Text>
      </Alert>

      {formattedAvailableTime && (
        <div className="flex justify-between text-sm">
          <Text className="text-slate-500">زمان اعلام نوبت های جدید: </Text>
          <Text fontWeight="medium" className="text-slate-800">
            {formattedAvailableTime}
          </Text>
        </div>
      )}

      {showSubstituteButton && expertises && doctorCity && (
        <SubstituteDoctorButton
          displayName={displayName}
          expertises={expertises}
          doctorCity={doctorCity}
          buttonId="inactive-doctor-substitute-button"
        />
      )}
    </div>
  );
};

export default InActiveDoctor;
