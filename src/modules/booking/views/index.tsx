import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-hot-toast';

// Apis
import { useBookRequest } from '@/common/apis/services/booking/bookRequest';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';

// Hooks
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { uniqMessengers } from '../functions/uniqMessengers';

// Components
import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import InfoIcon from '@/common/components/icons/info';
import InputMask from 'react-input-mask';
import Recommend from '../components/recommend';

// Booking Steps
import Wrapper from '../components/wrapper';
import SelectCenter from './selectCenter';
import SelectService from './selectService';
import SelectTimeWrapper from './selectTime/wrapper';
import SelectUserWrapper from './selectUser/wrapper';
import TurnRequest, { TurnRequestInformation } from './turnRequest/turnRequest';

// Analytics
import { sendGaEvent } from '@/common/services/sendGaEvent';
import { sendBookEvent } from '../events/book';
import { sendSelectCenterEvent } from '../events/selectCenter';
import { sendSelectServiceEvent } from '../events/selectService';
import { sendFirstFreeTimeEvent, sendOtherFreeTimeEvent } from '../events/selectTime';
import { reformattedDoctorInfoForEvent } from '../functions/reformattedDoctorInfoForEvent';

// Constants
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import { CENTERS } from '@/common/types/centers';

// Global Store
import { UserInfo, useUserInfoStore } from '@/modules/login/store/userInfo';

// Types
import { useGetNationalCodeConfirmation } from '@/common/apis/services/booking/getNationalCodeConfirmation';
import { useInquiryIdentityInformation } from '@/common/apis/services/booking/inquiryIdentityInformation';
import { useUnsuspend } from '@/common/apis/services/booking/unsuspend';
import { useSearch } from '@/common/apis/services/search/search';
import Alert from '@/common/components/atom/alert';
import Loading from '@/common/components/atom/loading';
import { FakeData } from '@/common/constants/fakeData';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { convertNumberToStringGender } from '@/common/utils/convertNumberToStringGender';
import SearchCard from '@/modules/search/components/card/card';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import axios from 'axios';
import moment from 'jalali-moment';
import random from 'lodash/random';
import { defaultMessengers } from '../constants/defaultMessengers';
import { reformattedCentersProperty } from '../functions/reformattedCentersProperty';
import { reformattedServicesProperty } from '../functions/reformattedServicesProperty';
import useBooking from '../hooks/booking';
import useFirstFreeTime from '../hooks/selectTime/useFirstFreeTime';
import { Center } from '../types/selectCenter';
import { Service } from '../types/selectService';
import { growthbook } from 'src/pages/_app';
import { template, templateSettings } from 'lodash';
import { useGetServices } from '@/common/apis/services/profile/services';
import { toastActionble } from '@/common/utils/toastActionble';
interface BookingStepsProps {
  slug: string;
  defaultStep?: SELECT_CENTER | SELECT_SERVICES | SELECT_TIME | SELECT_USER | BOOK_REQUEST;
  className?: string;
}

type SELECT_CENTER = {
  step: 'SELECT_CENTER';
  payload: Partial<Payloads>;
};
type SELECT_SERVICES = {
  step: 'SELECT_SERVICES';
  payload: Pick<Payloads, 'centerId'>;
};
type SELECT_TIME = {
  step: 'SELECT_TIME';
  payload: Pick<Payloads, 'centerId' | 'serviceId'>;
};
type SELECT_USER = {
  step: 'SELECT_USER';
  payload: Pick<Payloads, 'centerId' | 'serviceId' | 'timeId'>;
};

type BOOK_REQUEST = {
  step: 'BOOK_REQUEST';
  payload: Pick<Payloads, 'centerId' | 'serviceId' | 'timeId'>;
};

type Payloads = {
  centerId: string;
  serviceId: string;
  timeId: string;
};
templateSettings.interpolate = /{{([\s\S]+?)}}/g;

export type Step = 'SELECT_CENTER' | 'SELECT_SERVICES' | 'SELECT_TIME' | 'SELECT_USER' | 'BOOK_REQUEST';

const BookingSteps = (props: BookingStepsProps) => {
  const router = useRouter();
  const { customize } = useCustomize();
  const isApplication = useApplication();
  const { slug, defaultStep, className } = props;
  const { data, isLoading } = useGetProfileData(
    {
      slug,
    },
    {
      enabled: !!slug,
    },
  );
  const centers = data?.data?.centers;
  const profile = data?.data;
  const [center, setCenter] = useState<any>();
  const [service, setService] = useState<any>();
  const [user, setUser] = useState<any>({});
  const isLogin = useUserInfoStore(state => state.isLogin);
  const bookEvent = useFeatureValue<{
    destination?: string;
    enable_online_visit?: string;
    skip_call_booking?: string;
  }>('events::book', {});
  const [timeId, setTimeId] = useState('');
  const [selectedTime, setSelectedTime] = useState(0);
  const bookRequest = useBookRequest();
  const getTurnTimeout = useRef<any>();
  const messengers = useFeatureValue<any>('channeldescription', defaultMessengers);
  const shouldUseInquiryIdentityInformation = useFeatureValue<{ ids: string[] }>('booking:inquiry-identity-information|center-list', {
    ids: [],
  });
  const onlineVisitDoctorList = useFeatureValue<{ slugs: string[] }>('booking:online-visit-recommend-modal', {
    slugs: [],
  });
  const shouldShowOnlineVistRecommendModal = onlineVisitDoctorList?.slugs?.includes?.(profile?.slug);

  const doctorMessenger = uniqMessengers(profile?.online_visit_channel_types, Object.keys(messengers));
  const shouldShowMessengers = doctorMessenger.length > 1 && center?.id === CENTERS.CONSULT;

  const {
    handleOpen: handleOpenTurnTimeOutModal,
    handleClose: handleCloseTurnTimeOutModal,
    modalProps: turnTimeOutModalProps,
  } = useModal();
  const { handleOpen: handleOpenInsuranceModal, modalProps: insuranceModalProps } = useModal();
  const { handleOpen: handleOpenRecommendModal, modalProps: recommendModalProps } = useModal();
  const { handleOpen: handleOpenErrorModal, handleClose: handleCloseErrorModal, modalProps: errorModalProps } = useModal();
  const [errorModalMetaData, setErrorModalMetaData] = useState<any>({});
  const { handleOpen: handleOpenBirthDateModal, handleClose: handleCloseBirthDateModal, modalProps: birthDateModalProps } = useModal();
  const birthDateInputValue = useRef<any>(null);
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [firstFreeTimeErrorText, setFirstFreeTimeErrorText] = useState('');
  const { handleBook, isLoading: bookLoading } = useBooking();
  const getNationalCodeConfirmation = useGetNationalCodeConfirmation();
  const inquiryIdentityInformation = useInquiryIdentityInformation();
  const unsuspend = useUnsuspend();
  const { changeRoute } = useSearchRouting();
  const getFirstFreeTime = useFirstFreeTime({
    enabled: false,
    centerId: center?.id,
    serviceId: service?.id,
    userCenterId: center?.user_center_id,
  });
  const searchData = useSearch({
    route: decodeURIComponent(`ir/${profile?.expertises?.[0]?.expertise_groups?.[0]?.en_slug}`),
    query: {
      turn_type: 'consult',
    },
  });
  const substituteDoctor = useMemo(() => searchData.data?.search?.result?.[random(0, 2)] ?? {}, [searchData.data]);
  const [step, setStep] = useState<Step>(defaultStep?.step ?? 'SELECT_CENTER');
  const { data: services } = useGetServices({ slug, center_id: center?.id }, { enabled: !!center?.id && !!service?.id });

  useEffect(() => {
    if (defaultStep?.payload && centers && step !== 'BOOK_REQUEST') {
      const selectedCenter = centers?.find((c: any) => c.id === defaultStep.payload.centerId);
      const selectedService =
        (defaultStep.step === 'SELECT_TIME' || defaultStep.step === 'SELECT_USER') &&
        selectedCenter?.services.find((c: any) => c.id.toString() === defaultStep.payload?.serviceId?.toString());

      setCenter(selectedCenter);
      setService(selectedService);

      if (defaultStep.step === 'SELECT_USER' && defaultStep.payload.timeId) {
        setTimeId(defaultStep.payload.timeId);
      }

      if (defaultStep.step === 'SELECT_TIME' && selectedService?.can_request) {
        return handleChangeStep('SELECT_USER', { serviceId: selectedService.id, timeId: '-1' }, { replaceUrl: true });
      }

      if (defaultStep.step === 'SELECT_SERVICES' && selectedCenter.services.length === 1) {
        return handleChangeStep(defaultStep?.step ?? 'SELECT_TIME', { serviceId: selectedCenter.services?.[0]?.id }, { replaceUrl: true });
      }

      setStep(defaultStep?.step ?? 'SELECT_CENTER');
    }
  }, [centers, defaultStep]);

  useEffect(() => {
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      slug,
      center_id: center?.id,
      service_id: service?.id,
    });

    return () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        slug: undefined,
        center_id: undefined,
        service_id: undefined,
      });
    };
  }, [slug, center]);

  const handleBookAction = async (user: any) => {
    if (center.id === CENTERS.CONSULT && !user.messengerType && shouldShowMessengers) return toast.error('لطفا پیام رسان را انتخاب کنید.');
    const { insurance_id } = user;
    sendGaEvent({ action: 'P24DrsPage', category: 'book request button', label: 'book request button' });
    if (+center.settings?.booking_enable_insurance && !insurance_id) return toast.error('لطفا بیمه خود را انتخاب کنید.');

    let reserveId: string | undefined = timeId;

    if (!reserveId) {
      const freeturnData = await getFirstFreeTime.getFirstFreeTime();
      if (!freeturnData.timeId) return toast.error(freeturnData?.message ?? 'خطا در دریافت نوبت خالی پزشک.');
      sendFirstFreeTimeEvent({
        data: {
          full_date: freeturnData?.full_date,
          status: freeturnData?.status,
          message: freeturnData?.message,
          difference_freeTurn_profile_by_real: getFirstFreeTime.timeStamp! - (center?.freeturn ?? null),
        },
        doctorInfo: reformattedDoctorInfoForEvent({ center: { ...center, service_id: center?.server_id }, service, doctor: profile }),
      });
      reserveId = freeturnData.timeId;
    }

    if (!!bookEvent?.skip_call_booking && !!bookEvent?.destination) {
      const compiled = template(bookEvent?.destination);
      const destination = compiled({
        center_id: center.id,
        service_id: service.id,
        slug: slug,
        request_code: reserveId,
        selected_national_code: user?.national_code,
        selected_cell: user?.cell,
        selected_name: user?.name,
        selected_family: user?.family,
        selected_online_channel: user?.messengerType,
      });
      router.replace(destination);

      return;
    }

    handleBook(
      {
        center,
        timeId: reserveId as string,
        user: {
          ...user,
          insurance_id: insurance_id !== -1 ? insurance_id : null,
        },
      },
      {
        onSuccess(data) {
          splunkInstance('booking').sendEvent({
            group: 'booking',
            type: 'book-date',
            event: {
              patient_cell: user.cell,
              doctor_name: profile?.display_name,
              date: moment().format('jYYYY/jMM/jDD - HH:mm'),
              preferred_book_date: moment(selectedTime * 1000).format('jYYYY/jMM/jDD - HH:mm'),
              confirmed_book_date: data?.details?.from,
              ...data?.book_info,
            },
          });
          if (user.messengerType)
            splunkInstance('booking').sendEvent({
              group: 'patient-visit-online',
              type: 'app',
              event: {
                action: user.messengerType,
              },
            });
          if (data.payment.reqiure_payment === '1') {
            if (bookEvent?.destination) {
              const compiled = template(bookEvent?.destination);
              const destination = compiled({
                center_id: center.id,
                service_id: service.id,
                slug: slug,
                selected_national_code: user?.national_code,
                selected_cell: user?.cell,
                selected_name: user?.name,
                selected_family: user?.family,
                selected_online_channel: user?.messengerType,
                book_id: data.book_info.id,
              });
              return router.replace(destination);
            }
            if (center.server_id === 1) {
              return router.replace(`/factor/${center.id}/${data.book_info.id}`);
            }
            if (isApplication) return window.open(`${data?.payment?.redirect_url}`);
            location.replace(`${data?.payment?.redirect_url}`);
            return;
          }
          sendBookEvent({
            bookInfo: {
              ...data.book_info,
            },
            doctorInfo: reformattedDoctorInfoForEvent({ center, service, doctor: profile }),
            userInfo: user,
          });
          router.replace(`/receipt/${center.id}/${data.book_info.id}`);
        },
        onExpire(data) {
          toast.error(toastActionble({ ...data }), { duration: data?.duration ?? 10000 });
          handleChangeStep('SELECT_TIME');
        },
        onError(data) {
          if (Object.values(data?.details ?? {})?.length > 0) {
            toast.error(
              `${data.message} \n ${Object.entries(data?.details)
                .map(item => `${item[0]}: ${item[1]}`)
                .join('\n')}`,
              {
                duration: 10000,
              },
            );
          }
          if (Object.values(data?.details ?? {})?.length == 0) {
            toast.error(toastActionble({ ...data }), { duration: data?.duration ?? 10000 });
          }

          sendGaEvent({
            action: 'P24DrsPage',
            category: 'BookError',
            label: `BookError press submit button - status: ${data.status} message: ${data.message}`,
          });
          sendGaEvent({
            action: 'bookerror',
            category: center.center_type === 1 ? 'مطب شخصی' : center.name,
            label: data.status,
          });
        },
      },
    );
  };

  const [bookRequestLoading, setBookRequestLoading] = useState(false);

  const handleBookRequest = async (dataForm: TurnRequestInformation) => {
    setBookRequestLoading(true);
    const { data } = await bookRequest.mutateAsync({
      center_id: center.id,
      service_id: service.id,
      server_id: center.server_id,
      user_center_id: center.user_center_id,
      ...(dataForm.files && { files: dataForm.files }),
      description: dataForm.description,
      gender: user.gender,
      cell: user.cell,
      name: `${user.name} ${user.family}`,
      national_code: user?.national_code ?? FakeData.NATIONAL_CODE,
    });
    if (data.status === ClinicStatus.SUCCESS) {
      return router.push(`/receipt/${center.id}/${data.result.book_request_id}`);
    }
    setBookRequestLoading(false);

    toast.error(toastActionble({ ...data }), { duration: data?.duration ?? 10000 });
  };

  const handleChangeStep = (
    key: Step,
    payload?: any,
    options?: {
      replaceUrl?: boolean;
    },
  ) => {
    setStep(key);

    const action = options?.replaceUrl ? 'replace' : 'push';

    payload &&
      router[action](
        {
          query: {
            ...router.query,
            ...payload,
          },
        },
        undefined,
        { shallow: true },
      );
  };

  useEffect(() => {
    if (step === 'SELECT_TIME') {
      clearTimeout(getTurnTimeout.current);
      getTurnTimeout.current = setTimeout(() => {
        handleOpenTurnTimeOutModal();
      }, 300000); // 3 min}
    }

    return () => {
      clearTimeout(getTurnTimeout.current);
    };
  }, [step]);

  const getInsuranceList = () => {
    let insurances: any[] = [];
    if (!isEmpty(getNationalCodeConfirmation.data?.data?.info?.insurances)) {
      insurances = Object.values(getNationalCodeConfirmation.data?.data?.info?.insurances)?.map((insurance: any) => ({
        label: insurance.name,
        value: insurance.id,
      }));
    } else {
      insurances = center?.insurances?.map((item: any) => ({ label: item.name, value: item.id })) ?? [];
    }

    insurances.push({ label: 'آزاد', value: -1 });
    return insurances;
  };

  const handleClickMoreDoctors = () => {
    splunkInstance('search').sendEvent({
      group: 'booking-freeturn-error',
      type: 'booking-freeturn-error-click-doctor-card',
    });

    changeRoute({
      query: {
        turn_type: 'consult',
      },
      params: {
        city: 'ir',
        category: profile.expertises[0]?.expertise_groups[0].en_slug,
      },
      previousQueries: false,
    });
  };

  const handleShowErrorModal = ({
    text,
    buttons,
  }: {
    text: string;
    buttons?: Array<{
      text?: string;
      variant?: 'primary' | 'secondary';
      onClick: () => void;
    }>;
  }) => {
    setErrorModalMetaData({
      text,
      buttons,
    });
    handleOpenErrorModal();
  };

  const handleClickDcotorCardDoctor = ({ url }: { url: string }) => {
    splunkInstance('search').sendEvent({
      group: 'booking-freeturn-error',
      type: 'booking-freeturn-error-click-doctor-card',
      event: {
        slug: url.replace('/dr/', ''),
        doctor_name: profile?.display_name,
        doctor_expertice: profile?.expertises[0]?.expertise_groups[0]?.name,
        center_id: center?.id,
        service_id: service?.id,
      },
    });
    location.assign(url.replace('/dr/', '/booking/') + '?centerId=5532&skipTimeSelectStep=true');
  };

  useEffect(() => {
    if (isLogin && step === 'SELECT_USER' && center?.id && service?.id) {
      splunkInstance('booking-v2').sendEvent({
        group: 'booking',
        type: 'choose-sub-user',
        event: {
          data: {
            center_id: center.id,
            service_id: service.id,
            slug,
          },
        },
      });
    }
  }, [isLogin, step, center, service, slug]);

  return (
    <div className={classNames('p-5 bg-white rounded-lg', className)}>
      {step === 'SELECT_CENTER' && (
        <Wrapper
          title="انتخاب مرکز درمانی"
          Component={SelectCenter}
          data={{
            loading: isLoading && !profile,
            centers: reformattedCentersProperty({ centers, displayName: profile?.display_name }),
            doctorName: profile?.display_name,
          }}
          nextStep={(center: Center) => {
            const selectedCenter = centers.find((c: { id: string }) => c.id === center.id);
            sendSelectCenterEvent({
              center: selectedCenter,
              doctorInfo: reformattedDoctorInfoForEvent({ center: selectedCenter, doctor: profile }),
            });
            setCenter(selectedCenter);
            if (selectedCenter.services.length === 1) {
              const service = selectedCenter.services[0];
              const payload = {
                centerId: center.id,
                serviceId: service.id,
              };
              setService(service);
              if (service?.can_request) return handleChangeStep('SELECT_USER', payload);
              return handleChangeStep('SELECT_TIME', payload);
            }
            handleChangeStep('SELECT_SERVICES', { centerId: center.id });
          }}
        />
      )}
      {step === 'SELECT_SERVICES' && (
        <Wrapper
          title="انتخاب خدمت"
          Component={SelectService}
          data={{
            loading: isLoading || !center || !profile,
            services: reformattedServicesProperty({ services: center?.services, center }),
            doctorName: profile?.display_name,
            center: center,
          }}
          nextStep={(service: Service) => {
            const selectedService = center?.services?.find((s: any) => s.id === service.id);
            sendSelectServiceEvent(reformattedDoctorInfoForEvent({ center, service: selectedService, doctor: profile }));
            setService(selectedService);
            if (selectedService?.can_request) return handleChangeStep('SELECT_USER', { serviceId: service.id });
            handleChangeStep('SELECT_TIME', { serviceId: service.id });
          }}
        />
      )}
      {step === 'SELECT_TIME' && (
        <Wrapper
          title={center?.id === CENTERS.CONSULT ? 'انتخاب زمان گفتگو' : 'انتخاب زمان نوبت'}
          Component={SelectTimeWrapper}
          TopComponent={
            <>
              {profile?.feedback_visit?.two_weeks_data.some((data: any) => data.center_id === center?.id && data.total_non_personal > 2) &&
                customize.showRateAndReviews && (
                  <>
                    <Text fontSize="sm" fontWeight="medium" className="text-orange-700">
                      <InfoIcon className="inline ml-1" />
                      با توجه به گزارشات مراجعین اخیر پزشک، احتمال عدم موفقیت شما در ویزیت (به دلایلی مثل شلوغی مرکز، عدم حضور پزشک، برخورد
                      منشی و ...) وجود دارد.
                    </Text>
                    <Divider />
                  </>
                )}
              {services?.filter((item: any) => item.service_id === service.id)?.[0]?.description && (
                <div className="p-3 mb-5 rounded-lg bg-slate-100">
                  <InfoIcon className="inline ml-1 w-6 h-6" />
                  <Text fontSize="sm" fontWeight="semiBold">
                    {services?.filter((item: any) => item.service_id === service.id)?.[0]?.description}
                  </Text>
                </div>
              )}
            </>
          }
          data={{
            loading: isLoading || !center || !service || !profile,
            centerId: center?.id ?? '',
            serviceId: service?.id ?? '',
            userCenterId: service?.user_center_id,
            showOnlyFirstFreeTime: center?.settings?.booking_new_turn_suggestion_type === 'only_first_turn',
            onFirstFreeTimeError: (errorText: string) => {
              setFirstFreeTimeErrorText(errorText);
              sendGaEvent({
                action: 'load-errormodal',
                category: `${center.city}`,
                label: `${profile?.expertises?.[0]?.expertise_groups[0].name ?? ''}`,
              });
              handleOpenRecommendModal();
            },
            events: {
              onFirstFreeTime: ({ server_name, server_id, status, message, result, meta }: any) => {
                sendFirstFreeTimeEvent({
                  data: {
                    full_date: result?.full_date,
                    status,
                    message,
                    meta,
                    difference_freeTurn_profile_by_real: result?.timestamp - center?.freeturn,
                  },
                  doctorInfo: reformattedDoctorInfoForEvent({ center: { ...center, server_id, server_name }, service, doctor: profile }),
                });
              },
              onOtherFreeTime: ({ status, message }: any) =>
                sendOtherFreeTimeEvent({
                  data: { status, message },
                  doctorInfo: reformattedDoctorInfoForEvent({ center, service, doctor: profile }),
                }),
            },
          }}
          nextStep={({ timeId, timeStamp }: { timeId: string; timeStamp: number }) => {
            sendGaEvent({ action: 'P24DrsPage', category: 'submit book time', label: 'submit book time' });
            sendGaEvent({ action: 'P24DrsPage', category: 'select-earliest-time', label: 'select-earliest-time' });
            sendGaEvent({ action: 'P24DrsPage', category: 'NextButtonToLoginorReg', label: 'NextButtonToLoginorReg' });
            setTimeId(timeId);
            setSelectedTime(timeStamp);
            handleChangeStep('SELECT_USER', { timeId });
          }}
        />
      )}
      {step === 'SELECT_USER' && (
        <>
          {center?.user_center_desk && center?.id !== CENTERS.CONSULT && (
            <div className="p-3 mb-5 rounded-lg bg-slate-100">
              <Text fontSize="sm">{center?.user_center_desk}</Text>
            </div>
          )}
          {center?.id === CENTERS.CONSULT && !shouldShowMessengers && (
            <div className="p-2 mb-3 rounded-md bg-slate-100">
              <Text
                fontSize="sm"
                dangerouslySetInnerHTML={{
                  __html: messengers[doctorMessenger?.[0] ?? 'phone']?.description,
                }}
              />
            </div>
          )}
          <Wrapper
            title="لطفا بیمار را انتخاب کنید"
            Component={SelectUserWrapper}
            data={{
              loading:
                bookLoading ||
                getFirstFreeTime.loading ||
                getNationalCodeConfirmation.isLoading ||
                inquiryIdentityInformation.isLoading ||
                !profile,
              submitButtonText: service?.free_price !== 0 ? 'ادامه' : 'ثبت نوبت',
              showTermsAndConditions: customize.showTermsAndConditions,
              shouldShowMessengers,
            }}
            nextStep={async (intialUser: UserInfo) => {
              let user = { ...intialUser };
              if (service?.can_request) {
                setUser(user);
                handleChangeStep('BOOK_REQUEST');
                return;
              }

              try {
                if (shouldUseInquiryIdentityInformation?.ids?.includes?.(center.id) && user.national_code) {
                  const { data: insurancesData } = await getNationalCodeConfirmation.mutateAsync({
                    nationalCode: user.national_code!,
                    centerId: center.id,
                  });

                  if (!insurancesData?.info?.birth_date) {
                    setUser(user);
                    handleOpenBirthDateModal();
                    return;
                  }

                  const { data: information } = await inquiryIdentityInformation.mutateAsync({
                    centerId: center.id,
                    nationalCode: user.national_code,
                    yearOfBirth: insurancesData?.info?.birth_date.split('/')[0],
                  });

                  user = {
                    ...user,
                    name: information?.info?.name,
                    family: information?.info?.family,
                    gender: convertNumberToStringGender(information?.info?.gender),
                    father_name: information?.info?.fatherName,
                    birth_date: insurancesData?.info?.birth_date,
                  };

                  const insurances: any[] = Object.values(insurancesData?.info?.insurances);

                  if (insurances.length === 1) {
                    const insurance = insurances[0];
                    user = {
                      ...user,
                      insurance_id: insurance.id,
                    };
                  } else {
                    setUser(user);
                    handleOpenInsuranceModal();
                  }

                  handleBookAction(user);
                  return;
                }
              } catch (e) {
                handleShowErrorModal({
                  text: `<p class="font-bold">در استعلام بیمه شما خطایی رخ داده است، لطفا چند دقیقه دیگر تلاش کنید.</p>
                  <p>چنانچه مایلید بیمه شما به صورت آزاد محاسبه شود، فرایند نوبت دهی را ادامه داده و در نظر داشته باشید، هزینه اضافی پرداخت شده به شما برگشت داده نخواهد شد.</p>`,
                  buttons: [
                    {
                      text: 'ادامه',
                      variant: 'primary',
                      onClick: () => {
                        setUser(user);
                        handleOpenBirthDateModal();
                        handleCloseErrorModal();
                      },
                    },
                    {
                      text: 'انصراف',
                      variant: 'secondary',
                      onClick: handleCloseErrorModal,
                    },
                  ],
                });
                return;
              }
              setUser(user);

              if (+center?.settings?.booking_enable_insurance) {
                handleOpenInsuranceModal();
                return;
              }
              handleBookAction({
                ...user,
                ...(center?.id === CENTERS.CONSULT &&
                  doctorMessenger?.length === 1 && {
                    messengerType: messengers[doctorMessenger?.[0]]?.type,
                  }),
              });
            }}
          />
        </>
      )}
      {step === 'BOOK_REQUEST' && (
        <Wrapper
          Component={TurnRequest}
          TopComponent={
            <>
              {services?.find((item: any) => item.service_id === service.id)?.description && (
                <div className="p-3 mb-5 rounded-lg bg-slate-100">
                  <InfoIcon className="inline ml-1 w-6 h-6" />
                  <Text
                    fontSize="sm"
                    fontWeight="semiBold"
                    dangerouslySetInnerHTML={{
                      __html: services?.find((item: any) => item.service_id === service.id)?.description?.replace(/\n/g, '<br/>'),
                    }}
                  />
                </div>
              )}
            </>
          }
          data={{
            descriptionTitle: 'لطفا توضیحات مورد نیاز خود را وارد کنید',
            checkboxText: 'قوانین را مطالعه کردم و پذیرفتم.',
            placeholder: 'توضیحات ...',
            uploaderTitle: 'مدارک مورد نیاز خود را بارگذاری کنید',
            rulesBoxTitle: 'شرایط دریافت نوبت از پذیرش24',
            uploadRequired: services.find((item: any) => item.service_id === service.id)?.upload_required,
            getData: () => {},
            loading: bookRequest.isLoading || bookRequestLoading,
            center_id: center.id,
            service_id: service.id,
          }}
          nextStep={(data: TurnRequestInformation) => {
            if (!data.description) return toast.error('لطفا توضیحات را تکمیل کنید.');
            handleBookRequest(data);
          }}
        />
      )}

      <Modal noHeader {...turnTimeOutModalProps} onClose={() => {}}>
        <div className="flex flex-col space-y-3">
          <Text fontWeight="medium">زمان شما برای دریافت نوبت به پایان رسیده است، لطفا دوباره تلاش کنید.</Text>
          <Button
            block
            onClick={() => {
              handleChangeStep('SELECT_CENTER');
              handleCloseTurnTimeOutModal();
            }}
          >
            تلاش مجدد
          </Button>
        </div>
      </Modal>
      <Modal title="انتخاب بیمه" {...insuranceModalProps}>
        <div className="flex flex-col space-y-3">
          <Autocomplete onChange={e => setInsuranceName(e.target.value.value)} label="نام بیمه" options={getInsuranceList()} />
          <TextField value={insuranceNumber} onChange={e => setInsuranceNumber(e.target.value)} label="شماره بیمه (اختیاری)" />
          <Button
            loading={bookLoading}
            block
            onClick={() =>
              handleBookAction({
                ...user,
                insurance_id: insuranceName,
                insurance_number: insuranceNumber,
              })
            }
          >
            ثبت نوبت
          </Button>
        </div>
      </Modal>
      <Modal {...errorModalProps} noHeader bodyClassName="flex flex-col space-y-2">
        <Text dangerouslySetInnerHTML={{ __html: errorModalMetaData.text }} />
        <div className="flex items-center space-s-2">
          {errorModalMetaData?.buttons?.map((button: any, index: number) => (
            <Button block key={index} variant={button.variant} onClick={button.onClick}>
              {button.text}
            </Button>
          ))}
        </div>
      </Modal>
      <Modal title="تاریخ تولد خود را وارد کنید." {...birthDateModalProps} bodyClassName="flex flex-col space-y-2">
        <InputMask mask="9999/99/99" ref={birthDateInputValue}>
          {
            ((inputProps: any) => {
              return (
                <TextField
                  {...inputProps}
                  helperText="مثال: 1372/12/03"
                  inputMode="numeric"
                  dir="ltr"
                  placeholder="____/__/__"
                  className="text-center"
                />
              );
            }) as any
          }
        </InputMask>
        <Button
          onClick={async () => {
            try {
              const { data: information } = await inquiryIdentityInformation.mutateAsync({
                centerId: center.id,
                nationalCode: user.national_code,
                yearOfBirth: birthDateInputValue.current?.value?.split?.('/')[0],
              });

              const userInformation = {
                ...user,
                name: information?.info?.name,
                family: information?.info?.family,
                gender: convertNumberToStringGender(information?.info?.gender),
                father_name: information?.info?.fatherName,
                birth_date: birthDateInputValue.current?.value,
              };
              handleCloseBirthDateModal();
              handleBookAction(userInformation);
            } catch (error) {
              if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
            }
          }}
          loading={inquiryIdentityInformation.isLoading}
          block
        >
          تایید
        </Button>
      </Modal>
      <Modal
        noHeader
        {...recommendModalProps}
        onClose={() => {
          recommendModalProps.onClose();
          router.replace(`/dr/${slug}`);
        }}
        bodyClassName="bg-slate-100"
        className="bg-slate-100"
      >
        <div className="flex flex-col space-y-5">
          {!shouldShowOnlineVistRecommendModal && (
            <Text className="p-5 leading-7 bg-white rounded-lg" fontWeight="bold">
              {firstFreeTimeErrorText}
            </Text>
          )}
          {!customize?.partnerKey && (
            <div className="flex flex-col space-y-3">
              {!shouldShowOnlineVistRecommendModal && (
                <Text fontSize="sm" className="leading-6">
                  <Text fontWeight="bold">سایر سرویس دهندگان آنلاین {profile?.expertises?.[0]?.expertise_groups?.[0]?.name}</Text> منتخب
                  بیماران
                </Text>
              )}
              {profile && (
                <>
                  {shouldShowOnlineVistRecommendModal ? (
                    <div className="flex flex-col gap-2">
                      <Alert severity="error" className="flex items-center p-3 text-red-500 space-s-2">
                        <Text className="text-sm font-medium"> {firstFreeTimeErrorText}</Text>
                      </Alert>
                      <Alert severity="success" className="p-3 text-sm font-medium text-green-700">
                        بدون خروج از منزل، آنلاین ویزیت شوید.
                      </Alert>
                      <div onClick={() => handleClickDcotorCardDoctor({ url: substituteDoctor.url })}>
                        {(searchData.isLoading || !substituteDoctor?.url) && (
                          <div className="flex justify-center w-full">
                            <Loading className="w-8 h-8 my-8 " />
                          </div>
                        )}
                        {searchData.isSuccess && substituteDoctor?.url && (
                          <SearchCard
                            avatarSize="lg"
                            baseInfo={{
                              displayName: substituteDoctor.title,
                              expertise: substituteDoctor.display_expertise,
                              experience: substituteDoctor.experience,
                              isVerify: true,
                              avatar: substituteDoctor.image,
                              rate: {
                                count: substituteDoctor.rates_count,
                                satisfaction: substituteDoctor.satisfaction,
                              },
                              isOnline: true,
                            }}
                            details={{
                              badges: [
                                {
                                  title: 'تضمین بازپرداخت مبلغ ویزیت در صورت نارضایتی',
                                  icon: 'shield-icon',
                                  type: 'error',
                                },
                              ],
                            }}
                            className="shadow-none !py-2 lg:!py-2 cursor-pointer"
                            type="doctor"
                            actions={[
                              {
                                text: `گفتگو با ${substituteDoctor.title}`,
                                outline: false,
                                description: '',
                              },
                            ]}
                          />
                        )}
                      </div>
                      <Button block size="sm" className="text-xs opacity-70" variant="text" onClick={handleClickMoreDoctors}>
                        مشاهده سایر سرویس دهندگان آنلاین {profile.expertises[0]?.expertise_groups[0].name}
                      </Button>
                    </div>
                  ) : (
                    <Recommend
                      doctorId={profile.id}
                      city={profile.city_en_slug}
                      category={profile.expertises[0].expertise.name}
                      centerId={center?.id}
                      limit={3}
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookingSteps;
