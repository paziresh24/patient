import Button from '@/common/components/atom/button/button';
import Card from '@/common/components/atom/card/card';
import Modal from '@/common/components/atom/modal/modal';
import Text from '@/common/components/atom/text/text';
import useModal from '@/common/hooks/useModal';
import { CENTERS } from '@/common/types/centers';
import SelectCenter from '@/modules/booking/views/selectCenter/selectCenter';
import SelectService from '@/modules/booking/views/selectService/selectService';
import { memo, useCallback, useState } from 'react';
import { ServiceCard } from './card';

interface PresenceProps {
  centers: any[];
  waitingTime?: string;
  onBook: ({ centerId, serviceId }: { centerId: string; serviceId: string }) => void;
}

export const Presence = memo((props: PresenceProps) => {
  const { centers, waitingTime, onBook } = props;
  const [selectedCenter, setSelectedCenter] = useState<any>({});
  const {
    handleOpen: handleOpenSelectCenterModal,
    handleClose: handleCloseSelectCenterModal,
    modalProps: selectCenterModalProps,
  } = useModal();

  const { handleOpen: handleOpenSelectServiceModal, modalProps: selectServiceModalProps } = useModal();
  const { handleOpen: handleOpenSelectExternalBookingModal, modalProps: externalBookingModalProps } = useModal();
  const { handleOpen: handleOpenSelectDownloadAppModal, modalProps: downloadAppModalProps } = useModal();

  const reformatCentersProperty = (centers: any[]) => {
    return (
      centers
        ?.map((center: any) => {
          return {
            ...center,
            name: center.id === CENTERS.CONSULT ? 'ویزیت آنلاین' : center.name,
            address: center.id === CENTERS.CONSULT ? '' : center.address,
            freeturn: center.freeturn_text,
            type: center.id === '5532' ? 'consult' : center.center_type === 1 ? 'office' : 'hospital',
            phoneNumbers: center.display_number_array,
            isDisable: !center.is_active,
            isAvailable: center.freeturns_info?.[0] && center.freeturns_info?.[0]?.available_time < Math.floor(new Date().getTime() / 1000),
            availableTime: center.freeturns_info?.[0] && center.freeturns_info?.[0]?.availalbe_time_text,
          };
        })
        .filter(center => (center.id === '5532' ? !center.isDisable : true)) ?? []
    );
  };

  const handleOnBook = useCallback(() => {
    if (centers.length === 1) {
      const center = centers[0];
      handleOnBookByCenter(center);
      return;
    }
    handleOpenSelectCenterModal();
  }, []);

  const handleOnBookByCenter = useCallback((center: any) => {
    setSelectedCenter(center);
    handleCloseSelectCenterModal();

    if (center.is_center === 'mashhad') {
      handleOpenSelectExternalBookingModal();
      return;
    }

    if (center.is_only_in_app.status) {
      handleOpenSelectDownloadAppModal();
      return;
    }

    if (center?.services?.length === 1) return onBook({ centerId: center.id, serviceId: center.services[0].id });

    handleOpenSelectServiceModal();
  }, []);

  const handleOnBookByService = useCallback(
    (service: any) => {
      return onBook({ centerId: selectedCenter.id, serviceId: service.id });
    },
    [selectedCenter],
  );

  if (
    centers.length === 1 &&
    centers[0].freeturns_info?.[0] &&
    centers[0].freeturns_info?.[0]?.available_time > Math.floor(new Date().getTime() / 1000)
  ) {
    return (
      <Card className="space-y-3">
        <Text fontWeight="bold">زمان نوبت دهی پزشک به پایان رسیده است!</Text>
        <div className="flex flex-col p-4 space-y-1 border border-dashed rounded-lg border-slate-300">
          <Text fontSize="sm">زمان باز شدن نوبت دهی اینترنتی:</Text>
          <Text fontWeight="bold">{centers[0].freeturns_info?.[0] && centers[0].freeturns_info?.[0]?.availalbe_time_text}</Text>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <ServiceCard
        header={{
          title: 'نوبت اینترنتی و مراجعه حضوری',
        }}
        body={{
          description: ['امکان دریافت زودترین نوبت', waitingTime && `میانگین زمان انتظار تا ویزیت: <strong>${waitingTime}</strong>`].filter(
            Boolean,
          ),
        }}
        footer={{
          actions: [
            {
              text: 'دریافت نوبت',
              onClick: handleOnBook,
            },
          ],
        }}
      />
      <Modal title="انتخاب مرکز درمانی" {...selectCenterModalProps} bodyClassName="pl-3">
        <div className="pl-2 overflow-auto max-h-96">
          <SelectCenter
            centers={reformatCentersProperty(centers)}
            onSelect={center => handleOnBookByCenter(centers.find(c => c.id === center.id))}
          />
        </div>
      </Modal>
      <Modal title="انتخاب خدمت" {...selectServiceModalProps}>
        <div>
          <SelectService
            services={selectedCenter.services?.map((service: any) => ({
              id: service.id,
              name: service.alias_title,
              isDisable: !service.hours_of_work || !service.can_booking || service.can_booking === 0,
            }))}
            onSelect={handleOnBookByService}
          />
        </div>
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
