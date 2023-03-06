import { useMoveBook } from '@/common/apis/services/booking/moveBook';
import ChatIcon from '@/common/components/icons/chat';
import RefreshIcon from '@/common/components/icons/refresh';
import TrashIcon from '@/common/components/icons/trash';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import { isToday } from '@/common/utils/isToday';
import Button from '@/components/atom/button';
import Modal from '@/components/atom/modal';
import MegaphoneIcon from '@/components/icons/megaphone';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { useBookStore } from '@/modules/myTurn/store';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import useTranslation from 'next-translate/useTranslation';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import MoveTurn from '../../moveTurn/moveTurn';
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
  serviceId: string;
  userCenterId: string;
  activePaymentStatus: boolean;
  patientName: string;
  paymentStatus: PaymentStatus;
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
    serviceId,
    userCenterId,
    activePaymentStatus,
    patientName,
    paymentStatus,
  } = props;
  const { t } = useTranslation('patient/appointments');
  const { handleOpen: handleOpenQueueModal, modalProps: queueModalProps } = useModal();
  const { handleOpen: handleOpenMoveTurnModal, handleClose: handleCloseMoveTurnModal, modalProps: moveTurnModalProps } = useModal();

  const router = useRouter();
  const { removeBookApi } = useBookAction();
  const { removeBook, moveBook } = useBookStore();
  const [removeModal, setRemoveModal] = useState(false);
  const isBookForToday = isToday(new Date(bookTime));
  const isShowMoveBookButton = useFeatureIsOn('move-book-butten');

  const moveBookApi = useMoveBook();

  const shouldShowRemoveTurn =
    status === BookStatus.notVisited && centerType !== CenterType.consult && paymentStatus !== PaymentStatus.paying;

  const showPrescription = () => {
    window.open(`${publicRuntimeConfig.PRESCRIPTION_API}/pdfs/${pdfLink}`);
  };

  const reBook = () => {
    router.push(`/dr/${slug}`);
  };

  const ClinicPrimaryButton = hasPaging && (
    <Button
      variant="secondary"
      size="sm"
      block={true}
      onClick={() => handleOpenQueueModal()}
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

  const removeBookAction = () => {
    return removeBookApi.mutateAsync(
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

  const showRemoveTurnModal = () => {
    setRemoveModal(true);
    splunkInstance().sendEvent({
      group: 'my-turn',
      type: 'delete-turn-footer',
      event: {
        terminal_id: getCookie('terminal_id'),
        doctorName,
        expertise,
        phoneNumber,
      },
    });
  };

  const handleMoveTurn = async ({ timeId, from }: { timeId: string; from: number }) => {
    await moveBookApi.mutateAsync({
      center_id: centerId,
      reference_code: trackingCode,
      request_code: timeId,
    });
    handleCloseMoveTurnModal();
    moveBook({
      bookId: id,
      from,
    });
    toast.success('جابجایی نوبت با موفقیت انجام شد.');
  };

  const handleMoveButton = () => {
    handleOpenMoveTurnModal();

    splunkInstance().sendEvent({
      group: 'move-book',
      type: 'button',
      event: {
        terminal_id: getCookie('terminal_id'),
        doctorName,
        expertise,
        patient: {
          phoneNumber: phoneNumber,
          name: patientName,
        },
      },
    });
  };

  const redirectToFactor = () => {
    router.push(`/factor/${centerId}/${id}`);
  };

  return (
    <>
      {status === BookStatus.notVisited && centerType !== CenterType.consult && ClinicPrimaryButton}
      <div className="flex items-center space-s-3">
        {shouldShowRemoveTurn && (
          <Button theme="error" variant="secondary" size="sm" block={true} onClick={showRemoveTurnModal} icon={<TrashIcon />}>
            لغو نوبت
          </Button>
        )}
        {isShowMoveBookButton && status === BookStatus.notVisited && centerType !== CenterType.consult && !activePaymentStatus && (
          <Button variant="secondary" size="sm" block={true} icon={<RefreshIcon width={23} height={23} />} onClick={handleMoveButton}>
            جابجایی نوبت
          </Button>
        )}
      </div>

      {paymentStatus === PaymentStatus.paying && (
        <Button variant="primary" size="sm" block={true} onClick={redirectToFactor}>
          نهایی کردن نوبت
        </Button>
      )}

      {centerType === CenterType.consult && paymentStatus !== PaymentStatus.paying && status !== BookStatus.deleted && (
        <CunsultPrimaryButton />
      )}

      {[BookStatus.expired, BookStatus.visited, BookStatus.deleted, BookStatus.rejected].includes(status) && (
        <div className="flex gap-2">
          {isBookForToday && ClinicPrimaryButton}
          <Button variant="secondary" size="sm" block={true} onClick={reBook}>
            {t('turnAction.rebook')}
          </Button>
          {pdfLink && (
            <Button variant="secondary" size="sm" block={true} onClick={showPrescription}>
              مشاهده نسخه
            </Button>
          )}
        </div>
      )}

      <Modal {...queueModalProps} bodyClassName="p-0" noHeader>
        <Queue bookId={id} />
      </Modal>

      <Modal {...moveTurnModalProps} title="انتخاب تاريخ جابجایی نوبت" bodyClassName="space-y-3 pb-24 md:pb-5">
        <MoveTurn
          centerId={centerId}
          serviceId={serviceId}
          userCenterId={userCenterId}
          handleMove={({ timeId, timeStamp }) => handleMoveTurn({ timeId, from: timeStamp })}
          currentDate={bookTime}
          loading={moveBookApi.isLoading}
          events={{
            onFirstFreeTime() {
              splunkInstance().sendEvent({
                group: 'move-book',
                type: 'frist-free-time',
                event: {
                  terminal_id: getCookie('terminal_id'),
                  doctorName,
                  expertise,
                  patient: {
                    phoneNumber: phoneNumber,
                    name: patientName,
                  },
                },
              });
            },
            onOtherFreeTime() {
              splunkInstance().sendEvent({
                group: 'move-book',
                type: 'other-free-time',
                event: {
                  terminal_id: getCookie('terminal_id'),
                  doctorName,
                  expertise,
                  patient: {
                    phoneNumber: phoneNumber,
                    name: patientName,
                  },
                },
              });
            },
          }}
        />
      </Modal>
      <Modal title="آیا از لغو نوبت مطمئن هستید؟" onClose={setRemoveModal} isOpen={removeModal}>
        <div className="flex space-s-2">
          <Button theme="error" block onClick={removeBookAction} loading={removeBookApi.isLoading} data-testid="modal__remove-turn-button">
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

export default TurnFooter;
