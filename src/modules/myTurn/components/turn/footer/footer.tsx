import ChatIcon from '@/common/components/icons/chat';
import TrashIcon from '@/common/components/icons/trash';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { splunkInstance } from '@/common/services/splunk';
import { isToday } from '@/common/utils/isToday';
import Button from '@/components/atom/button';
import Modal from '@/components/atom/modal';
import MegaphoneIcon from '@/components/icons/megaphone';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { useBookStore } from '@/modules/myTurn/store';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import useTranslation from 'next-translate/useTranslation';
import getConfig from 'next/config';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Queue from '../../queue';
import { OnlineVisitChannels } from '../turnType';
const { publicRuntimeConfig } = getConfig();

interface TurnFooterProps {
  id: string;
  slug: string;
  status: BookStatus;
  pdfLink?: string;
  centerType: CenterType;
  hasPaging: boolean;
  bookTime: number;
  centerId: string;
  nationalCode: string;
  trackingCode: string;
  phoneNumber: string;
  doctorName: string;
  expertise: string;
  onlineVisitChannels?: OnlineVisitChannels;
}

export const TurnFooter: React.FC<TurnFooterProps> = props => {
  const {
    id,
    slug,
    status,
    pdfLink,
    centerType,
    hasPaging,
    bookTime,
    onlineVisitChannels,
    centerId,
    nationalCode,
    trackingCode,
    expertise,
    doctorName,
    phoneNumber,
  } = props;
  const { t } = useTranslation('patient/appointments');
  const [queueModal, setQueueModal] = useState(false);
  const { removeBookApi } = useBookAction();
  const { removeBook } = useBookStore();
  const [removeModal, setRemoveModal] = useState(false);
  const isBookForToday = isToday(new Date(bookTime));

  const shouldShowRemoveTurn = status === BookStatus.notVisited || centerType === CenterType.consult;

  const showPrescription = () => {
    window.open(`${publicRuntimeConfig.PRESCRIPTION_API}/pdfs/${pdfLink}`);
  };

  const reBook = () => {
    window.open(`${publicRuntimeConfig.CLINIC_BASE_URL}/dr/${slug}`);
  };

  const ClinicPrimaryButton = hasPaging && (
    <Button
      variant="secondary"
      size="sm"
      block={true}
      onClick={() => setQueueModal(true)}
      icon={<MegaphoneIcon />}
      data-testid="footer__queue_button"
    >
      دریافت شماره نوبت
    </Button>
  );

  const CunsultPrimaryButton = () => {
    if (!onlineVisitChannels) return null;
    const channelsText = {
      igap: 'آی گپ',
      whatsapp: 'واتس اپ',
    };
    const channel = onlineVisitChannels?.[0];
    if (!channel) return null;
    return (
      <Button variant="secondary" size="sm" block={true} onClick={() => window.open(channel?.channel_link)} icon={<ChatIcon />}>
        گفتگو با پزشک در {channelsText[channel?.type]}
      </Button>
    );
  };

  const RemoveTurnButton = () => {
    const showRemoveTurnModal = () => {
      setRemoveModal(true);
      splunkInstance().sendEvent({
        group: 'my-turn',
        type: 'delete-turn',
        event: {
          terminal_id: getCookie('terminal_id'),
          doctorName,
          expertise,
          phoneNumber,
        },
      });
    };
    const removeBookAction = () => {
      removeBookApi.mutate(
        {
          center_id: centerId,
          reference_code: trackingCode,
          national_code: nationalCode,
        },
        {
          onSuccess: data => {
            if (data.data.status === ClinicStatus.SUCCESS) {
              removeBook({ bookId: id });
              setRemoveModal(false);
              return;
            }
            toast.error(data.data.message);
          },
        },
      );
    };
    return (
      <>
        <Button theme="error" variant="secondary" size="sm" block={true} onClick={showRemoveTurnModal} icon={<TrashIcon />}>
          لغو نوبت
        </Button>
        <Modal title="آیا از لغو نوبت مطمئن هستید؟" onClose={setRemoveModal} isOpen={removeModal}>
          <div className="flex space-s-2">
            <Button
              theme="error"
              block
              onClick={removeBookAction}
              loading={removeBookApi.isLoading}
              data-testid="modal__remove-turn-button"
            >
              لغو نوبت
            </Button>
            <Button
              theme="error"
              variant="secondary"
              block
              onClick={() => setRemoveModal(false)}
              data-testid="modal__cancel-remove-turn-button"
            >
              انصراف
            </Button>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <>
      {status === BookStatus.notVisited && centerType !== CenterType.consult && ClinicPrimaryButton}
      {useFeatureIsOn('delete-book') && shouldShowRemoveTurn && <RemoveTurnButton />}

      {centerType === CenterType.consult && status !== BookStatus.deleted && <CunsultPrimaryButton />}
      {(status === BookStatus.expired ||
        status === BookStatus.visited ||
        status === BookStatus.deleted ||
        status === BookStatus.rejected) && (
        <div className="flex gap-2">
          {isBookForToday && ClinicPrimaryButton}
          <Button variant="secondary" size="sm" block={true} onClick={reBook}>
            {t('turnAction.rebook')}{' '}
          </Button>
          {pdfLink && (
            <Button variant="secondary" size="sm" block={true} onClick={showPrescription}>
              مشاهده نسخه
            </Button>
          )}
        </div>
      )}

      <Modal onClose={setQueueModal} isOpen={queueModal} bodyClassName="p-0" noHeader>
        <Queue bookId={id} />
      </Modal>
    </>
  );
};

export default TurnFooter;
