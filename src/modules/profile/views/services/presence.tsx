import dynamic from 'next/dynamic';

import Button from '@/common/components/atom/button/button';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import CalenderIcon from '@/common/components/icons/calender';
import useApplication from '@/common/hooks/useApplication';
import useCustomize from '@/common/hooks/useCustomize';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { sendGaEvent } from '@/common/services/sendGaEvent';
import classNames from '@/common/utils/classNames';
import { reformattedCentersProperty } from '@/modules/booking/functions/reformattedCentersProperty';
import { reformattedServicesProperty } from '@/modules/booking/functions/reformattedServicesProperty';
import { memo, useState } from 'react';
import Notification from '../../components/notification/notification';
import ServiceCard from '../../components/serviceCard/serviceCard';
import { useProfileSplunkEvent } from '../../hooks/useProfileEvent';
import orderBy from 'lodash/orderBy';
import SelectService from '@/modules/booking/views/selectService';
import SelectCenter from '@/modules/booking/views/selectCenter';
import { useRouter } from 'next/router';
import { useAbsentScore } from '@/common/apis/services/ravi/absentScore';
import BulkService from './bulk';

interface PresenceProps {
  centers: any[];
  waitingTime?: string;
  onBook: ({ centerId, serviceId }: { centerId: string; serviceId: string }) => void;
  displayName: string;
  expertises?: any;
  doctorCity?: string;
  doctorId?: string;
}

export const Presence = memo((props: PresenceProps) => {
  const { centers, waitingTime, onBook, displayName, expertises, doctorCity, doctorId } = props;
  const router = useRouter();
  const slug = router.query.slug as string;
  const { data: absentScoreData } = useAbsentScore(slug);
  const customise = useCustomize(state => state.customize);
  const isWebView = useWebView();
  const isApplication = useApplication();
  const { profileEvent } = useProfileSplunkEvent();
  const [selectedCenter, setSelectedCenter] = useState<any>({});

  const penaltyScoreItem = absentScoreData?.list?.find(item => item.penalty_score != null && item.penalty_score !== undefined);
  const penaltyScore = penaltyScoreItem?.penalty_score;

  const getAlertConfig = () => {
    if (!penaltyScore || penaltyScore === 0) {
      return null;
    }

    if (penaltyScore >= 1) {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-300',
        textColor: 'text-red-600',
        message: 'طبق نظر بیماران، "حتما" پیش از مراجعه، از حضور پزشک در مرکز اطمینان حاصل کنید.',
      };
    }

    if (penaltyScore > 0.1 && penaltyScore < 1) {
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-300',
        textColor: 'text-black',
        message: 'طبق نظر بیماران، حتما پیش از مراجعه، از حضور پزشک در مرکز اطمینان حاصل کنید.',
      };
    }

    if (penaltyScore <= 0.1) {
      return {
        bgColor: 'bg-[#f1f5f9]',
        borderColor: 'border-gray-300',
        textColor: 'text-black',
        message: 'طبق نظر بیماران، پیش از مراجعه، از حضور پزشک در مرکز اطمینان حاصل کنید.',
      };
    }

    return null;
  };

  const alertConfig = getAlertConfig();
  const {
    handleOpen: handleOpenSelectCenterModal,
    handleClose: handleCloseSelectCenterModal,
    modalProps: selectCenterModalProps,
  } = useModal();

  const {
    handleOpen: handleOpenSelectServiceModal,
    handleClose: handleCloseSelectServiceModal,
    modalProps: selectServiceModalProps,
  } = useModal();
  const { handleOpen: handleOpenSelectExternalBookingModal, modalProps: externalBookingModalProps } = useModal();
  const { handleOpen: handleOpenSelectDownloadAppModal, modalProps: downloadAppModalProps } = useModal();
  const isShowCenterAvailableBox =
    centers[0]?.freeturns_info?.length === centers[0].services.length
      ? centers[0]?.freeturns_info?.every((freeTurn: any) => freeTurn?.available_time > Math.floor(new Date().getTime() / 1000))
      : false;

  const handleOnBook = () => {
    sendGaEvent({ action: 'P24DrsPage', category: 'bookButtonStartPresence', label: 'bookButtonStartPresence' });
    sendGaEvent({ action: 'newprofile', category: 'button-book', label: displayName });

    profileEvent('doctor profile press book button', {
      centers_name: centers.map(center => center.name),
      centers_address: centers.map(center => center.address),
      centers_phone: centers.map(center => center.tell),
      centers_city: centers.map(center => center.city),
      centers_statuses: centers.map(center => center.status),
      centers_types: centers.map(center => center.center_type_name),
    });

    if (centers.length === 1) {
      const center = centers[0];
      handleOnBookByCenter(center, {
        event: {
          action: 'automatic_select_center',
        },
      });
      return;
    }

    profileEvent('center_selection_modal_load', {
      centers_name: centers.map(center => center.name),
      centers_address: centers.map(center => center.address),
      centers_phone: centers.map(center => center.tell),
      centers_city: centers.map(center => center.city),
      centers_statuses: centers.map(center => center.status),
      centers_types: centers.map(center => center.center_type_name),
    });
    handleOpenSelectCenterModal();
  };

  const handleOnBookByCenter = (center: any, options?: { event: Record<string, string> }) => {
    profileEvent('center_selection_modal_click', {
      center_name: center.name,
      center_address: center.address,
      center_phone: center.tell,
      center_city: center.city,
      center_status: center.status,
      center_type: center.center_type_name,
      ...options?.event,
    });
    setSelectedCenter(center);

    if (center.is_center === 'mashhad') {
      handleOpenSelectExternalBookingModal();
      return;
    }

    if (center.is_only_in_app.status && !customise.partnerKey && !isWebView && !isApplication) {
      handleOpenSelectDownloadAppModal();
      return;
    }

    if (center?.services?.length === 1) return onBook({ centerId: center.id, serviceId: center.services[0].id });

    profileEvent('doctor profile select center button', {
      selected_center_name: center?.name,
      freeturn_text: center?.freeturn_text,
    });

    handleOpenSelectServiceModal();
  };

  const handleOnBookByService = (service: any) => {
    profileEvent('doctor profile select service button', {
      service_id: service?.id,
      service_alias_title: service?.alias_title,
    });

    handleCloseSelectServiceModal();
    return onBook({ centerId: selectedCenter.id, serviceId: service.id });
  };

  if (centers.length === 1 && !!centers[0].freeturns_info?.length && isShowCenterAvailableBox) {
    return (
      <BulkService
        displayName={displayName}
        expertises={expertises ?? { group_expertises: [], expertises: [] }}
        dcotorCity={doctorCity ?? ''}
        availableTime={centers[0].freeturns_info?.[0] && centers[0].freeturns_info?.[0]?.availalbe_time_text}
      />
    );
  }

  const mainCenterWaitingTime = orderBy(centers, ['isDisable', o => !o.isAvailable])[0]?.waiting_time_info;
  const earliestFreeturn = orderBy(centers, ['isDisable', o => !o.isAvailable]).find(center => center.freeturn_text)?.freeturn_text;
  const isBookRequest = centers.every((center: any) => center.is_book_request);

  return (
    <div className="flex flex-col space-y-3">
      <ServiceCard
        variant="presence"
        header={{
          icon: <CalenderIcon className="h-5 w-5" isSolid />,
          title: 'نوبت اینترنتی و مراجعه حضوری',
          subtitle: centers.length > 1 ? `${centers.length} مرکز درمانی فعال` : undefined,
        }}
        body={{
          bulletTone: 'enhanced',
          description: [
            isBookRequest ? 'امکان ثبت درخواست نوبت' : 'امکان دریافت زودترین نوبت',
            centers.length > 1 && `انتخاب از <strong>${centers.length} مرکز درمانی</strong>`,
            earliestFreeturn && `زودترین نوبت خالی: <strong>${earliestFreeturn}</strong>`,
            mainCenterWaitingTime?.waiting_time_title &&
              `طبق نظر بیماران قبلی، میانگین زمان انتظار ویزیت: <strong>${mainCenterWaitingTime?.waiting_time_title}</strong>`,
          ].filter(Boolean),
        }}
        alert={
          alertConfig ? (
            <div className={classNames('rounded-xl border p-3', alertConfig.bgColor, alertConfig.borderColor)}>
              <Text fontSize="sm" className={classNames('leading-6', alertConfig.textColor)}>
                {alertConfig.message}
              </Text>
            </div>
          ) : undefined
        }
        footer={{
          actions: [
            {
              text: isBookRequest ? 'ثبت درخواست نوبت' : 'دریافت نوبت',
              onClick: handleOnBook,
            },
          ],
        }}
      />

      <Modal title="انتخاب مرکز درمانی" {...selectCenterModalProps} bodyClassName="pl-3">
        {selectCenterModalProps.isOpen && (
          <div className="pl-2 overflow-auto max-h-[28rem]">
            <SelectCenter
              centers={reformattedCentersProperty({ centers, displayName })}
              onSelect={center => handleOnBookByCenter(centers.find(c => c.id === center.id))}
            />
          </div>
        )}
      </Modal>

      <Modal title="انتخاب خدمت" {...selectServiceModalProps}>
        {selectServiceModalProps.isOpen && (
          <div>
            <SelectService
              center={selectedCenter}
              services={reformattedServicesProperty({ services: selectedCenter.services, center: selectedCenter })}
              onSelect={handleOnBookByService}
            />
          </div>
        )}
      </Modal>
      <Modal title="نوبت دهی اینترنتی و حضوری (غیرفعال)" {...externalBookingModalProps} bodyClassName="space-y-3">
        <Text fontWeight="medium" className="leading-7">
          در حال حاضر نوبت‌دهی اینترنتی این پزشک غیرفعال می‌باشد! شما می‌توانید با کلیک بر روی دکمه زیر، از طریق سایت دانشگاه علوم پزشکی
          مشهد نوبت خود را دریافت نمایید.
        </Text>
        <Button block onClick={() => location.assign('http://nobat.mums.ac.ir/AppointmentSite/')}>
          ورود به سایت دانشگاه علوم پزشکی مشهد
        </Button>
      </Modal>
      <Modal title="دانلود اپلیکیشن" {...downloadAppModalProps} bodyClassName="space-y-3">
        <Text fontWeight="medium" className="leading-7">
          {selectedCenter?.is_only_in_app?.message}
        </Text>
        <Button block onClick={() => location.assign('/app')}>
          دانلود اپلیکیشن
        </Button>
      </Modal>
    </div>
  );
});

export default Presence;
