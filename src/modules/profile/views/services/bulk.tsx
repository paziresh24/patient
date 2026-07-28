import Alert from '@/common/components/atom/alert';
import Card from '@/common/components/atom/card';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text/text';
import useCustomize from '@/common/hooks/useCustomize';
import SubstituteDoctorButton from '@/modules/samanBooking/SubstituteDoctorButton';
import PartnerSubstituteDoctorButton from '@/modules/samanBooking/PartnerSubstituteDoctorButton';

interface BulkServiceProps {
  displayName: string;
  expertises: any;
  availableTime?: string;
  dcotorCity: string;
  /** Only show substitute when doctor has no bookable channel at all (online or in-person). Hidden when availableTime is set. */
  showSubstituteDoctor?: boolean;
}

export const BulkService = ({
  displayName,
  expertises,
  availableTime,
  dcotorCity,
  showSubstituteDoctor = true,
}: BulkServiceProps) => {
  const customize = useCustomize(state => state.customize);
  // Modal/button only when doctor has no booking now and no future available_time
  const shouldShowSubstitute = showSubstituteDoctor && !availableTime;

  return (
    <Card className="space-y-3 !rounded-none md:!rounded-lg">
      <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
        <Text className="text-sm font-medium"
        >
          {
            availableTime ? "زمان نوبت دهی پزشک به پایان رسیده است." : `درحال حاضر نوبت جدیدی برای ${displayName} تعریف نشده است.`
          }
        </Text>
      </Alert>
      {availableTime && (
        <div className="flex justify-between text-sm">
          <Text className="text-slate-500">زمان اعلام نوبت های جدید: </Text>
          <Text fontWeight="medium" className="text-slate-800">
            {availableTime}
          </Text>
        </div>
      )}
      {shouldShowSubstitute && !customize.partnerKey && (
        <SubstituteDoctorButton
          displayName={displayName}
          expertises={expertises}
          doctorCity={dcotorCity}
          buttonId="bulk-profile-button"
          autoOpenDelay={6000}
        />
      )}
      {shouldShowSubstitute && customize.partnerKey && (
        <PartnerSubstituteDoctorButton
          displayName={displayName}
          expertises={expertises}
          doctorCity={dcotorCity}
          buttonId="bulk-profile-partner-button"
          buttonText="دریافت نوبت از پزشک جایگزین"
        />
      )}
    </Card>
  );
};

export default BulkService;
