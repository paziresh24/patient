import Text from '@/common/components/atom/text/text';
import CheckIcon from '@/common/components/icons/check';
import StatusIcon from '@/common/components/icons/status';
import useModal from '@/common/hooks/useModal';
import { AppFrame } from '@/modules/hamdast/appFrame';
import { HamdastAppModal } from '@/modules/hamdast/components/appModal';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import ServiceCard from '@/modules/profile/components/serviceCard/serviceCard';
import { useQueryClient } from '@tanstack/react-query';

export const NoskheyarRenewal__ArgProps = new Array<any>('profileData', 'data', 'widgetData');

const APP_KEY = 'nskhh_yar';

export default function NoskheyarRenewal({ profileData }: { profileData?: any }) {
  const queryClient = useQueryClient();
  const { handleOpen, handleClose, modalProps } = useModal();

  const doctorName = profileData?.information?.display_name?.trim?.() || '';
  const doctorUserId = profileData?.user_id;
  const doctorId = profileData?.information?.id;

  const openRenewalFlow = () => {
    void prefetchOneApp(queryClient, { appKey: APP_KEY, pageKey: 'flows' }, ['SERVICE']);
    handleOpen();
  };

  return (
    <>
      <ServiceCard
        header={{
          icon: <StatusIcon />,
          title: 'تمدید آنلاین نسخه',
        }}
        body={{
          description: [
            doctorName
              ? `نام داروهای مصرفی خود در نسخه قبلی‌تان را برای <strong>${doctorName}</strong> ارسال کنید تا درخواست شما بررسی شود.`
              : 'نام داروهای مصرفی خود در نسخه قبلی‌تان را برای پزشک ارسال کنید تا درخواست شما بررسی شود.',
          ],
        }}
        alert={
          <div className="flex items-center space-s-2 text-primary">
            <CheckIcon className="w-4 h-4 shrink-0" />
            <Text fontSize="sm" fontWeight="medium" className="text-primary">
              ثبت سریع درخواست و دریافت پاسخ پزشک
            </Text>
          </div>
        }
        footer={{
          actions: [
            {
              text: 'درخواست تمدید نسخه',
              onClick: openRenewalFlow,
            },
          ],
        }}
      />

      <HamdastAppModal {...modalProps} onClose={handleClose} title="تمدید نسخه">
        <AppFrame
          dontShowAppBar
          dontShowProfile
          dontShowNotification
          appKey={APP_KEY}
          params={['flows', 'SERVICE']}
          queries={{
            open_from: 'profile',
            ...(doctorId != null ? { doctor_id: String(doctorId) } : {}),
            ...(doctorUserId != null ? { doctor_user_id: String(doctorUserId) } : {}),
          }}
          onHamdastClose={handleClose}
        />
      </HamdastAppModal>
    </>
  );
}
