import { useGetReceiptDetails } from '@/common/apis/services/booking/getReceiptDetails';
import { useGetServerTime } from '@/common/apis/services/general/getServerTime';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text';
import ErrorIcon from '@/common/components/icons/error';
import SuccessIcon from '@/common/components/icons/success';
import TrashIcon from '@/common/components/icons/trash';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { withCSR } from '@/common/hoc/withCsr';
import useModal from '@/common/hooks/useModal';
import usePdfGenerator from '@/common/hooks/usePdfGenerator';
import useShare from '@/common/hooks/useShare';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import isAfterPastDaysFromTimestamp from '@/common/utils/isAfterPastDaysFromTimestamp ';
import Select from '@/modules/booking/components/select/select';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import MessengerButton from '@/modules/myTurn/components/messengerButton/messengerButton';
import deleteTurnQuestion from '@/modules/myTurn/constants/deleteTurnQuestion.json';
import { CenterType } from '@/modules/myTurn/types/centerType';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import { getCookie } from 'cookies-next';
import { shuffle } from 'lodash';
import md5 from 'md5';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
const { publicRuntimeConfig } = getConfig();

const Receipt = () => {
  const {
    query: { bookId, centerId, pincode },
    ...router
  } = useRouter();

  const userId = useUserInfoStore(state => state.info.id);
  const { handleOpen: handleOpenRemoveModal, handleClose: handleCloseRemoveModal, modalProps: removeModalProps } = useModal();
  const deleteTurnQuestionAffterVisit = useMemo(() => shuffle(deleteTurnQuestion.affter_visit), [deleteTurnQuestion]);
  const deleteTurnQuestionBefforVisit = useMemo(() => shuffle(deleteTurnQuestion.befor_visit), [deleteTurnQuestion]);
  const {
    handleOpen: handleOpenWaitingTimeModal,
    handleClose: handleCloseWaitingTimeModal,
    modalProps: WaitingTimeModalProps,
  } = useModal();

  const getReceiptDetails = useGetReceiptDetails({
    book_id: bookId as string,
    center_id: centerId as string,
    pincode: (pincode as string) ?? (userId && md5(userId)),
  });
  const pdfGenerator = usePdfGenerator({
    ref: 'receipt',
    fileName: 'Paziresh24-Receipt',
    orientation: 'portrait',
    pageSize: 'a4',
    scale: 2,
  });
  const { removeBookApi, centerMap } = useBookAction();
  const [reasonDeleteTurn, setReasonDeleteTurn] = useState(null);
  const share = useShare();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const serverTime = useGetServerTime();
  const { handleOpenLoginModal } = useLoginModalContext();
  const centerType = centerId === '5532' ? CenterType.consult : CenterType.clinic;

  const bookDetailsData = useMemo(() => getReceiptDetails.isSuccess && getReceiptDetails.data?.data?.data, [getReceiptDetails.status]);
  const possibilityBeingVisited = !isAfterPastDaysFromTimestamp({
    numberDay: 3,
    currentTime: serverTime?.data?.data?.data.timestamp,
    timestamp: bookDetailsData.book_time,
  });

  useEffect(() => {
    if (getReceiptDetails.isSuccess) {
      if (getReceiptDetails.data.data?.data?.center?.waiting_time === 'بیشتر از یک ساعت') {
        handleOpenWaitingTimeModal();
      }
    }
  }, [getReceiptDetails.status]);

  useEffect(() => {
    // Prefetch the doctor profile page
    router.prefetch('/patient/appointments');
  }, []);

  const turnStatus = {
    deletedTurn: bookDetailsData.is_deleted,
    expiredTurn: bookDetailsData.book_status === 'expired',
    requestedTurn: bookDetailsData.is_book_request,
    notVisitedTurn: bookDetailsData.book_status === 'not_visited',
    visitedTurn: bookDetailsData.book_status === 'visited',
  };

  const isShowRemoveButtonForOnlineVisit =
    !!bookDetailsData && !turnStatus.deletedTurn && !turnStatus.visitedTurn && possibilityBeingVisited;
  const showOptionalButton = centerType === 'clinic' && !turnStatus.deletedTurn && !turnStatus.expiredTurn && !turnStatus.requestedTurn;

  const handleRemoveBookTurn = () => {
    removeBookApi.mutate(
      {
        center_id: bookDetailsData.center_id,
        national_code: bookDetailsData.patient?.national_code,
        reference_code: bookDetailsData.reference_code,
      },
      {
        onSuccess: data => {
          if (data.data.status === ClinicStatus.SUCCESS) {
            handleCloseRemoveModal();
            toast.success('نوبت شما با موفقیت لغو شد!');
            if (centerType === 'consult') {
              splunkInstance().sendEvent({
                group: 'my-turn',
                type: 'delete-turn-reason',
                event: {
                  terminal_id: getCookie('terminal_id'),
                  doctorName: bookDetailsData.doctor?.display_name,
                  expertise: bookDetailsData.doctor?.display_expertise,
                  phoneNumber: bookDetailsData?.patient?.cell,
                  nationalCode: bookDetailsData?.patient?.national_code,
                  trackingCode: bookDetailsData?.reference_code,
                  patientName: `${bookDetailsData?.patient?.name} ${bookDetailsData?.patient?.family}`,
                  reason: reasonDeleteTurn,
                  isVisited: turnStatus.visitedTurn,
                },
              });
            }
            router.push('/patient/appointments');
            return;
          }
          toast.error(data.data.message);
        },
      },
    );
  };

  const handleRemoveBookClick = () => {
    if (!isLogin) {
      handleOpenLoginModal({ state: true, postLogin: handleOpenRemoveModal });
      return;
    }
    handleOpenRemoveModal();
  };

  const handleShareAction = () => {
    share({
      text: `رسید نوبت ${bookDetailsData?.doctor.display_name} برای ${bookDetailsData?.patient?.name} ${bookDetailsData?.patient?.family}`,
      title: 'رسیدنوبت',
      url: bookDetailsData.share_url,
    });
  };
  const handleMyTrunButtonAction = () => {
    router.push({
      pathname: '/patient/appointments',
    });
  };

  const statusText = useMemo(() => {
    if (turnStatus.deletedTurn) return 'نوبت شما لغو شده است';
    if (turnStatus.expiredTurn && centerType !== 'consult') return 'زمان نوبت شما به پایان رسیده است';
    if (turnStatus.expiredTurn && centerType === 'consult') return '';
    return 'نوبت شما با موفقیت ثبت شد';
  }, [turnStatus, centerType]);

  return (
    <>
      <Seo title="رسید نوبت" noIndex />
      <div className="flex flex-col-reverse items-start max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="w-full p-5 space-y-6 bg-white md:basis-4/6 md:rounded-lg shadow-card">
          <div id="receipt" className="flex flex-col space-y-4">
            {!turnStatus.requestedTurn && !!statusText && (
              <>
                {getReceiptDetails.isSuccess ? (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    {turnStatus.deletedTurn || turnStatus.expiredTurn ? (
                      <ErrorIcon className="text-red-500" />
                    ) : (
                      <SuccessIcon className="text-green-600" />
                    )}
                    <Text
                      fontWeight="bold"
                      className={classNames('text-green-600', {
                        'text-red-500': turnStatus.deletedTurn || turnStatus.expiredTurn,
                      })}
                    >
                      {statusText}
                    </Text>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col items-center w-full">
                      <Skeleton w="2.9rem" h="2.9rem" rounded="full" className="mb-4" />
                      <Skeleton w="10rem" h="1.1rem" rounded="md" />
                    </div>
                  </>
                )}
              </>
            )}
            <BookInfo
              turnData={bookDetailsData}
              loading={getReceiptDetails.isLoading || getReceiptDetails.isIdle}
              centerId={centerId?.toString()!}
            />
          </div>
          {showOptionalButton && (
            <>
              {getReceiptDetails.isSuccess ? (
                <div className="flex flex-col space-y-3">
                  <div className="flex space-s-3">
                    <Button block variant="secondary" onClick={pdfGenerator}>
                      دانلود رسید نوبت
                    </Button>
                    <Button block variant="secondary" onClick={handleShareAction}>
                      اشتراک گذاری
                    </Button>
                  </div>
                  <div className="flex space-s-3">
                    <Button block variant="secondary" onClick={handleMyTrunButtonAction}>
                      نوبت های من
                    </Button>
                    <Button block variant="secondary" theme="error" icon={<TrashIcon />} onClick={handleRemoveBookClick}>
                      لغو نوبت
                    </Button>
                  </div>
                  <Button block variant="secondary" onClick={() => centerMap(bookDetailsData.center?.location)}>
                    مشاهده در نقشه و مسیریابی
                  </Button>
                </div>
              ) : (
                <ReceiptButtonLoading />
              )}
            </>
          )}
          {turnStatus.requestedTurn && (
            <Button block variant="secondary" onClick={handleMyTrunButtonAction}>
              نوبت های من
            </Button>
          )}
          {centerType === 'consult' && (
            <div className="grid gap-2">
              {!turnStatus.deletedTurn && possibilityBeingVisited && (
                <MessengerButton
                  channel={
                    bookDetailsData.selected_online_visit_channel?.type
                      ? bookDetailsData?.selected_online_visit_channel
                      : bookDetailsData?.doctor?.online_visit_channels?.filter((item: any) => !(item.type as string).endsWith('_number'))[0]
                  }
                />
              )}
              {isShowRemoveButtonForOnlineVisit && (
                <Button block variant="secondary" theme="error" icon={<TrashIcon />} onClick={handleRemoveBookClick}>
                  {turnStatus.visitedTurn ? 'استرداد وجه' : 'لغو نوبت'}
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="w-full p-3 mb-2 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
          <DoctorInfo
            className="p-4 rounded-lg bg-slate-50"
            avatar={publicRuntimeConfig.CLINIC_BASE_URL + bookDetailsData?.doctor?.image}
            fullName={bookDetailsData.doctor?.display_name}
            expertise={bookDetailsData.doctor?.display_expertise}
            isLoading={getReceiptDetails.isLoading || getReceiptDetails.isIdle}
          />
        </div>
        <Modal
          title={
            centerType === 'consult'
              ? `لطفا دلیل ${turnStatus.notVisitedTurn ? 'لغو نوبت' : 'درخواست استرداد وجه'} را انتخاب کنید`
              : 'آیا از لغو نوبت اطمینان دارید؟'
          }
          {...removeModalProps}
        >
          <div className="flex flex-col gap-3 mb-3">
            {centerId === CENTERS.CONSULT &&
              (turnStatus.notVisitedTurn ? deleteTurnQuestionBefforVisit : deleteTurnQuestionAffterVisit).map((question: any) => (
                <Select
                  key={question.id}
                  selected={reasonDeleteTurn === question.value}
                  onSelect={() => setReasonDeleteTurn(question.value)}
                  title={question.text}
                />
              ))}
          </div>
          <div className="flex space-s-2">
            <Button theme="error" block onClick={handleRemoveBookTurn} loading={removeBookApi.isLoading}>
              لغو نوبت
            </Button>
            <Button theme="error" variant="secondary" block onClick={handleCloseRemoveModal}>
              انصراف
            </Button>
          </div>
        </Modal>
        <Modal title="احتمال معطلی بیش از یک ساعت!" {...WaitingTimeModalProps}>
          <div className="flex flex-col space-y-3">
            <Text fontWeight="medium">نوبت شما ثبت شد ولی با توجه به گزارش کاربران، احتمال معطلی بیش از یک ساعت در مرکز وجود دارد.</Text>
            <Button block onClick={() => handleCloseWaitingTimeModal()}>
              مشاهده رسید نوبت
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

const ReceiptButtonLoading = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
      </div>
      <div className="flex justify-between items-center !mt-3">
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
        <Skeleton w="49%" h="2.8rem" rounded="lg" />
      </div>
      <div className="!mt-3">
        <Skeleton w="100%" h="2.8rem" rounded="lg" />
      </div>
    </>
  );
};

Receipt.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter shouldShowPromoteApp={false} {...page.props.config} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};

export const getServerSideProps = withCSR(async (context: GetServerSidePropsContext) => {
  return {
    props: {
      query: context.query,
    },
  };
});

export default Receipt;
