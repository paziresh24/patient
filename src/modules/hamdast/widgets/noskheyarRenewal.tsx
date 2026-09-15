import Text from '@/common/components/atom/text/text';
import CheckIcon from '@/common/components/icons/check';
import StatusIcon from '@/common/components/icons/status';
import useModal from '@/common/hooks/useModal';
import { AppFrame } from '@/modules/hamdast/appFrame';
import { HamdastAppModal } from '@/modules/hamdast/components/appModal';
import { prefetchOneApp } from '@/modules/hamdast/utils/prefetchOneApp';
import ServiceCard from '@/modules/profile/components/serviceCard/serviceCard';
import { addCommas } from '@persian-tools/persian-tools';
import { useQueryClient } from '@tanstack/react-query';

export const NoskheyarRenewal__ArgProps = new Array<any>('profileData', 'data', 'widgetData');

const APP_KEY = 'nskhh_yar';

function resolveServiceCostToman(data?: {
  ok?: boolean;
  amount_toman?: number;
  amount_rial?: number;
}): number | null {
  if (!data || data.ok === false) return null;
  if (typeof data.amount_toman === 'number' && Number.isFinite(data.amount_toman) && data.amount_toman > 0) {
    return data.amount_toman;
  }
  if (typeof data.amount_rial === 'number' && Number.isFinite(data.amount_rial) && data.amount_rial > 0) {
    return Math.round(data.amount_rial / 10);
  }
  return null;
}

export default function NoskheyarRenewal({
  profileData,
  data,
}: {
  profileData?: any;
  data?: { ok?: boolean; amount_toman?: number; amount_rial?: number };
}) {
  const queryClient = useQueryClient();
  const { handleOpen, handleClose, modalProps } = useModal();

  const doctorName = profileData?.information?.display_name?.trim?.() || '';
  const doctorUserId = profileData?.user_id;
  const doctorId = profileData?.information?.id;
  const serviceCostToman = resolveServiceCostToman(data);

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
          badge: (
            <span className="text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">
              بدون نیاز به ویزیت
            </span>
          ),
          ...(serviceCostToman != null && {
            hint: (
              <Text fontWeight="bold" fontSize="sm">
                {addCommas(serviceCostToman)} تومان
              </Text>
            ),
          }),
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
