import Alert from '@/common/components/atom/alert';
import Card from '@/common/components/atom/card';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text/text';
import useCustomize from '@/common/hooks/useCustomize';
import SubstituteDoctorButton from '@/modules/samanBooking/SubstituteDoctorButton';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
interface BulkServiceProps {
  displayName: string;
  expertises: any;
  availableTime?: string;
  dcotorCity: string;
}

export const BulkService = ({ displayName, expertises, availableTime, dcotorCity }: BulkServiceProps) => {
  const customize = useCustomize(state => state.customize);
  const isSamanBookingEnabled = useFeatureIsOn('saman-booking');

  return (
    <>
      {!customize.partnerKey && (
        <Card className="space-y-3 !rounded-none md:!rounded-lg">
          {!isSamanBookingEnabled && (
            <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
              <Text className="text-sm font-medium">درحال حاضر نوبت جدیدی برای {displayName} تعریف نشده است.</Text>
            </Alert>
          )}
          {availableTime && (
            <div className="flex justify-between text-sm">
              <Text className="text-slate-500">زمان اعلام نوبت های جدید: </Text>
              <Text fontWeight="medium" className="text-slate-800">
                {availableTime}
              </Text>
            </div>
          )}
          <SubstituteDoctorButton
            displayName={displayName}
            expertises={expertises}
            doctorCity={dcotorCity}
            buttonId="bulk-profile-button"
            autoOpenDelay={6000}
          />
        </Card>
      )}
    </>
  );
};

export default BulkService;
