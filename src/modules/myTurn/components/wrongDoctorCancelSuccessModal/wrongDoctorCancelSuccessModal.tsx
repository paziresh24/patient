import Button from '@/common/components/atom/button';
import Modal, { ModalProps } from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text';
import { useDoctorExpertise } from '@/common/apis/services/doctor/getDoctorExpertise';
import { getOnlineVisitSpecialtySearchUrl } from '@/modules/myTurn/utils/getOnlineVisitSpecialtySearchUrl';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

interface WrongDoctorCancelSuccessModalProps {
  modalProps: Pick<ModalProps, 'isOpen' | 'onClose'>;
  doctorSlug: string;
  expertiseName?: string;
}

export const WrongDoctorCancelSuccessModal = ({
  modalProps,
  doctorSlug,
  expertiseName,
}: WrongDoctorCancelSuccessModalProps) => {
  const router = useRouter();
  const { data: expertises, isLoading } = useDoctorExpertise(doctorSlug, { enabled: modalProps.isOpen && !!doctorSlug });

  const searchUrl = useMemo(() => {
    const firstExpertise = expertises?.[0];
    if (!firstExpertise) return getOnlineVisitSpecialtySearchUrl({});

    return getOnlineVisitSpecialtySearchUrl({
      expertiseGroupSlug: firstExpertise.groups?.[0]?.en_slug,
      expertiseSlug: firstExpertise.expertise?.slug,
    });
  }, [expertises]);

  const specialtyName =
    expertiseName || expertises?.[0]?.expertise?.name || expertises?.[0]?.groups?.[0]?.name || 'این تخصص';

  const handleGoToSearch = () => {
    modalProps.onClose();
    router.push(searchUrl);
  };

  return (
    <Modal title="نوبت لغو شد" {...modalProps} bodyClassName="!p-4">
      <div dir="rtl" className="space-y-4">
        <Text fontSize="sm" className="leading-6 text-slate-700">
          نوبت شما با موفقیت لغو شد.
        </Text>
        <Text fontSize="sm" className="leading-6 text-slate-700">
          می‌توانید از میان سایر پزشکان {specialtyName}، ویزیت آنلاین رزرو کنید.
        </Text>
        <div className="flex space-s-2 pt-1">
          <Button block onClick={handleGoToSearch} loading={isLoading}>
            مشاهده پزشکان آنلاین {specialtyName}
          </Button>
          <Button variant="secondary" block onClick={modalProps.onClose}>
            بستن
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default WrongDoctorCancelSuccessModal;
