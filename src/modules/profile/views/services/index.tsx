import Button from '@/common/components/atom/button/button';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import useResponsive from '@/common/hooks/useResponsive';
import useWebView from '@/common/hooks/useWebView';
import useModal from '@/common/hooks/useModal';
import { CENTERS } from '@/common/types/centers';
import classNames from '@/common/utils/classNames';
import { isNativeWebView } from '@/common/utils/isNativeWebView';
import scrollIntoViewWithOffset from '@/common/utils/scrollIntoViewWithOffset';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import queryStirng from 'querystring';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import BulkService from './bulk';
import { useAvailabilityStatus } from '@/common/apis/services/booking/availabilityStatus';
import { bookRequestAvailability } from '@/common/apis/services/booking/bookRequestAvailability';
import moment from 'jalali-moment';
import sortBy from 'lodash/sortBy';
import { splunkInstance } from '@/common/services/splunk';
import useCustomize from '@/common/hooks/useCustomize';
import Presence from './presence';
import PlasmicServices from '.plasmic/plasmic/paziresh_24/PlasmicServices';
import { Fragment2 } from '@/common/fragment/fragment2';
const External = dynamic(() => import('./external'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="198px" rounded="lg" />;
  },
});

export const Services = ({
  id,
  doctor,
  expertises,
  centers,
  slug,
  onlineVisit,
  waitingTimeInfo,
  profileData,
  isBulk,
  enabledWidgets,
  dontShowDeactiveBox,
}: {
  id: string;
  expertises: any;
  doctor: any;
  centers: any[];
  slug: string;
  onlineVisit: any;
  waitingTimeInfo: any;
  profileData: any;
  isBulk: boolean;
  enabledWidgets?: any[];
  dontShowDeactiveBox?: boolean;
}) => {
  const router = useRouter();
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });

  const useAvailabilityStatusApi = useFeatureIsOn('use-availability-status-api');
  const checkBookRequestAvailability = useFeatureIsOn('check-book-request-availablility');

  const alabilityStatus = useAvailabilityStatus(
    { user_id: doctor.user_id, center_id: centers.map(center => center.id), slug: slug },
    { enabled: !!useAvailabilityStatusApi },
  );
  const { isMobile } = useResponsive();
  const isWebView = useWebView();
  const dontShowRateDetails = useFeatureIsOn('ravi_show_external_rate');
  const showHamdastGa = useFeatureIsOn('hamdast::ga');
  const customize = useCustomize(state => state.customize);
  const { handleOpen: handleOpenAvailabilityModal, modalProps: availabilityModalProps } = useModal();
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');

  const onEvent = ({ centerId, serviceId }: { centerId: string; serviceId: string }) => {
    splunkInstance('doctor-profile').sendEvent({
      group: 'booking-widget-doctor-profile',
      type: 'book-button-click',
      event: {
        data: {
          slug: slug,
          center_id: centerId,
          service_id: serviceId,
          features: {
            ravi_show_external_rate: dontShowRateDetails,
          },
          enabled_widgets: enabledWidgets?.map((item: any) => item.id) ?? [],
        },
      },
    });
  };

  const handleOpenBookingPage = async (
    slug: string,
    centerId: string,
    serviceId: string,
    provider_id?: string,
    user_id?: string,
    city_name?: string,
  ) => {
    const isBookRequest = centers
      ?.find?.(center => center.id === centerId)
      ?.services?.find?.((service: { id: string }) => service.id === serviceId)?.can_request;

    // Check book request availability if feature flag is enabled and it's a book request
    if (isBookRequest && checkBookRequestAvailability) {
      const userCenterId = centers
        ?.find?.(center => center.id === centerId)
        ?.services?.find?.((service: { id: string }) => service.id === serviceId)?.user_center_id;

      if (userCenterId) {
        try {
          const availabilityResponse = await bookRequestAvailability({
            center_id: centerId,
            user_center_id: userCenterId,
            service_id: serviceId,
          });

          if (!availabilityResponse.status && availabilityResponse.available_time) {
            // Format ISO time to Jalali readable format
            const formattedTime = moment(availabilityResponse.available_time).locale('fa').calendar(undefined, {
              sameDay: '[امروز] ساعت HH:mm',
              nextDay: '[فردا] ساعت HH:mm',
              sameElse: 'jD jMMMM ساعت HH:mm',
            });

            // Show message to user in modal
            setAvailabilityMessage(`در حال حاضر امکان ثبت درخواست نوبت وجود ندارد. لطفاً ${formattedTime} تلاش کنید.`);
            handleOpenAvailabilityModal();
            return;
          }
        } catch (error) {
          setAvailabilityMessage('در حال حاضر امکان ثبت درخواست نوبت وجود ندارد. لطفاً چند دقیقه دیگر تلاش کنید.');
          handleOpenAvailabilityModal();
          return;
        }
      }
    }

    const params = {
      centerId,
      serviceId,
      cityName: city_name,
      ...(provider_id && user_id && { providerId: provider_id, userId: user_id }),
      ...(isBookRequest && { timeId: '-1' }),
    };

    onEvent({ centerId, serviceId });

    if (isNativeWebView()) {
      if (isBookRequest) return location.assign(`/booking/${slug}?${queryStirng.stringify({ ...params, openInBrowser: 1 })}`);
    }

    router.push(`/booking/${slug}?${queryStirng.stringify({ ...params })}`);
  };


  if (
    !customize?.partnerKey &&
    dontShowDeactiveBox &&
    (alabilityStatus.data?.data ? !alabilityStatus.data?.data?.has_available_booking : isBulk)
  ) {
    return null;
  }

  if (alabilityStatus.data?.data ? !alabilityStatus.data?.data?.has_available_booking : isBulk) {
    const sortedAvalaibleTime = () => {
      const centers = alabilityStatus.data?.data?.availability?.filter((item: any) => item?.status === 'FUTURE_AVAILABLE');
      const availableTime = sortBy(centers, 'available_time')[0]?.available_time;
      if (availableTime) {
        return moment(availableTime)?.locale('fa').calendar(undefined, {
          sameDay: '[امروز] ساعت HH:mm',
          nextDay: '[فردا] ساعت HH:mm',
          sameElse: 'jD jMMMM ساعت HH:mm',
        });
      }
      return undefined;
    };

    return (
      <BulkService
        displayName={doctor.display_name}
        expertises={expertises}
        availableTime={sortedAvalaibleTime()}
        dcotorCity={doctor?.city_en_slug}
      />
    );
  }


  return (
    <>
      <div ref={servicesRef} className="flex flex-col space-y-3">
        {slug === 'دکتر-پروفسور-نور-بالا' && (
          <External
            title="ویزیت آنلاین (غیر فعال)"
            buttonText="ورود به سایت دکتر پروفسور محمد تقی نوربالا"
            description={`در حال حاضر ویزیت آنلاین این پزشک در پذیرش 24 <strong>غیرفعال</strong> می باشد! شما میتوانید با کلیک بر روی دکمه زیر، از طریق سایت تخصصی این پزشک، نوبت ویزیت آنلاین دریافت کنید.`}
            onBook={() => location.assign('http://drnoorbala.ir/')}
          />
        )}
        {onlineVisit.enabled &&
          centers
            .find((center: any) => center.id === CENTERS.CONSULT)
            ?.services?.map((service: any, index: number) => (
              <Fragment2
                key={index}
                name="Services"
                Component={PlasmicServices}
                args={{ ...profileData, service, onEvent: () => onEvent({ centerId: CENTERS.CONSULT, serviceId: service.id }) }}
                variants={{ type: 'onlineVisit' }}
              />
            ))}
        {router.query.centerTarget != CENTERS.CONSULT && centers?.some((center: any) => center.id !== CENTERS.CONSULT) && (
          <Presence
            doctorId={id}
            centers={centers
              .filter((center: any) => center.id !== CENTERS.CONSULT)
              .map(center => ({
                ...center,
                waiting_time_info: waitingTimeInfo?.find?.((c: any) => c?.center_id == center.id),
                ...(useAvailabilityStatusApi && {
                  is_active: alabilityStatus.data?.data?.availability?.find((c: any) => c.center_id === center.id)?.status == 'AVAILABLE',
                  freeturn_text: alabilityStatus.data?.data?.availability?.find((c: any) => c.center_id === center.id)?.freeturn
                    ? moment(alabilityStatus.data?.data?.availability?.find((c: any) => c.center_id === center.id)?.freeturn)
                      ?.locale('fa')
                      .calendar(undefined, {
                        sameDay: '[امروز] ساعت HH:mm',
                        nextDay: '[فردا] ساعت HH:mm',
                        sameElse: 'jD jMMMM ساعت HH:mm',
                      })
                    : '',
                  freeturns_info: alabilityStatus.data?.data?.availability
                    ?.filter((c: any) => c.center_id === center.id)
                    ?.map((item: any) => ({
                      available_time: item?.available_time ? new Date(item?.available_time).getTime() / 1000 : Date.now(),
                      availalbe_time_text: item?.available_time
                        ? moment(item?.available_time)?.locale('fa').calendar(undefined, {
                          sameDay: '[امروز] ساعت HH:mm',
                          nextDay: '[فردا] ساعت HH:mm',
                          sameElse: 'jD jMMMM ساعت HH:mm',
                        })
                        : '',
                    })),
                }),
                is_book_request: center.services.some((service: any) => service.can_request == 1),
              }))}
            onBook={({ centerId, serviceId }) =>
              handleOpenBookingPage(slug, centerId, serviceId, doctor.provider_id, doctor.user_id, doctor.city_en_slug)
            }
            displayName={doctor.display_name}
            expertises={expertises}
            doctorCity={doctor?.city_en_slug}
          />
        )}
      </div>

      {isMobile && !inViewServices && (
        <div
          className={classNames('fixed z-50 w-full p-3 bg-white border-t bottom-16 shadow-card border-slate-100', {
            'bottom-0': isWebView,
          })}
        >
          <Button onClick={() => scrollIntoViewWithOffset('#book-me', 90)} block>
            دریافت نوبت
          </Button>
        </div>
      )}

      <Modal title="درخواست نوبت" {...availabilityModalProps} bodyClassName="space-y-3">
        <Text fontWeight="medium" className="leading-7">
          {availabilityMessage}
        </Text>
        <Button block onClick={() => availabilityModalProps.onClose()}>
          متوجه شدم
        </Button>
      </Modal>
    </>
  );
};

export default Services;
