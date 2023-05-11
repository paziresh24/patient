import { useMoveBook } from '@/common/apis/services/booking/moveBook';
import Alert from '@/common/components/atom/alert/alert';
import Text from '@/common/components/atom/text/text';
import RefreshIcon from '@/common/components/icons/refresh';
import TrashIcon from '@/common/components/icons/trash';
import WarningIcon from '@/common/components/icons/warning';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import { isToday } from '@/common/utils/isToday';
import Button from '@/components/atom/button';
import Modal from '@/components/atom/modal';
import MegaphoneIcon from '@/components/icons/megaphone';
import Select from '@/modules/booking/components/select/select';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import deleteTurnQuestion from '@/modules/myTurn/constants/deleteTurnQuestion.json';
import { useBookStore } from '@/modules/myTurn/store';
import { BookStatus } from '@/modules/myTurn/types/bookStatus';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { PaymentStatus } from '@/modules/myTurn/types/paymentStatus';
import { getCookie } from 'cookies-next';
import shuffle from 'lodash/shuffle';
import useTranslation from 'next-translate/useTranslation';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import MessengerButton from '../../messengerButton/messengerButton';
import MoveTurn from '../../moveTurn/moveTurn';
import Queue from '../../queue';
import { OnlineVisitChannel } from '../turnType';
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
  onlineVisitChannel?: OnlineVisitChannel;
  serviceId: string;
  userCenterId: string;
  activePaymentStatus: boolean;
  respiteDeleteTurn?: string;
  patientName: string;
  paymentStatus: PaymentStatus;
  description: string;
  notRefundable?: boolean;
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
    onlineVisitChannel,
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
    respiteDeleteTurn,
    paymentStatus,
    description,
    notRefundable,
  } = props;
  const { t } = useTranslation('patient/appointments');
  const { handleOpen: handleOpenQueueModal, modalProps: queueModalProps } = useModal();
  const { handleOpen: handleOpenMoveTurnModal, handleClose: handleCloseMoveTurnModal, modalProps: moveTurnModalProps } = useModal();
  const { handleOpen: handleOpenTurnDesciription, modalProps: turnDesciriptionProp } = useModal();
  const { handleOpen: handleOpenRemoveTurn, handleClose: handleCloseRemoveTurnModal, modalProps: removeTurnProp } = useModal();

  const router = useRouter();
  const { removeBookApi } = useBookAction();
  const { removeBook, moveBook } = useBookStore();
  const [reasonDeleteTurn, setReasonDeleteTurn] = useState(null);
  const isBookForToday = isToday(new Date(bookTime));
  const moveBookApi = useMoveBook();
  const isOnlineVisitTurn = centerType === CenterType.consult;
  const deleteTurnQuestionAffterVisit = useMemo(() => shuffle(deleteTurnQuestion.affter_visit), [deleteTurnQuestion]);
  const deleteTurnQuestionBefforVisit = useMemo(() => shuffle(deleteTurnQuestion.befor_visit), [deleteTurnQuestion]);
  const shouldShowRemoveTurn =
    (status === BookStatus.notVisited || (isOnlineVisitTurn && status !== BookStatus.deleted)) && paymentStatus !== PaymentStatus.paying;

  const showPrescription = () => {
    splunkInstance().sendEvent({
      group: 'my-booking',
      type: 'treatment-details',
      event: {
        doctorName,
        expertise,
        phoneNumber,
        nationalCode,
        action: pdfLink ? 'prescription' : 'description',
      },
    });

    if (pdfLink) return window.open(`${publicRuntimeConfig.PRESCRIPTION_API}/pdfs/${pdfLink}`);

    handleOpenTurnDesciription();
  };

  const reBook = () => {
    router.push(`/booking/${slug}?centerId=${centerId}&serviceId=${serviceId}`);
  };

  const ClinicPrimaryButton = hasPaging && (
    <Button
      variant="secondary"
      block={true}
      onClick={() => handleOpenQueueModal()}
      icon={<MegaphoneIcon />}
      data-testid="footer__queue_button"
    >
      دریافت شماره نوبت
    </Button>
  );

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
            handleCloseRemoveTurnModal();
            if (isOnlineVisitTurn) {
              splunkInstance().sendEvent({
                group: 'my-turn',
                type: 'delete-turn-reason',
                event: {
                  terminal_id: getCookie('terminal_id'),
                  doctorName,
                  expertise,
                  phoneNumber,
                  reason: reasonDeleteTurn,
                  isVisited: status === BookStatus.visited,
                },
              });
            }
            return;
          }
          toast.error(data.data.message);
        },
      },
    );
  };

  const showRemoveTurnModal = () => {
    handleOpenRemoveTurn();
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
    const { data } = await moveBookApi.mutateAsync({
      center_id: centerId,
      reference_code: trackingCode,
      request_code: timeId,
    });
    if (data?.status === ClinicStatus.SUCCESS) {
      handleCloseMoveTurnModal();
      moveBook({
        bookId: id,
        from,
      });
      splunkInstance().sendEvent({
        group: 'move-book',
        type: 'confirm',
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
      toast.success('جابجایی نوبت با موفقیت انجام شد.');
      return;
    }
    toast.error(data?.message);
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
    splunkInstance().sendEvent({
      group: 'basket_butten',
      type: centerId === CENTERS.CONSULT ? 'consult' : 'office',
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

  return (
    <>
      {status === BookStatus.notVisited && centerType !== CenterType.consult && ClinicPrimaryButton}
      {isOnlineVisitTurn && paymentStatus !== PaymentStatus.paying && status !== BookStatus.deleted && onlineVisitChannel && (
        <MessengerButton channel={onlineVisitChannel} />
      )}
      <div className="flex items-center space-s-3">
        {shouldShowRemoveTurn && (
          <Button
            theme="error"
            variant="secondary"
            block={true}
            onClick={showRemoveTurnModal}
            icon={status === BookStatus.notVisited && <TrashIcon />}
          >
            {isOnlineVisitTurn && status !== BookStatus.notVisited ? 'استرداد وجه' : 'لغو نوبت'}
          </Button>
        )}
        {status === BookStatus.notVisited && (
          <Button variant="secondary" block={true} icon={<RefreshIcon width={23} height={23} />} onClick={handleMoveButton}>
            جابجایی نوبت
          </Button>
        )}
      </div>

      {paymentStatus === PaymentStatus.paying && (
        <Button variant="primary" block={true} onClick={redirectToFactor}>
          نهایی کردن نوبت
        </Button>
      )}

      {[BookStatus.expired, BookStatus.visited, BookStatus.deleted, BookStatus.rejected].includes(status) && (
        <div className="flex gap-2">
          {isBookForToday && ClinicPrimaryButton}
          <Button variant="secondary" block={true} onClick={reBook}>
            {t('turnAction.rebook')}
          </Button>
          {(pdfLink || !!description) && (
            <Button variant="secondary" block={true} onClick={showPrescription}>
              {pdfLink ? 'مشاهده نسخه' : 'توضیحات درمان'}
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
      <Modal
        title={
          isOnlineVisitTurn
            ? `لطفا دلیل ${status === BookStatus.notVisited ? 'لغو نوبت' : 'درخواست استرداد وجه'} را انتخاب کنید`
            : 'آیا از لغو نوبت اطمینان دارید؟'
        }
        {...removeTurnProp}
      >
        <>
          {isOnlineVisitTurn && (
            <div className="mb-4 space-y-3">
              {(status === BookStatus.notVisited ? deleteTurnQuestionBefforVisit : deleteTurnQuestionAffterVisit).map((question: any) => (
                <Select
                  key={question.id}
                  selected={reasonDeleteTurn === question.value}
                  onSelect={() => setReasonDeleteTurn(question.value)}
                  title={question.text}
                />
              ))}
            </div>
          )}
          {notRefundable && centerType !== CenterType.consult && (
            <Alert severity="warning" className="p-2 mb-4 flex items-center gap-2">
              <WarningIcon className="w-8" />
              <Text fontSize="sm">
                زمان نوبت شما کمتر از <b>{respiteDeleteTurn} ساعت</b> دیگر است و وجه پرداختی شما عودت داده نخواهد شد.
              </Text>
            </Alert>
          )}
          <div className="flex space-s-2">
            <Button
              theme="error"
              block
              onClick={removeBookAction}
              loading={removeBookApi.isLoading}
              data-testid="modal__remove-turn-button"
              disabled={isOnlineVisitTurn && !reasonDeleteTurn}
            >
              {isOnlineVisitTurn && status !== BookStatus.notVisited ? 'استرداد وجه' : 'لغو نوبت'}
            </Button>
            <Button
              theme="error"
              variant="secondary"
              block
              onClick={handleCloseRemoveTurnModal}
              data-testid="modal__cancel-remove-turn-button"
            >
              انصراف
            </Button>
          </div>
        </>
      </Modal>
      <Modal {...turnDesciriptionProp} title="توضیحات درمان">
        <Text fontSize="sm">{description}</Text>
      </Modal>
    </>
  );
};

export default TurnFooter;
