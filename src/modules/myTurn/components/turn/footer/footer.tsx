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
import { useFeatureValue } from '@growthbook/growthbook-react';
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
import { SecureCallButton } from '../../secureCallButton/secureCallButton';
import { OnlineVisitChannel } from '../turnType';
import axios from 'axios';
import { growthbook } from 'src/pages/_app';
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
  onlineVisitChannels?: OnlineVisitChannel[];
  selectedOnlineVisitChannel?: OnlineVisitChannel;
  serviceId: string;
  userCenterId: string;
  activePaymentStatus: boolean;
  respiteDeleteTurn?: string;
  patientName: string;
  paymentStatus: PaymentStatus;
  description: string;
  notRefundable?: boolean;
  possibilityBeingVisited?: boolean;
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
    selectedOnlineVisitChannel,
    possibilityBeingVisited,
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
  const {
    handleOpen: handleOpenRemoveTurn,
    handleClose: handleCloseRemoveTurnModal,
    modalProps: removeTurnProp,
  } = useModal({
    onClose: () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_center_id: undefined,
        center_id: undefined,
        book_id: undefined,
        slug: undefined,
      });
    },
  });

  const router = useRouter();
  const { removeBookApi } = useBookAction();
  const { removeBook, moveBook } = useBookStore();
  const [reasonDeleteTurn, setReasonDeleteTurn] = useState(null);
  const safeCallModuleInfo = useFeatureValue<any>('online_visit_secure_call', {});
  const isBookForToday = isToday(new Date(bookTime));
  const moveBookApi = useMoveBook();
  const isOnlineVisitTurn = centerType === CenterType.consult;
  const deleteTurnQuestionAffterVisit = useMemo(() => shuffle(deleteTurnQuestion.affter_visit), [deleteTurnQuestion]);
  const deleteTurnQuestionBefforVisit = useMemo(() => shuffle(deleteTurnQuestion.befor_visit), [deleteTurnQuestion]);
  const shouldShowRemoveTurn =
    (status === BookStatus.notVisited || (isOnlineVisitTurn && status !== BookStatus.deleted && status !== BookStatus.visited)) &&
    paymentStatus !== PaymentStatus.paying;

  const shouldShowMessengerButton =
    isOnlineVisitTurn &&
    paymentStatus !== PaymentStatus.paying &&
    status !== BookStatus.deleted &&
    selectedOnlineVisitChannel &&
    possibilityBeingVisited;

  const showPrescription = () => {
    splunkInstance('doctor-profile').sendEvent({
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
        book_id: id,
      },
      {
        onSuccess: data => {
          if (data.data.status === ClinicStatus.SUCCESS) {
            removeBook({ bookId: id });
            handleCloseRemoveTurnModal();
            if (isOnlineVisitTurn) {
              splunkInstance('doctor-profile').sendEvent({
                group: 'my-turn',
                type: 'delete-turn-reason',
                event: {
                  terminal_id: getCookie('terminal_id'),
                  doctorName,
                  expertise,
                  nationalCode,
                  trackingCode,
                  patientName,
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
        onError: (error: any) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message);
          }
        },
      },
    );
  };

  const showRemoveTurnModal = () => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      user_center_id: userCenterId,
      center_id: centerId,
      book_id: id,
      slug: slug,
    });
    handleOpenRemoveTurn();
    splunkInstance('doctor-profile').sendEvent({
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
      splunkInstance('doctor-profile').sendEvent({
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

    splunkInstance('doctor-profile').sendEvent({
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

  const handleSafeCallAction = () => {
    splunkInstance('booking').sendEvent({
      group: 'safe-call',
      type: 'patient',
      event: {
        action: 'appointments',
        data: {
          referenceCode: trackingCode,
          doctor: { centerId, name: doctorName },
          patient: { cell: phoneNumber, name: patientName, nationalCode },
        },
      },
    });
  };

  const redirectToFactor = () => {
    router.push(`/factor/${centerId}/${id}`);
    splunkInstance('doctor-profile').sendEvent({
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

  const localPaymentCenters = useFeatureValue<any>('local_payment_centers', []);
  return (
    <>
      {shouldShowMessengerButton && (
        <div className="flex flex-col gap-2 lg:flex-row lg:justify-between lg:gap-4">
          <MessengerButton channel={selectedOnlineVisitChannel} />
          {onlineVisitChannels?.some((channel: { type: string }) => channel.type === 'secure_call') && (
            <SecureCallButton bookId={id} extraAction={() => handleSafeCallAction()} />
          )}
        </div>
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
            {isOnlineVisitTurn && status !== BookStatus.notVisited ? 'حذف نوبت و استرداد وجه' : 'لغو نوبت'}
          </Button>
        )}
        {status === BookStatus.notVisited && paymentStatus !== PaymentStatus.paying && !isOnlineVisitTurn && (
          <Button variant="secondary" block={true} icon={<RefreshIcon width={23} height={23} />} onClick={handleMoveButton}>
            جابجایی نوبت
          </Button>
        )}
      </div>

      {paymentStatus === PaymentStatus.paying && !localPaymentCenters.includes(centerId) && (
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
              splunkInstance('doctor-profile').sendEvent({
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
            ? `لطفا دلیل ${status === BookStatus.notVisited ? 'لغو نوبت' : 'درخواست  حذف نوبت و استرداد وجه'} را انتخاب کنید`
            : notRefundable
            ? 'عدم امکان لغو نوبت'
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
            <Alert severity="warning" className="flex items-center gap-2 p-2 mb-4">
              <WarningIcon className="w-8" />
              <Text fontSize="sm">
                زمان نوبت شما کمتر از <b>{respiteDeleteTurn} ساعت</b> دیگر است و امکان لغو نوبت وجود ندارد.
              </Text>
            </Alert>
          )}
          <div className="flex space-s-2">
            {(!notRefundable || centerType == CenterType.consult) && (
              <Button
                theme="error"
                block
                onClick={removeBookAction}
                loading={removeBookApi.isLoading}
                data-testid="modal__remove-turn-button"
                disabled={isOnlineVisitTurn && !reasonDeleteTurn}
              >
                {isOnlineVisitTurn && status !== BookStatus.notVisited ? 'حذف نوبت و استرداد وجه' : 'لغو نوبت'}
              </Button>
            )}
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
