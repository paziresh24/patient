import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-hot-toast';

// Apis
import { useBookRequest } from '@/common/apis/services/booking/bookRequest';
import { useSymptoms } from '@/common/apis/services/booking/symptoms';
import { useTermsAndConditions } from '@/common/apis/services/booking/termsAndConditions';
import { useGetProfileData } from '@/common/apis/services/profile/getFullProfile';

// Hooks
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { uniqMessengers } from '../functions/uniqMessengers';

// Components
import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import InfoIcon from '@/common/components/icons/info';
import Recommend from '../components/recommend';
import SelectSymptoms from '../components/selectSymptoms';

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
import { UserInfo } from '@/modules/login/store/userInfo';

// Types
import { useGetNationalCodeConfirmation } from '@/common/apis/services/booking/getNationalCodeConfirmation';
import { useUnsuspend } from '@/common/apis/services/booking/unsuspend';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import useServerQuery from '@/common/hooks/useServerQuery';
import { splunkBookingInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { convertNumberToStringGender } from '@/common/utils/convertNumberToStringGender';
import { reformattedCentersProperty } from '../functions/reformattedCentersProperty';
import { reformattedServicesProperty } from '../functions/reformattedServicesProperty';
import useBooking from '../hooks/booking';
import { Center } from '../types/selectCenter';
import { Service } from '../types/selectService';
import { Symptoms } from '../types/selectSymptoms';

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

export type Step = 'SELECT_CENTER' | 'SELECT_SERVICES' | 'SELECT_TIME' | 'SELECT_USER' | 'BOOK_REQUEST';

const BookingSteps = (props: BookingStepsProps) => {
  const router = useRouter();
  const { customize } = useCustomize();
  const isApplication = useApplication();
  const university = useServerQuery(state => state.queries.university);
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
  const [timeId, setTimeId] = useState('');
  const symptomsAutoComplete = useSymptoms();
  const bookRequest = useBookRequest();
  const termsAndConditions = useTermsAndConditions();
  const getTurnTimeout = useRef<any>();
  const shouldShowMessengers =
    !!profile?.online_visit_channel_types?.includes?.('eitaa') &&
    !!profile?.online_visit_channel_types?.includes?.('whatsapp') &&
    center?.id === CENTERS.CONSULT;
  const messengers = useFeatureValue<any>('channeldescription', {});

  const {
    handleOpen: handleOpenTurnTimeOutModal,
    handleClose: handleCloseTurnTimeOutModal,
    modalProps: turnTimeOutModalProps,
  } = useModal();
  const { handleOpen: handleOpenInsuranceModal, modalProps: insuranceModalProps } = useModal();
  const { handleOpen: handleOpenRecommendModal, modalProps: recommendModalProps } = useModal();
  const { handleOpen: handleOpenErrorModal, handleClose: handleCloseErrorModal, modalProps: errorModalProps } = useModal();
  const [errorModalMetaData, setErrorModalMetaData] = useState<any>({});

  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [insuranceName, setInsuranceName] = useState('');
  const [firstFreeTimeErrorText, setFirstFreeTimeErrorText] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptoms[]>([]);
  const [symptoms, setSymptoms] = useState<Symptoms[]>([]);
  const [symptomSearchText, setSymptomSearchText] = useState('');
  const { handleBook, isLoading: bookLoading } = useBooking();
  const getNationalCodeConfirmation = useGetNationalCodeConfirmation();
  const unsuspend = useUnsuspend();

  const [step, setStep] = useState<Step>(defaultStep?.step ?? 'SELECT_CENTER');
  const doctorMessenger = uniqMessengers(profile?.online_visit_channel_types, Object.keys(messengers));

  useEffect(() => {
    if (defaultStep?.payload && centers && step !== 'BOOK_REQUEST') {
      const selectedCenter = centers?.find((c: any) => c.id === defaultStep.payload.centerId);
      const selectedService =
        (defaultStep.step === 'SELECT_TIME' || defaultStep.step === 'SELECT_USER') &&
        selectedCenter?.services.find((c: any) => c.id.toString() === defaultStep.payload?.serviceId?.toString());
      setCenter(selectedCenter);
      setService(selectedService);
      defaultStep.step === 'SELECT_USER' && defaultStep.payload.timeId && setTimeId(defaultStep.payload.timeId);
      if (defaultStep.step === 'SELECT_TIME' && selectedService?.can_request) {
        return handleChangeStep('SELECT_USER', { serviceId: selectedService.id, bookRequest: true });
      }
      setStep(defaultStep?.step ?? 'SELECT_CENTER');
    }
  }, [centers, defaultStep]);

  useEffect(() => {
    const fetchSymptomsAutoComplete = async () => {
      const { data } = await symptomsAutoComplete.mutateAsync(symptomSearchText || profile.group_expertises?.[0]?.name);
      data.length && setSymptoms(data);
      return data;
    };
    profile && fetchSymptomsAutoComplete();
  }, [symptomSearchText, profile]);

  const handleBookAction = async (user: any) => {
    if (center.id === CENTERS.CONSULT && !user.messengerType && shouldShowMessengers) return toast.error('لطفا پیام رسان را انتخاب کنید.');
    const { insurance_id } = user;
    const userConfimation = getNationalCodeConfirmation.data?.data?.info;
    sendGaEvent({ action: 'P24DrsPage', category: 'book request button', label: 'book request button' });
    if (+center.settings?.booking_enable_insurance && !insurance_id) return toast.error('لطفا بیمه خود را انتخاب کنید.');

    handleBook(
      {
        center,
        timeId,
        user: {
          ...user,
          name: userConfimation?.name ?? user.name,
          family: userConfimation?.family ?? user.family,
          gender: userConfimation?.gender !== null ? convertNumberToStringGender(userConfimation?.gender) : user.gender,
          insurance_id: insurance_id !== -1 ? insurance_id : null,
        },
        selectedSymptoms: selectedSymptoms.map(symptoms => symptoms.title),
      },
      {
        onSuccess(data) {
          if (user.messengerType)
            splunkBookingInstance().sendEvent({
              group: 'patient-visit-online',
              type: 'app',
              event: {
                action: user.messengerType,
              },
            });
          if (data.payment.reqiure_payment === '1') {
            if (center.server_id === 1) return router.replace(`/factor/${center.id}/${data.book_info.id}`);
            if (isApplication) return window.open(`${data?.payment?.redirect_url}`, '_system');
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
          toast.error(data.message, {
            duration: 10000,
          });
          handleChangeStep('SELECT_TIME');
        },
        onError(data) {
          toast.error(data.message, {
            duration: 10000,
          });
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

  const handleBookRequest = async (dataForm: TurnRequestInformation) => {
    const { data } = await bookRequest.mutateAsync({
      center_id: center.id,
      service_id: service.id,
      server_id: center.server_id,
      user_center_id: center.user_center_id,
      ...(dataForm.files && { files: dataForm.files }),
      description: dataForm.description,
      gender: user.gender,
      cell: user.username,
      name: `${user.name} ${user.family}`,
      ...(user.national_code && { national_code: user.national_code }),
    });
    if (data.status === ClinicStatus.SUCCESS) {
      return router.push(`/receipt/${center.id}/${data.result.book_request_id}`);
    }

    toast.error(data.message);
  };

  const handleChangeStep = (key: Step, payload?: any) => {
    setStep(key);

    if (key === 'BOOK_REQUEST') {
      termsAndConditions.mutate({
        center_id: center.id,
        service_id: service.id,
        user_center_id: center.user_center_id,
      });
    }

    payload &&
      router.push(
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
      unsuspend.mutate({
        center_id: router.query?.centerId! as string,
        request_code: timeId,
      });
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

  return (
    <div className={classNames('p-5 bg-white rounded-lg', className)}>
      {step === 'SELECT_CENTER' && (
        <Wrapper
          title="انتخاب مرکز درمانی"
          Component={SelectCenter}
          data={{
            loading: isLoading,
            centers: reformattedCentersProperty({ centers, displayName: profile.display_name }),
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
            loading: isLoading || !center,
            services: reformattedServicesProperty({ services: center?.services, center }),
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
            profile?.feedback_visit?.two_weeks_data.some((data: any) => data.center_id === center?.id && data.total_non_personal > 2) &&
            customize.showRateAndReviews && (
              <>
                <Text fontSize="sm" fontWeight="medium" className="text-orange-700">
                  <InfoIcon className="inline ml-1" />
                  با توجه به گزارشات مراجعین اخیر پزشک، احتمال عدم موفقیت شما در ویزیت (به دلایلی مثل شلوغی مرکز، عدم حضور پزشک، برخورد منشی
                  و ...) وجود دارد.
                </Text>
                <Divider />
              </>
            )
          }
          data={{
            loading: isLoading || !center || !service,
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
              onFirstFreeTime: ({ server_name, server_id, status, message, result, meta }: any) =>
                sendFirstFreeTimeEvent({
                  data: { full_date: result?.full_date, status, message, meta },
                  doctorInfo: reformattedDoctorInfoForEvent({ center: { ...center, server_id, server_name }, service, doctor: profile }),
                }),
              onOtherFreeTime: ({ status, message }: any) =>
                sendOtherFreeTimeEvent({
                  data: { status, message },
                  doctorInfo: reformattedDoctorInfoForEvent({ center, service, doctor: profile }),
                }),
            },
          }}
          nextStep={({ timeId }: { timeId: string }) => {
            sendGaEvent({ action: 'P24DrsPage', category: 'submit book time', label: 'submit book time' });
            sendGaEvent({ action: 'P24DrsPage', category: 'select-earliest-time', label: 'select-earliest-time' });
            sendGaEvent({ action: 'P24DrsPage', category: 'NextButtonToLoginorReg', label: 'NextButtonToLoginorReg' });
            setTimeId(timeId);
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
          <Text fontWeight="bold" className="block mb-3">
            برای درمان چه بیماری به پزشک مراجعه کردید؟
          </Text>
          <SelectSymptoms
            symptoms={symptoms}
            title="اضافه کردن نام بیماری"
            placeholder="اضافه کردن نام بیماری"
            modalTitle="نام بیماری"
            listTitle=" پیشنهادها"
            setSelectedSymptoms={setSelectedSymptoms}
            selectedSymptoms={selectedSymptoms}
            setSearchText={setSymptomSearchText}
            searchText={symptomSearchText}
            className="flex items-center gap-1 mb-4 cursor-pointer text-primary"
          />
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
              loading: bookLoading || getNationalCodeConfirmation.isLoading,
              submitButtonText: service?.free_price !== 0 ? 'ادامه' : 'ثبت نوبت',
              showTermsAndConditions: customize.showTermsAndConditions,
              shouldShowMessengers,
            }}
            nextStep={async (user: UserInfo) => {
              setUser(user);
              if (service?.can_request) {
                handleChangeStep('BOOK_REQUEST');
                return;
              }

              try {
                if (center.id === '455' && user.national_code) {
                  const { data } = await getNationalCodeConfirmation.mutateAsync({
                    nationalCode: user.national_code!,
                    centerId: center.id,
                  });

                  if (data?.info?.insurances) {
                    const insurances: any[] = Object.values(data?.info?.insurances);
                    if (insurances.length === 1) {
                      const insurance = insurances[0];
                      return handleBookAction({
                        ...user,
                        name: data?.info?.name,
                        family: data?.info?.family,
                        gender: convertNumberToStringGender(data?.info?.gender),
                        insurance_id: insurance.id,
                      });
                    }
                    handleOpenInsuranceModal();
                    return;
                  }
                }
                // eslint-disable-next-line no-empty
              } catch (e) {
                handleShowErrorModal({
                  text: `<p class="font-bold">در استعلام بیمه شما خطایی رخ داده است، لطفا چند دقیقه دیگر تلاش کنید.</p>
                  <p>چنانچه مایلید بیمه شما به صورت آزاد محاسبه شود، فرایند نوبت دهی را ادامه داده و در نظر داشته باشید، هزینه اضافی پرداخت شده به شما برگشت داده نخواهد شد.</p>`,
                  buttons: [
                    {
                      text: 'ادامه',
                      variant: 'primary',
                      onClick: () => {
                        handleBookAction(user);
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
          data={{
            descriptionTitle: 'لطفا توضیحات مورد نیاز خود را وارد کنید',
            checkboxText: 'قوانین را مطالعه کردم و پذیرفتم.',
            placeholder: 'توضیحات ...',
            uploaderTitle: 'لطفا مدارک مورد نیاز خود را بارگذاری کنید',
            rulesBoxTitle: 'شرایط دریافت نوبت از پذیرش24',
            uploadRequired: true,
            getData: () => {},
            rules: termsAndConditions.data?.data?.result,
            loading: bookRequest.isLoading,
          }}
          nextStep={(data: TurnRequestInformation) => {
            if (!data.description) return toast.error('لطفا توضیحات را تکمیل کنید.');
            if (!data.checkedRules) return toast.error('لطفا قوانین را بپذیرید.');
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
          <Text className="p-5 leading-7 bg-white rounded-lg" fontWeight="bold">
            {firstFreeTimeErrorText}
          </Text>
          {!university && (
            <div className="flex flex-col space-y-3">
              <Text fontSize="sm" className="leading-6">
                برترین پزشکان{' '}
                <Text fontWeight="bold">
                  {profile?.expertises?.[0]?.expertise_groups?.[0]?.name} {center?.city ? `در ${center?.city}` : null}
                </Text>{' '}
                از دیدگاه بیماران
              </Text>
              {profile && (
                <Recommend
                  doctorId={profile.id}
                  city={profile.city_en_slug}
                  category={profile.expertises[0]?.expertise_groups[0].en_slug}
                  centerId={center?.id}
                />
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookingSteps;
