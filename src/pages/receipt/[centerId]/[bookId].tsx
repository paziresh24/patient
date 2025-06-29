import { useGetReceiptDetails } from '@/common/apis/services/booking/getReceiptDetails';
import { useGetServerTime } from '@/common/apis/services/general/getServerTime';
import Alert from '@/common/components/atom/alert';
import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal/modal';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import Timer from '@/common/components/atom/timer';
import ErrorIcon from '@/common/components/icons/error';
import SuccessIcon from '@/common/components/icons/success';
import TrashIcon from '@/common/components/icons/trash';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import Seo from '@/common/components/layouts/seo';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { withCSR } from '@/common/hoc/withCsr';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import usePdfGenerator from '@/common/hooks/usePdfGenerator';
import usePwa from '@/common/hooks/usePwa';
import useShare from '@/common/hooks/useShare';
import { Fragment } from '@/common/fragment';
import { splunkInstance } from '@/common/services/splunk';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import isAfterPastDaysFromTimestamp from '@/common/utils/isAfterPastDaysFromTimestamp ';
import { isPWA } from '@/common/utils/isPwa';
import Select from '@/modules/booking/components/select/select';
import { sendBookEvent } from '@/modules/booking/events/book';
import { useBookAction } from '@/modules/booking/hooks/receiptTurn/useBookAction';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import DoctorInfo from '@/modules/myTurn/components/doctorInfo';
import MessengerButton from '@/modules/myTurn/components/messengerButton';
import { SecureCallButton } from '@/modules/myTurn/components/secureCallButton/secureCallButton';
import deleteTurnQuestion from '@/modules/myTurn/constants/deleteTurnQuestion.json';
import { CenterType } from '@/modules/myTurn/types/centerType';
import { useProfile } from '@/modules/profile/hooks/useProfile';
import BookInfo from '@/modules/receipt/views/bookInfo/bookInfo';
import { useFeatureIsOn, useFeatureValue } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import moment from 'jalali-moment';
import { shuffle } from 'lodash';
import md5 from 'md5';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { growthbook } from 'src/pages/_app';
import Script from 'next/script';
import axios from 'axios';
import WarningIcon from '@/common/components/icons/warning';
import { useGetCancellationPolicyStatus } from '@/common/apis/services/booking/cancellationPolicy';
const { publicRuntimeConfig } = getConfig();

const Receipt = () => {
  const shouldUsePlasmicActionButtons = useFeatureIsOn('plasmic:receipt-action-buttons|enabled');
  const {
    query: { bookId, centerId, pincode, action },
    ...router
  } = useRouter();
  const { appDownloadSource, getRatingAppLink } = usePwa();
  const user = useUserInfoStore(state => state.info);
  const customize = useCustomize(state => state.customize);
  const { handleOpen: handleOpenRemoveModal, handleClose: handleCloseRemoveModal, modalProps: removeModalProps } = useModal();
  const { handleOpen: handleOpenRateAppModal, handleClose: handleCloseRateAppModal, modalProps: rateAppModal } = useModal();
  const deleteTurnQuestionAffterVisit = useMemo(() => shuffle(deleteTurnQuestion.affter_visit), [deleteTurnQuestion]);
  const deleteTurnQuestionBefforVisit = useMemo(() => shuffle(deleteTurnQuestion.befor_visit), [deleteTurnQuestion]);
  const {
    handleOpen: handleOpenWaitingTimeModal,
    handleClose: handleCloseWaitingTimeModal,
    modalProps: waitingTimeModalProps,
  } = useModal();
  const { handleOpen: handleOpenWaitingTimeFollowUpModal, modalProps: waitingTimeFollowUpModalProps } = useModal();
  const {
    handleOpen: handleOpenNotificationGrantAccses,
    handleClose: handleCloseNotificationGrantAccses,
    modalProps: notificationGrantAccsesModalProps,
  } = useModal();
  const [isWattingTimeFollowUpLoadingButton, setIsWattingTimeFollowUpLoadingButton] = useState(false);
  const [hasHolidays, setHasHolidays] = useState(false);

  const getReceiptDetails = useGetReceiptDetails({
    book_id: bookId as string,
    center_id: centerId as string,
    pincode: pincode as string,
  });
  const pdfGenerator = usePdfGenerator({
    ref: 'receipt',
    fileName: 'Paziresh24-Receipt',
    orientation: 'portrait',
    pageSize: 'a4',
    scale: 2,
  });
  const getCancellationPolicyStatus = useGetCancellationPolicyStatus({ book_id: bookId as string }, { enabled: false });
  const { removeBookApi, centerMap } = useBookAction();
  const [reasonDeleteTurn, setReasonDeleteTurn] = useState(null);
  const shouldShowRateAppModal = useFeatureIsOn('receipt:rate-app-modal');
  const rateAppModalInfo = useFeatureValue<any>('receipt:rate-app-info', {});
  const share = useShare();
  const isLogin = useUserInfoStore(state => state.isLogin);
  const userPednding = useUserInfoStore(state => state.pending);
  const serverTime = useGetServerTime();
  const { handleOpenLoginModal } = useLoginModalContext();
  const centerType = centerId === '5532' ? CenterType.consult : CenterType.clinic;
  const bookDetailsData = useMemo(
    () => getReceiptDetails.isSuccess && getReceiptDetails.data?.data?.data,
    [getReceiptDetails.status, getReceiptDetails?.data],
  );
  const possibilityBeingVisited = !isAfterPastDaysFromTimestamp({
    numberDay: 3,
    currentTime: serverTime?.data?.data?.data.timestamp,
    timestamp: bookDetailsData.book_time,
  });
  const notificationGrantAccsesModalText = useFeatureValue('receipt:notification-grant-modal', '');
  const showDoctorAvailabilityWarning = useFeatureValue('show-doctor-availability-warning', '');
  const { isLoading: profileNameLoading, specialities } = useProfile({
    slug: bookDetailsData?.doctor?.slug,
    includeData: ['SPECIALITIES'],
  });

  const doctorName = bookDetailsData?.doctor?.display_name;

  useEffect(() => {
    if (!pincode && !isLogin && !userPednding) {
      router.replace(`/login?redirect_url=${router.asPath}`);
    }
  }, [isLogin, userPednding, pincode]);

  useEffect(() => {
    if (getReceiptDetails.isSuccess) {
      if (getReceiptDetails.data.data?.data?.center?.waiting_time === 'بیشتر از یک ساعت' && !shouldShowRateAppModal) {
        handleOpenWaitingTimeModal();
        return;
      }

      if (
        isPWA() &&
        isActiveTurn &&
        shouldShowRateAppModal &&
        customize.showPromoteApp &&
        !getReceiptDetails?.data?.data?.data?.is_book_request
      ) {
        handleOpenRateAppModal();
        return;
      }
    }
  }, [getReceiptDetails.status, getReceiptDetails?.data]);

  useEffect(() => {
    if (document.referrer.includes('shaparak.ir') && bookDetailsData) {
      sendBookEvent({
        bookInfo: {
          center_id: centerId,
          from: bookDetailsData.book_time,
          reference_code: bookDetailsData.reference_code,
        },
        doctorInfo: {
          doctor_name: doctorName,
          group_expertises: bookDetailsData.doctor.display_expertise,
          server_id: bookDetailsData.server_id,
          center_type_name: bookDetailsData.is_online_visit ? 'ویزیت آنلاین' : bookDetailsData.server_id === 1 ? 'مطب' : 'بیمارستان',
          center_tell: bookDetailsData.center.display_number,
          center_address: bookDetailsData.center.address,
          service_alias_title: bookDetailsData?.services?.[0]?.title,
          service_id: bookDetailsData?.services?.[0]?.id,
        },
        userInfo: {
          ...bookDetailsData.patient,
        },
      });
    }
  }, [bookDetailsData]);

  const duration = moment.duration(
    moment(bookDetailsData.book_time * 1000)
      .add(1, 'hour')
      .diff(moment(serverTime?.data?.data?.data.timestamp * 1000)),
  );

  let minutes = Math.floor(duration.minutes());
  let seconds = Math.floor(duration.seconds());

  let formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

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
  const isActiveTurn = !turnStatus.deletedTurn && !turnStatus.visitedTurn && !turnStatus.expiredTurn && possibilityBeingVisited;
  const isShowRemoveButtonForOnlineVisit =
    !!bookDetailsData && !turnStatus.deletedTurn && !turnStatus.visitedTurn && possibilityBeingVisited;
  const showOptionalButton = centerType === 'clinic' && !turnStatus.deletedTurn && !turnStatus.expiredTurn && !turnStatus.requestedTurn;

  const handleRemoveBookTurn = () => {
    removeBookApi.mutate(
      {
        center_id: bookDetailsData.center_id,
        national_code: bookDetailsData.patient?.national_code,
        reference_code: bookDetailsData.reference_code,
        book_id: bookId as string,
        isBookRequest: turnStatus.requestedTurn,
      },
      {
        onSuccess: data => {
          if (data.data.status === ClinicStatus.SUCCESS) {
            handleCloseRemoveModal();
            toast.success(data.data?.message);
            if (centerType === 'consult') {
              splunkInstance('doctor-profile').sendEvent({
                group: 'my-turn',
                type: 'delete-turn-reason',
                event: {
                  terminal_id: getCookie('terminal_id'),
                  doctorName: doctorName,
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
          if (data.data?.status) {
            toast.error(data.data.message ?? data.data?.[0]?.message);
          } else {
            handleCloseRemoveModal();
            toast.success(data.data.message ?? data.data?.[0]?.message);
            router.push('/patient/appointments');
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

  const handleRemoveBookClick = () => {
    if (bookDetailsData?.doctor?.server_id != 1) {
      getCancellationPolicyStatus.remove();
      getCancellationPolicyStatus.refetch();
    }
    if (!isLogin) {
      handleOpenLoginModal({ state: true, postLogin: handleOpenRemoveModal });
      return;
    }
    handleOpenRemoveModal();
  };

  const handleShareAction = () => {
    share({
      text: `رسید نوبت ${doctorName} برای ${bookDetailsData?.patient?.name} ${bookDetailsData?.patient?.family}`,
      title: 'رسیدنوبت',
      url: bookDetailsData.share_url,
    });
  };
  const handleMyTrunButtonAction = () => {
    router.push({
      pathname: '/patient/appointments',
      query: {
        type: turnStatus.requestedTurn ? 'book_request' : 'book',
      },
    });
  };

  const handleSafeCallAction = () => {
    splunkInstance('booking').sendEvent({
      group: 'safe-call',
      type: 'patient',
      event: {
        action: 'receipt',
        data: {
          referenceCode: bookDetailsData.reference_code,
          doctor: { centerId: bookDetailsData.center_id, name: bookDetailsData?.doctor?.doctor_name },
          patient: {
            cell: bookDetailsData.patient.cell,
            name: `${bookDetailsData.patient.name} ${bookDetailsData.patient.family}`,
            nationalCode: bookDetailsData.national_code,
          },
        },
      },
    });
  };

  const handleRedirectToStore = () => {
    location.assign((getRatingAppLink as string) ?? '#');
    splunkInstance('booking').sendEvent({
      group: 'rate app',
      type: 'rate app click button',
      event: {
        data: {
          referenceCode: bookDetailsData.reference_code,
          doctor: { centerId: bookDetailsData.center_id, name: bookDetailsData?.doctor?.doctor_name },
          patient: {
            cell: bookDetailsData.patient.cell,
            name: `${bookDetailsData.patient.name} ${bookDetailsData.patient.family}`,
            nationalCode: bookDetailsData.national_code,
          },
        },
      },
    });
  };

  const statusText = useMemo(() => {
    if (turnStatus.deletedTurn && turnStatus.requestedTurn) return 'درخواست شما لغو شده است';
    if (turnStatus.deletedTurn) return 'نوبت شما لغو شده است';
    if (turnStatus.expiredTurn && centerType !== 'consult') return 'زمان نوبت شما به پایان رسیده است';
    if (turnStatus.expiredTurn && centerType === 'consult') return '';
    if (turnStatus.requestedTurn) return '';
    return 'نوبت شما با موفقیت ثبت شد';
  }, [turnStatus, centerType]);

  useEffect(() => {
    if (isLogin) {
      window.najvaUserSubscribed = function (najva_user_token: string) {
        axios.post(`${publicRuntimeConfig.API_GATEWAY_BASE_URL}/v1/notification/subscribers`, {
          user_id: user.id,
          subscriber_token: najva_user_token,
        });
      };
    }
  }, [isLogin]);

  useEffect(() => {
    if (bookDetailsData?.book_time && centerId !== CENTERS.CONSULT && bookDetailsData?.center?.type_id == 1) {
      const bookDate = moment(bookDetailsData.book_time * 1000);
      const bookDateStr = bookDate.format('YYYY-MM-DD');
      const startDate = bookDate.clone().subtract(3, 'days').format('YYYY-MM-DD');
      const endDate = bookDate.clone().add(3, 'days').format('YYYY-MM-DD');

      axios
        .get(`https://apigw.paziresh24.com/v1/holidays?start_date=${startDate}&end_date=${endDate}`)
        .then(response => {
          // Get the appointment date as a moment object for comparison
          const appointmentDate = moment(bookDateStr);

          // Create an array of all dates in the range
          const allDates = [];
          const currentDate = moment(startDate);
          const lastDate = moment(endDate);

          while (currentDate.isSameOrBefore(lastDate)) {
            allDates.push(currentDate.format('YYYY-MM-DD'));
            currentDate.add(1, 'days');
          }

          // Get holidays from API response
          const apiHolidays = response.data && response.data.length > 0 ? response.data.map((holiday: any) => holiday.date) : [];

          // Add Fridays (Iranian weekend) to the holiday list
          const allHolidays = [...apiHolidays];

          allDates.forEach(date => {
            const dayOfWeek = moment(date).day();
            // In moment.js, Friday is day 5 (0 is Sunday, 1 is Monday, etc.)
            if (dayOfWeek === 5 && !allHolidays.includes(date)) {
              allHolidays.push(date);
            }
          });

          if (allHolidays.length > 0) {
            // Find if there are holidays before and after the appointment date
            const holidaysBeforeAppointment = allHolidays.some((date: string) => moment(date).isBefore(appointmentDate));

            const holidaysAfterAppointment = allHolidays.some((date: string) => moment(date).isAfter(appointmentDate));

            // Set hasHolidays to true only if the appointment is between holidays
            if (holidaysBeforeAppointment && holidaysAfterAppointment) {
              setHasHolidays(true);
            }
          }
        })
        .catch(error => {
          console.error('Error fetching holidays:', error);
        });
    }
  }, [bookDetailsData?.book_time]);

  useEffect(() => {
    if (bookDetailsData?.book_id) {
      {
        growthbook.loadFeatures({ skipCache: true });
        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          slug: bookDetailsData?.doctor?.slug,
          book_id: bookId,
          center_id: centerId,
          is_book_request: bookDetailsData?.is_book_request,
          doctor_city: bookDetailsData?.center?.city?.en_slug,
        });

        if (bookDetailsData?.doctor?.id) {
          splunkInstance('booking').sendEvent({
            group: 'view-receipt-page',
            type: 'view-receipt-page',
            event: {
              doctor_id: bookDetailsData?.doctor?.id,
              slug: bookDetailsData?.doctor?.slug,
              server_id: bookDetailsData?.doctor?.server_id,
              doctor_name: doctorName,
              book_id: bookDetailsData.book_id,
              reference_code: bookDetailsData.reference_code,
              book_date: bookDetailsData.book_time_strings,
              center_id: centerId,
              user_id: user?.id,
              is_doctor: user?.provider?.job_title === 'doctor',
            },
          });
        }
      }
    }

    return () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        slug: undefined,
      });
    };
  }, [bookDetailsData?.id]);

  return (
    <>
      {isLogin && (
        <Script id="najva-script">{`(function(){
        var now = new Date();
        var version = now.getFullYear().toString() + "0" + now.getMonth() + "0" + now.getDate() +
            "0" + now.getHours();
        var head = document.getElementsByTagName("head")[0];
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://van.najva.com/static/cdn/css/local-messaging.css" + "?v=" + version;
        head.appendChild(link);
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://van.najva.com/static/js/scripts/new-website387894-website-58369-ca07382e-9477-44a1-90a3-1a65b5a0557e.js" + "?v=" + version;
        head.appendChild(script);
        })()`}</Script>
      )}

      <Seo title="رسید نوبت" noIndex />
      <div className="flex flex-col-reverse items-start w-full max-w-screen-lg mx-auto md:flex-row space-s-0 md:space-s-5 md:py-10">
        <div className="w-full bg-white md:basis-4/6 md:rounded-lg shadow-card">
          <div id="receipt" className="flex flex-col px-5 pt-5 space-y-4">
            {!!statusText && (
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
            {hasHolidays && (
              <Alert severity="info" className="p-3 font-medium text-cyan-800 text-sm">
                به دلیل اینکه نوبت شما در بازه‌ی بین التعطیلی است، لطفا پیش از مراجعه، از طریق شماره تلفن مطب، از حضور پزشک در مطب اطمینان
                حاصل کنید.
              </Alert>
            )}
            {showDoctorAvailabilityWarning && (
              <Alert severity="warning" className="p-3 font-medium text-orange-800 text-sm">
                باتوجه به شرایط حال حاضر، احتمال عدم حضور پزشک وجود دارد. لطفا قبل از مراجعه، از طریق تماس با مطب/مرکز درمانی از حضور ایشان
                مطمئن شوید.
              </Alert>
            )}

            <BookInfo
              turnData={bookDetailsData}
              loading={getReceiptDetails.isLoading}
              possibilityBeingVisited={possibilityBeingVisited}
              centerId={centerId?.toString()!}
            />
          </div>
          {bookDetailsData.book_id && growthbook.ready && !userPednding && (
            <div className="p-5">
              {centerType === 'consult' && (
                <Fragment
                  name="ReceiptActionButtons"
                  props={{
                    bookDetailsData: { ...bookDetailsData, doctor: { ...bookDetailsData.doctor, display_name: doctorName } },
                    specialities,
                    currentUserId: user.id,
                  }}
                  variants={{
                    type: centerType === 'consult' ? 'visitOnline' : turnStatus.requestedTurn ? 'request' : 'inPerson',
                  }}
                />
              )}
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
                <div className="flex flex-col space-y-3">
                  <Button block variant="secondary" onClick={handleMyTrunButtonAction}>
                    درخواست‌های من
                  </Button>
                  {!turnStatus.deletedTurn && (
                    <Button block variant="secondary" theme="error" icon={<TrashIcon />} onClick={handleRemoveBookClick}>
                      لغو درخواست
                    </Button>
                  )}
                </div>
              )}
              {/* {centerType === 'consult' && !shouldUsePlasmicActionButtons && (
                <div className="grid gap-2">
                  {!!bookDetailsData && !turnStatus.deletedTurn && possibilityBeingVisited && (
                    <div className="flex flex-col gap-2 md:flex-row md:justify-between md:gap-2">
                      <MessengerButton
                        channel={
                          bookDetailsData.selected_online_visit_channel?.type
                            ? bookDetailsData?.selected_online_visit_channel
                            : bookDetailsData?.doctor?.online_visit_channels?.filter(
                                (item: any) => !(item.type as string).endsWith('_number'),
                              )[0]
                        }
                      />
                      {bookDetailsData.doctor.online_visit_channels?.some(
                        (channel: { type: string }) => channel.type === 'secure_call',
                      ) && <SecureCallButton bookId={bookDetailsData.book_id} extraAction={handleSafeCallAction} />}
                    </div>
                  )}

                  {isShowRemoveButtonForOnlineVisit && (
                    <Button block variant="secondary" theme="error" icon={<TrashIcon />} onClick={handleRemoveBookClick}>
                      {turnStatus.visitedTurn ? 'استرداد وجه' : 'لغو نوبت'}
                    </Button>
                  )}

                  {!!bookDetailsData &&
                    !turnStatus.deletedTurn &&
                    possibilityBeingVisited &&
                    serverTime?.data?.data?.data.timestamp > moment(bookDetailsData.book_time * 1000).unix() && (
                      <>
                        <Divider />
                        <div className="relative flex flex-col space-y-2">
                          <Button
                            size="sm"
                            className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            block
                            variant="secondary"
                            onClick={handleOpenWaitingTimeFollowUpModal}
                            disabled={
                              serverTime?.data?.data?.data.timestamp <
                              moment(bookDetailsData.book_time * 1000)
                                .add(1, 'hour')
                                .unix()
                            }
                          >
                            پیگیری تاخیر پزشک
                            {serverTime?.data?.data?.data.timestamp <
                              moment(bookDetailsData.book_time * 1000)
                                .add(1, 'hour')
                                .unix() && (
                              <Chips>
                                <Timer
                                  defaultTime={formattedDuration}
                                  target={
                                    moment(bookDetailsData.book_time * 1000)
                                      .add(1, 'hour')
                                      .unix() - serverTime?.data?.data?.data.timestamp
                                  }
                                  className="!text-slate-800 font-medium"
                                />
                              </Chips>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            className="border-slate-300 text-slate-500 hover:bg-slate-50"
                            block
                            variant="secondary"
                            onClick={() => {
                              splunkInstance('doctor-profile').sendEvent({
                                group: 'support-receipt',
                                type: 'request-support-book',
                                event: {
                                  doctor_id: bookDetailsData?.doctor?.id,
                                  slug: bookDetailsData?.doctor?.slug,
                                  server_id: bookDetailsData?.doctor?.server_id,
                                  doctor_name: doctorName,
                                  book_id: bookDetailsData.book_id,
                                  reference_code: bookDetailsData.reference_code,
                                  book_date: bookDetailsData.book_time_strings,
                                },
                              });
                              location.assign(
                                `https://support.paziresh24.com/ticketbyturn/?book-id=${bookDetailsData.book_id}&pincode=${
                                  (pincode as string) ?? (user.id && md5(user.id))
                                }`,
                              );
                            }}
                          >
                            درخواست پشتیبانی این نوبت
                          </Button>
                        </div>
                      </>
                    )}
                </div>
              )} */}
            </div>
          )}
          {(!bookDetailsData.book_id || !growthbook.ready || userPednding) && (
            <div className="p-5">
              <ReceiptButtonLoading />
            </div>
          )}
        </div>
        <div className="w-full p-3 mb-2 bg-white md:rounded-lg shadow-card md:mb-0 md:basis-2/6 ">
          <DoctorInfo
            className="p-4 rounded-lg bg-slate-100"
            {...(bookDetailsData?.doctor?.image && { avatar: publicRuntimeConfig.CDN_BASE_URL + bookDetailsData?.doctor?.image })}
            fullName={doctorName}
            expertise={bookDetailsData.doctor?.display_expertise}
            isLoading={getReceiptDetails.isLoading || profileNameLoading}
          />
        </div>
        <Modal
          title={
            centerType === 'consult'
              ? `لطفا دلیل ${turnStatus.notVisitedTurn ? 'لغو نوبت' : 'درخواست استرداد وجه'} را انتخاب کنید`
              : turnStatus.requestedTurn
              ? 'آیا از لغو درخواست اطمینان دارید؟'
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
          {bookDetailsData?.doctor?.server_id != 1 && getCancellationPolicyStatus.data?.data?.is_paid && (
            <Alert severity="warning" className="flex items-center gap-3 p-3 mb-4">
              <WarningIcon className="w-5" />
              <Text fontSize="sm" fontWeight="medium">
                {getCancellationPolicyStatus.data?.data?.refundable
                  ? 'وجه پرداختی شما تا یک ساعت بعد از لغو نوبت به شما مسترد خواهد شد.'
                  : 'با توجه به قوانین استرداد مرکز، وجه پرداختی شما مسترد نخواهد شد.'}
              </Text>
            </Alert>
          )}
          <div className="flex space-s-2">
            <Button
              theme="error"
              block
              onClick={handleRemoveBookTurn}
              loading={removeBookApi.isLoading || (bookDetailsData?.doctor?.server_id != 1 && getCancellationPolicyStatus.isLoading)}
            >
              {turnStatus.requestedTurn ? 'لغو درخواست' : 'لغو نوبت'}
            </Button>
            <Button theme="error" variant="secondary" block onClick={handleCloseRemoveModal}>
              انصراف
            </Button>
          </div>
        </Modal>
        <Modal title="احتمال معطلی بیش از یک ساعت!" {...waitingTimeModalProps}>
          <div className="flex flex-col space-y-3">
            <Text fontWeight="medium">نوبت شما ثبت شد ولی با توجه به گزارش کاربران، احتمال معطلی بیش از یک ساعت در مرکز وجود دارد.</Text>
            <Button block onClick={() => handleCloseWaitingTimeModal()}>
              مشاهده رسید نوبت
            </Button>
          </div>
        </Modal>
        <Modal {...waitingTimeFollowUpModalProps} title="پیگیری تاخیر پزشک">
          <form
            method="post"
            onSubmit={() => {
              splunkInstance('doctor-profile').sendEvent({
                group: 'support-receipt',
                type: 'follow-doctor-delay',
                event: {
                  doctor_id: bookDetailsData?.doctor?.id,
                  slug: bookDetailsData?.doctor?.slug,
                  server_id: bookDetailsData?.doctor?.server_id,
                  doctor_name: doctorName,
                  book_id: bookDetailsData.book_id,
                  reference_code: bookDetailsData.reference_code,
                  book_date: bookDetailsData.book_time_strings,
                },
              });
              setIsWattingTimeFollowUpLoadingButton(true);
            }}
            action={`${publicRuntimeConfig.API_GATEWAY_BASE_URL}/v1/support/doctordelayfollowup`}
            className="flex flex-col space-y-3"
          >
            <Alert severity="warning" className="p-2">
              <Text fontWeight="medium" fontSize="sm" className="text-orange-700">
                با ارسال این فرم شما تایید می کنید که در زمان مقرر در پیامرسان انتخاب شده به پزشک پیام ارسال کرده اید و هنوز پاسخی دریافت
                نکرده اید.
              </Text>
            </Alert>
            <input name="book-id" value={bookDetailsData.book_id} type="hidden" />
            <input name="pincode" value={(pincode as string) ?? (user.id && md5(user.id))} type="hidden" />
            <TextField name="description" label="توضیحات" multiLine className="h-28" />
            <Button type="submit" loading={isWattingTimeFollowUpLoadingButton}>
              ارسال درخواست پیگیری
            </Button>
          </form>
        </Modal>
        <Modal title={rateAppModalInfo?.modal_title} {...rateAppModal}>
          <div className="flex flex-col items-center space-y-3">
            <SuccessIcon className="text-green-600" />
            <Text fontWeight="bold" className="text-green-600">
              {rateAppModalInfo?.title}
            </Text>
            <Text className="text-center" fontSize="sm" fontWeight="medium">
              {rateAppModalInfo?.description?.replace('{appDownloadSource}', appDownloadSource)}
            </Text>
            <Button block onClick={handleRedirectToStore}>
              {rateAppModalInfo?.button_rate_app_text}
            </Button>
            <Button variant="secondary" className="" block onClick={handleCloseRateAppModal}>
              {rateAppModalInfo?.button_show_receipt_text}
            </Button>
          </div>
        </Modal>
        <Modal {...notificationGrantAccsesModalProps} noHeader>
          <span className="text-base font-bold leading-7">{notificationGrantAccsesModalText}</span>
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

export const getServerSideProps = withCSR(
  withServerUtils(async (context: GetServerSidePropsContext) => {
    return {
      props: {
        query: context.query,
      },
    };
  }),
);

export default Receipt;
