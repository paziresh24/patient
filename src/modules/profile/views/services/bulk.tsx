import Alert from '@/common/components/atom/alert';
import Card from '@/common/components/atom/card';
import Skeleton from '@/common/components/atom/skeleton';
import Text from '@/common/components/atom/text/text';
import useCustomize from '@/common/hooks/useCustomize';
import SubstituteDoctorButton from '@/modules/samanBooking/SubstituteDoctorButton';
interface BulkServiceProps {
  displayName: string;
  expertises: any;
  availableTime?: string;
  dcotorCity: string;
}

export const BulkService = ({ displayName, expertises, availableTime, dcotorCity }: BulkServiceProps) => {
  const customize = useCustomize(state => state.customize);

  return (
    <>
      {!customize.partnerKey && (
        <Card className="space-y-3 !rounded-none md:!rounded-lg">
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
