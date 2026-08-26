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
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { OnlineVisitCancelModal } from '@/modules/myTurn/components/onlineVisitCancelModal';
import { WrongDoctorCancelSuccessModal } from '@/modules/myTurn/components/wrongDoctorCancelSuccessModal';
import { cancelGhandonCalendarEvent } from '@/modules/receipt/components/GoogleCalendarAddEvent/cancelGhandonCalendarEvent';
import deleteTurnQuestion from '@/modules/myTurn/constants/deleteTurnQuestion.json';
import {
  getExpiredOnlineVisitCancelReasons,
  ONLINE_VISIT_BOOK_IN_PERSON_CANCEL_REASON,
  ONLINE_VISIT_CANCEL_REASONS_BEFORE_VISIT,
  WRONG_DOCTOR_CANCEL_REASON,
} from '@/modules/myTurn/constants/deleteTurnReasons';
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
import { useGetCancellationPolicyStatus } from '@/common/apis/services/booking/cancellationPolicy';
const { publicRuntimeConfig } = getConfig();

interface TurnFooterProps {
  id: string;
  slug: string;
  status: BookStatus;
  isDelete: boolean;
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
  serverId: number;
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
    isDelete,
    serverId,
  } = props;
  const { t } = useTranslation('patient/appointments');
  const { handleOpen: handleOpenQueueModal, modalProps: queueModalProps } = useModal();
  const { handleOpen: handleOpenMoveTurnModal, handleClose: handleCloseMoveTurnModal, modalProps: moveTurnModalProps } = useModal();
  const { handleOpen: handleOpenTurnDesciription, modalProps: turnDesciriptionProp } = useModal();
  const { handleOpen: handleOpenWrongDoctorSuccess, modalProps: wrongDoctorSuccessModalProps } = useModal();
  const {
    handleOpen: handleOpenRemoveTurn,
    handleClose: handleCloseRemoveTurnModal,
    modalProps: removeTurnProp,
  } = useModal({
    onClose: () => {
      setReasonDeleteTurn(null);
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_center_id: undefined,
        center_id: undefined,
        book_id: undefined,
        slug: undefined,
      });
    },
  });
  const getCancellationPolicyStatus = useGetCancellationPolicyStatus({ book_id: id }, { enabled: false });
  const router = useRouter();
  const { removeBookApi } = useBookAction();
  const { removeBook, moveBook } = useBookStore();
  const userId = useUserInfoStore(state => state.info?.id?.toString());
  const [reasonDeleteTurn, setReasonDeleteTurn] = useState<string | null>(null);
  const [isBookInPersonLoading, setIsBookInPersonLoading] = useState(false);
  const safeCallModuleInfo = useFeatureValue<any>('online_visit_secure_call', {});
  const isBookForToday = isToday(new Date(bookTime));
  const moveBookApi = useMoveBook();
  const isOnlineVisitTurn = centerType === CenterType.consult;
  const isRequestVisitTurn = status === BookStatus.requested;
  const canShowBookInPersonBanner = isOnlineVisitTurn && (status === BookStatus.notVisited || status === BookStatus.expired);
  const deleteTurnQuestionAffterVisit = useMemo(() => shuffle(deleteTurnQuestion.affter_visit), [deleteTurnQuestion]);
  const onlineVisitCancelReasons = useMemo(() => {
    if (status === BookStatus.notVisited) return [...ONLINE_VISIT_CANCEL_REASONS_BEFORE_VISIT];
    if (status === BookStatus.expired) return getExpiredOnlineVisitCancelReasons(deleteTurnQuestionAffterVisit);
    return deleteTurnQuestionAffterVisit;
  }, [status, deleteTurnQuestionAffterVisit]);
  const shouldShowRemoveTurn =
    !isDelete &&
    (isRequestVisitTurn ||
      ((status === BookStatus.notVisited || (isOnlineVisitTurn && status !== BookStatus.visited)) &&
        paymentStatus !== PaymentStatus.paying));

  const shouldShowMessengerButton =
    isOnlineVisitTurn && paymentStatus !== PaymentStatus.paying && !isDelete && selectedOnlineVisitChannel && possibilityBeingVisited;

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
    if (isRequestVisitTurn) {
      router.push(`/booking/${slug}?centerId=${centerId}`);
      return;
    }
    router.push(`/booking/${slug}?centerId=${centerId}&serviceId=${serviceId} `);
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

  const cancelOnlineVisitBook = async ({ reason, onSuccess }: { reason: string; onSuccess?: () => void }) => {
    return removeBookApi.mutateAsync(
      {
        center_id: centerId,
        reference_code: trackingCode,
        national_code: nationalCode,
        book_id: id,
        isBookRequest: isRequestVisitTurn,
      },
      {
        onSuccess: data => {
          if (data.data?.status === ClinicStatus?.SUCCESS) {
            cancelGhandonCalendarEvent({
              user_id: userId,
              book_id: id,
            });
            toast.success(data.data?.message);
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
                  reason,
                  isVisited: status === BookStatus.visited,
                },
              });
            }
            if (reason === WRONG_DOCTOR_CANCEL_REASON) {
              handleOpenWrongDoctorSuccess();
            } else {
              onSuccess?.();
            }
            return;
          }
          if (data.data?.status) {
            toast.error(data.data.message ?? data.data?.[0]?.message);
          } else {
            cancelGhandonCalendarEvent({
              user_id: userId,
              book_id: id,
            });
            removeBook({ bookId: id });
            handleCloseRemoveTurnModal();
            toast.success(data.data.message ?? data.data?.[0]?.message);
            if (reason === WRONG_DOCTOR_CANCEL_REASON) {
              handleOpenWrongDoctorSuccess();
            } else {
              onSuccess?.();
            }
          }
        },
        onError: (error: any) => {
          if (axios.isAxiosError(error)) {
            toast.error(error.response?.data?.message);
          }
        },
      },
    );
  };

  const removeBookAction = () => {
    if (!reasonDeleteTurn) return;
    return cancelOnlineVisitBook({ reason: reasonDeleteTurn });
  };

  const showRemoveTurnModal = () => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      user_center_id: userCenterId,
      center_id: centerId,
      book_id: id,
      slug: slug,
    });
    if (serverId != 1) {
      getCancellationPolicyStatus.remove();
      getCancellationPolicyStatus.refetch();
    }
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

  const handleBookInPerson = async () => {
    setIsBookInPersonLoading(true);
    try {
      await cancelOnlineVisitBook({
        reason: ONLINE_VISIT_BOOK_IN_PERSON_CANCEL_REASON,
        onSuccess: () => router.push(`/booking/${slug}`),
      });
    } finally {
      setIsBookInPersonLoading(false);
    }
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
          {/* <MessengerButton channel={selectedOnlineVisitChannel} />
          {onlineVisitChannels?.some((channel: { type: string }) => channel.type === 'secure_call') && (
            <SecureCallButton bookId={id} extraAction={() => handleSafeCallAction()} />
          )} */}
          <Button className="w-full" onClick={() => location.assign(`/receipt/${centerId}/${id}`)}>
            مشاهده قبض نوبت و گفتگو با پزشک
          </Button>
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
            {isOnlineVisitTurn && status !== BookStatus.notVisited
              ? 'حذف نوبت و استرداد وجه'
              : isRequestVisitTurn
              ? 'لغو درخواست'
              : 'لغو نوبت'}
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

      {([BookStatus.expired, BookStatus.visited, BookStatus.rejected].includes(status) || isDelete) && (
        <div className="flex gap-2">
          {isBookForToday && ClinicPrimaryButton}
          <Button variant="secondary" block={true} onClick={reBook}>
            {isRequestVisitTurn ? 'درخواست مجدد' : t('turnAction.rebook')}
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
          serverId={serverId?.toString()}
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
      {isOnlineVisitTurn ? (
        <OnlineVisitCancelModal
          modalProps={removeTurnProp}
          title={status === BookStatus.notVisited ? 'لغو نوبت ویزیت آنلاین' : 'لطفا دلیل درخواست حذف نوبت و استرداد وجه را انتخاب کنید'}
          confirmLabel={status === BookStatus.notVisited ? 'لغو نوبت' : 'حذف نوبت و استرداد وجه'}
          selectedReason={reasonDeleteTurn}
          onReasonChange={setReasonDeleteTurn}
          onConfirm={removeBookAction}
          onBookInPerson={canShowBookInPersonBanner ? handleBookInPerson : undefined}
          reasons={onlineVisitCancelReasons}
          isLoading={removeBookApi.isLoading || (serverId != 1 && getCancellationPolicyStatus.isLoading)}
          isBookInPersonLoading={isBookInPersonLoading}
          showInPersonBanner={canShowBookInPersonBanner}
        >
          {serverId != 1 && getCancellationPolicyStatus.data?.data?.is_paid && (
            <Alert severity="warning" className="mb-4 flex items-center gap-3 p-3">
              <WarningIcon className="w-5" />
              <Text fontSize="sm" fontWeight="medium">
                {getCancellationPolicyStatus.data?.data?.refundable
                  ? 'وجه پرداختی شما تا یک ساعت بعد از لغو نوبت به شما مسترد خواهد شد.'
                  : 'با توجه به قوانین استرداد مرکز، وجه پرداختی شما مسترد نخواهد شد.'}
              </Text>
            </Alert>
          )}
        </OnlineVisitCancelModal>
      ) : (
        <Modal
          title={
            notRefundable
              ? 'عدم امکان لغو نوبت'
              : isRequestVisitTurn
              ? 'آیا از لغو درخواست اطمینان دارید؟'
              : 'آیا از لغو نوبت اطمینان دارید؟'
          }
          {...removeTurnProp}
        >
          <>
            {notRefundable && (
              <Alert severity="warning" className="mb-4 flex items-center gap-2 p-2">
                <WarningIcon className="w-8" />
                <Text fontSize="sm">
                  زمان نوبت شما کمتر از <b>{respiteDeleteTurn} ساعت</b> دیگر است و امکان لغو نوبت وجود ندارد.
                </Text>
              </Alert>
            )}
            {serverId != 1 && getCancellationPolicyStatus.data?.data?.is_paid && (
              <Alert severity="warning" className="mb-4 flex items-center gap-3 p-3">
                <WarningIcon className="w-5" />
                <Text fontSize="sm" fontWeight="medium">
                  {getCancellationPolicyStatus.data?.data?.refundable
                    ? 'وجه پرداختی شما تا یک ساعت بعد از لغو نوبت به شما مسترد خواهد شد.'
                    : 'با توجه به قوانین استرداد مرکز، وجه پرداختی شما مسترد نخواهد شد.'}
                </Text>
              </Alert>
            )}
            <div className="flex space-s-2">
              {!notRefundable && (
                <Button
                  theme="error"
                  block
                  onClick={() => cancelOnlineVisitBook({ reason: isRequestVisitTurn ? 'cancel_request' : 'offline_cancel' })}
                  loading={removeBookApi.isLoading || (serverId != 1 && getCancellationPolicyStatus.isLoading)}
                  data-testid="modal__remove-turn-button"
                >
                  {isRequestVisitTurn ? 'لغو درخواست' : 'لغو نوبت'}
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
      )}
      <Modal {...turnDesciriptionProp} title="توضیحات درمان">
        <Text fontSize="sm">{description}</Text>
      </Modal>
      <WrongDoctorCancelSuccessModal modalProps={wrongDoctorSuccessModalProps} doctorSlug={slug} expertiseName={expertise} />
    </>
  );
};

export default TurnFooter;
