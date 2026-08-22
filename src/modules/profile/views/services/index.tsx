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
import { useFeatureIsOn, useGrowthBook } from '@growthbook/growthbook-react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import queryStirng from 'querystring';
import { useInView } from 'react-intersection-observer';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import BulkService from './bulk';
import { useSamanDoctorAvailabilityStatus } from '@/common/apis/services/booking/samanDoctorAvailabilityStatus';
import { bookRequestAvailability } from '@/common/apis/services/booking/bookRequestAvailability';
import moment from 'jalali-moment';
import { splunkInstance } from '@/common/services/splunk';
import useCustomize from '@/common/hooks/useCustomize';
import Presence from './presence';
import PlasmicServicesWrapper from '.plasmic/Services';
import { Fragment2 } from '@/common/fragment/fragment2';
import {
  formatSamanAvailabilityTime,
  getScopedInPersonAvailability,
  getScopedOnlineVisitAvailability,
  mapSamanAvailabilityToCenters,
} from '@/modules/booking/functions/mapSamanAvailabilityToCenters';
import {
  filterBookableMappedCenterServices,
  mapDoctorCenterServices,
} from '@/modules/booking/functions/mapDoctorCenterServices';
import { useDoctorCenterServices } from '@/common/apis/services/doctor/getDoctorCenterServices';
import { getProfileOnlineVisitVisibility } from '@/modules/profile/utils/onlineVisitVisibility';
import { shouldShowRismanExternalBooking } from '@/modules/profile/utils/rismanBookingVisibility';
import { useChatLifecycleAutoCloseHours } from '@/common/apis/services/hami/chatLifecycleSettings';
import { sendDoctorProfileEvent } from '@/modules/profile/events/nightBatEvents';

const External = dynamic(() => import('./external'), {
  loading(loadingProps) {
    return <Skeleton w="100%" h="198px" rounded="lg" />;
  },
});
const Hamdast = dynamic(() => import('@/modules/hamdast/render').then(m => ({ default: m.Hamdast })), {
  loading() {
    return <Skeleton w="100%" h="4rem" rounded="lg" />;
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
  hamdastWidgetsData,
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
  hamdastWidgetsData?: Record<string, any>;
  dontShowDeactiveBox?: boolean;
}) => {
  const router = useRouter();
  const [servicesRef, inViewServices] = useInView({
    initialInView: true,
  });

  const growthbook = useGrowthBook();
  const checkBookRequestAvailability = useFeatureIsOn('check-book-request-availablility');
  const featureFromHook = useFeatureIsOn('online-visit-chat-lifecycle-duration');
  const [featureFromSlugAttr, setFeatureFromSlugAttr] = useState(false);

  // GB payload listing a slug ≠ feature on. Attribute `slug` must match exactly (e.g. …-3), and
  // features must be ready — otherwise Hami is never called and Plasmic keeps the hardcoded 3-day line.
  useLayoutEffect(() => {
    if (!growthbook || !slug) {
      setFeatureFromSlugAttr(false);
      return;
    }
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
      slug,
    });
    setFeatureFromSlugAttr(growthbook.isOn('online-visit-chat-lifecycle-duration'));
  }, [growthbook, slug, growthbook?.ready, featureFromHook]);

  const useChatLifecycleDuration = featureFromHook || featureFromSlugAttr;
  // Profile already has doctor.user_id (information.user_id) in the normal flow → Hami directly.
  // Fall back to profileData.user_id when information omits it; slug only when both missing.
  const profileDoctorUserId = doctor?.user_id ?? profileData?.user_id ?? profileData?.information?.user_id;
  const { days: chatLifecycleDays, isPending: isChatLifecycleDurationPending } =
    useChatLifecycleAutoCloseHours({
      enabled: useChatLifecycleDuration,
      doctorUserId: profileDoctorUserId,
      doctorSlug: profileDoctorUserId ? undefined : slug,
    });

  const samanAvailability = useSamanDoctorAvailabilityStatus(slug, {
    enabled: !!slug,
  });
  const { isMobile } = useResponsive();
  const isWebView = useWebView();
  const dontShowRateDetails = useFeatureIsOn('ravi_show_external_rate');
  const showHamdastGa = useFeatureIsOn('hamdast::ga');
  const customize = useCustomize(state => state.customize);
  const { handleOpen: handleOpenAvailabilityModal, modalProps: availabilityModalProps } = useModal();
  const [availabilityMessage, setAvailabilityMessage] = useState<string>('');

  const samanLoaded = !!samanAvailability.data && !samanAvailability.isError;
  const samanPending = !samanLoaded && !samanAvailability.isError;
  const samanStatus: 'pending' | 'success' | 'error' = samanAvailability.isError
    ? 'error'
    : samanAvailability.data
      ? 'success'
      : 'pending';
  // dontShowDeactiveBox means Risman payload exists — hide native Bulk when Risman should own the CTA.
  // Decision source: Saman only (never Full-profile isBulk).
  const showRismanExternalBooking = shouldShowRismanExternalBooking(
    dontShowDeactiveBox ? true : null,
    centers,
    samanAvailability.data,
    samanStatus,
  );
  const scopedInPerson = useMemo(
    () => getScopedInPersonAvailability(centers, samanAvailability.data),
    [centers, samanAvailability.data],
  );
  const scopedOnlineVisit = useMemo(
    () => getScopedOnlineVisitAvailability(centers, samanAvailability.data),
    [centers, samanAvailability.data],
  );

  // consult_active_booking (onlineVisit.enabled) is legacy — profile UI uses centers API (5532) + Saman.
  const hasPresence =
    router.query.centerTarget != CENTERS.CONSULT && centers.some((center: any) => String(center.id) !== CENTERS.CONSULT);

  const onlineVisitVisibility = getProfileOnlineVisitVisibility({
    centers,
    onlineVisit,
    samanLoaded,
    samanData: samanAvailability.data,
  });
  const showOnlineVisit = onlineVisitVisibility.show;
  const onlineVisitVisibilitySentRef = useRef<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    // Wait until Saman settled (or errored) so reason is meaningful; still log pending once if never settles.
    if (!samanLoaded && !samanAvailability.isError) return;
    const key = `${slug}:${onlineVisitVisibility.reason}:${showOnlineVisit}`;
    if (onlineVisitVisibilitySentRef.current === key) return;
    onlineVisitVisibilitySentRef.current = key;
    sendDoctorProfileEvent('online_visit_visibility', 'gate_evaluated', {
      slug,
      doctor_id: id,
      show: showOnlineVisit,
      reason: onlineVisitVisibility.reason,
      has_bookable_5532: centers?.some((c: any) => String(c.id) === CENTERS.CONSULT) ?? false,
      saman_loaded: samanLoaded,
      saman_error: samanAvailability.isError,
    });
  }, [
    slug,
    id,
    samanLoaded,
    samanAvailability.isError,
    showOnlineVisit,
    onlineVisitVisibility.reason,
    centers,
  ]);

  const consultCenter = centers.find((center: any) => String(center.id) === CENTERS.CONSULT);
  // full-profile service ids can be stale; always load 5532 services from drprofile when showing online visit.
  const needsOnlineServices = showOnlineVisit && !!consultCenter;

  const onlineServicesQuery = useDoctorCenterServices(slug, CENTERS.CONSULT, {
    enabled: !!slug && needsOnlineServices,
  });

  const onlineVisitServices = useMemo(() => {
    if (!consultCenter) return [];
    const profileServices = filterBookableMappedCenterServices(consultCenter.services ?? []);
    if (!needsOnlineServices) return profileServices;
    if (onlineServicesQuery.isSuccess && onlineServicesQuery.data) {
      // drprofile returns historical inactive consult rows; only show bookable/requestable.
      return filterBookableMappedCenterServices(
        mapDoctorCenterServices(onlineServicesQuery.data, consultCenter.user_center_id),
      );
    }
    if (onlineServicesQuery.isError) return profileServices;
    return [];
  }, [
    consultCenter,
    needsOnlineServices,
    onlineServicesQuery.isSuccess,
    onlineServicesQuery.isError,
    onlineServicesQuery.data,
  ]);
  const canBookPresence = !samanLoaded || scopedInPerson.bookingAvailable;

  const servicesPlacementWidgets = useMemo(
    () => enabledWidgets?.filter((widget: any) => widget?.placement?.includes?.('services')) ?? [],
    [enabledWidgets],
  );

  const renderServicesPlacementWidgets = () =>
    servicesPlacementWidgets.map((widget: any) => (
      <Hamdast
        key={widget.id}
        id={widget.id}
        app={widget?.app}
        backendData={hamdastWidgetsData?.[widget.id] ?? undefined}
        profileData={profileData}
        widgetData={{
          placement: widget?.placement,
          placement_metadata: widget.placements_metadata,
        }}
      />
    ));

  const samanHasNoBooking = samanLoaded && !scopedInPerson.bookingAvailable && !scopedOnlineVisit.bookingAvailable;
  const hasNoBooking = samanAvailability.isError ? true : samanLoaded ? samanHasNoBooking : false;

  const presenceCenters = useMemo(() => {
    const inPersonCenters = centers.filter((center: any) => center.id !== CENTERS.CONSULT);

    if (samanLoaded) {
      return mapSamanAvailabilityToCenters(inPersonCenters, samanAvailability.data).map(center => ({
        ...center,
        waiting_time_info: waitingTimeInfo?.find?.((c: any) => c?.center_id == center.id),
        is_book_request: (center as any).services?.some((service: any) => service.can_request == 1),
      }));
    }

    return inPersonCenters.map(center => ({
      ...center,
      waiting_time_info: waitingTimeInfo?.find?.((c: any) => c?.center_id == center.id),
      is_book_request: center.services?.some((service: any) => service.can_request == 1),
    }));
  }, [centers, samanAvailability.data, samanLoaded, waitingTimeInfo]);

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
    serviceId?: string,
    provider_id?: string,
    user_id?: string,
    city_name?: string,
  ) => {
    const hasValidServiceId = !!serviceId && String(serviceId) !== '-1';
    const isBookRequest =
      hasValidServiceId &&
      centers
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
            service_id: serviceId!,
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
      ...(hasValidServiceId && { serviceId }),
      cityName: city_name,
      ...(provider_id && user_id && { providerId: provider_id, userId: user_id }),
      ...(isBookRequest && { timeId: '-1' }),
    };

    // Navigate first; analytics after — keeps booking click off the Splunk path (INP).
    if (isNativeWebView()) {
      if (isBookRequest) {
        location.assign(`/booking/${slug}?${queryStirng.stringify({ ...params, openInBrowser: 1 })}`);
        onEvent({ centerId, serviceId: serviceId ?? '' });
        return;
      }
    }

    router.push(`/booking/${slug}?${queryStirng.stringify({ ...params })}`);
    onEvent({ centerId, serviceId: serviceId ?? '' });
  };

  if (!customize?.partnerKey && showRismanExternalBooking && hasNoBooking) {
    return servicesPlacementWidgets.length > 0 ? (
      <div className="flex flex-col space-y-3">{renderServicesPlacementWidgets()}</div>
    ) : null;
  }

  if (samanPending) {
    return <Skeleton w="100%" h="198px" rounded="lg" />;
  }

  // Legacy / fully unavailable: show only Bulk when nothing is bookable
  if (hasNoBooking && !showOnlineVisit) {
    const sortedAvalaibleTime = () => {
      if (samanLoaded) {
        const futureTimes = [scopedInPerson.nearestAvailableTime, scopedOnlineVisit.nearestAvailableTime].filter(
          (time): time is string => !!time,
        );
        const earliest = futureTimes.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];
        if (earliest) {
          return formatSamanAvailabilityTime(earliest) || undefined;
        }
      }

      return undefined;
    };

    return (
      <div className="flex flex-col space-y-3">
        <BulkService
          displayName={doctor.display_name}
          expertises={expertises}
          availableTime={sortedAvalaibleTime()}
          dcotorCity={doctor?.city_en_slug}
        />
        {renderServicesPlacementWidgets()}
      </div>
    );
  }

  // Hide empty in-person "no booking" box when online visit is active — but keep the future available_time box
  const hidePresenceBecauseOnlineOnly =
    samanLoaded && showOnlineVisit && !scopedInPerson.bookingAvailable && !scopedInPerson.nearestAvailableTime;
  const showPresenceBulk = samanLoaded && hasPresence && !scopedInPerson.bookingAvailable && !hidePresenceBecauseOnlineOnly;
  const showPresenceSection = hasPresence && !hidePresenceBecauseOnlineOnly;

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
        {showOnlineVisit && needsOnlineServices && onlineServicesQuery.isFetching && (
          <Skeleton w="100%" h="120px" rounded="lg" />
        )}
        {showOnlineVisit &&
          !(needsOnlineServices && onlineServicesQuery.isFetching) &&
          onlineVisitServices.map((service: any, index: number) => {
            // Feature on (non-21/47): hide Plasmic hardcoded 3-day line while we render Hami hours ourselves.
            // Expertise 21/47 keep legacy "مدت زمان گفتگو" from service.duration — do not touch.
            const expertiseGroupId = expertises?.group_expertises?.[0]?.id;
            const isDurationRowExpertise = expertiseGroupId === 21 || expertiseGroupId === 47;
            const showLifecycleAskDoctorCopy = useChatLifecycleDuration && !isDurationRowExpertise;
            const serviceWithLifecycleDuration = !showLifecycleAskDoctorCopy
              ? service
              : chatLifecycleDays != null
                ? { ...service, chat_lifecycle_auto_close_days: chatLifecycleDays }
                : { ...service, chat_lifecycle_loading: true };

            return (
              <div key={service.id ?? index} className="flex flex-col gap-2">
                <Fragment2
                  name="Services"
                  Component={PlasmicServicesWrapper}
                  args={{
                    ...profileData,
                    service: serviceWithLifecycleDuration,
                    onEvent: () => onEvent({ centerId: CENTERS.CONSULT, serviceId: service.id }),
                  }}
                  variants={{ type: 'onlineVisit' }}
                />
                {showLifecycleAskDoctorCopy && isChatLifecycleDurationPending && (
                  <div className="px-4 py-1">
                    <Skeleton w="15rem" h="1rem" rounded="full" />
                  </div>
                )}
              </div>
            );
          })}
        {renderServicesPlacementWidgets()}
        {showPresenceSection &&
          (showPresenceBulk ? (
            <BulkService
              displayName={doctor.display_name}
              expertises={expertises}
              availableTime={formatSamanAvailabilityTime(scopedInPerson.nearestAvailableTime) || undefined}
              dcotorCity={doctor?.city_en_slug}
              showSubstituteDoctor={false}
            />
          ) : (
            <Presence
              doctorId={id}
              centers={presenceCenters}
              onBook={({ centerId, serviceId }) =>
                handleOpenBookingPage(slug, centerId, serviceId, doctor.provider_id, doctor.user_id, doctor.city_en_slug)
              }
              displayName={doctor.display_name}
              expertises={expertises}
              doctorCity={doctor?.city_en_slug}
              bookingDisabled={samanLoaded && !canBookPresence}
            />
          ))}
      </div>

      {isMobile && !inViewServices && (
        <div
          className={classNames('fixed z-50 w-full p-3 bg-white border-t bottom-16 shadow-card border-slate-100', {
            'bottom-0': isWebView,
          })}
        >
          <Button
            onClick={() => scrollIntoViewWithOffset('#book-me', 90)}
            block
            disabled={samanLoaded && !canBookPresence && !showOnlineVisit}
          >
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
