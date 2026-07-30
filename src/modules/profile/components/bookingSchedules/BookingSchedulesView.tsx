import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Popover } from '@plasmicpkgs/radix-ui';
import { classNames } from '@plasmicapp/react-web';
import Dialog from '.plasmic/Dialog';
import Button from '.plasmic/Button';
import CalendarIcon from '.plasmic/plasmic/fragment_icons/icons/PlasmicIcon__Calendar';
import ChevronDownIcon from '.plasmic/plasmic/fragment_icons/icons/PlasmicIcon__ChevronDown';
import InfoIcon from '.plasmic/plasmic/fragment_icons/icons/PlasmicIcon__Info';
import Icon17Icon from '.plasmic/plasmic/fragment_design_system/icons/PlasmicIcon__Icon17';
import XIcon from '.plasmic/plasmic/fragment_icons/icons/PlasmicIcon__X';
import projectcss from '.plasmic/plasmic/paziresh_24_booking/plasmic.module.css';
import sty from '.plasmic/plasmic/paziresh_24_booking/PlasmicBookingSchedules.module.css';
import { _useStyleTokens } from '.plasmic/plasmic/paziresh_24_booking/PlasmicStyleTokensProvider';
import {
  WEEK_DAYS,
  WorkhourSchedule,
  fetchCenterServices,
  fetchServiceSchedules,
  formatScheduleSlot,
} from '@/modules/profile/utils/workhourSchedules';
import localSty from './bookingSchedules.module.css';

type BookingSchedulesViewProps = {
  centerId?: string;
  centerName?: string;
  slug?: string;
  className?: string;
};

function DaySlots({ schedules, day }: { schedules: WorkhourSchedule[]; day: string }) {
  const slots = schedules.filter(item => item.day === day);
  if (!slots.length) {
    return <span className="text-slate-400">---</span>;
  }

  return (
    <div className="flex flex-wrap gap-1.5 justify-start w-full">
      {slots.map((slot, index) => (
        <span
          key={`${slot.from_hour}-${slot.to_hour}-${index}`}
          className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-[13px] leading-5 text-slate-700"
        >
          {formatScheduleSlot(slot)}
        </span>
      ))}
    </div>
  );
}

export function BookingSchedulesView({ centerId, centerName, slug, className }: BookingSchedulesViewProps) {
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [serviceMenuOpen, setServiceMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const styleTokensClassNames = _useStyleTokens();

  const servicesQuery = useQuery(
    ['booking-schedules-services', slug, centerId],
    () => fetchCenterServices(slug!, centerId!),
    {
      enabled: !!slug && !!centerId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const services = servicesQuery.data ?? [];

  useEffect(() => {
    if (!services.length) {
      setSelectedServiceId('');
      return;
    }
    setSelectedServiceId(prev => (prev && services.some(service => service.id === prev) ? prev : services[0].id));
  }, [services]);

  const schedulesQuery = useQuery(
    ['booking-schedules-workhours', selectedServiceId],
    () => fetchServiceSchedules(selectedServiceId),
    {
      enabled: !!selectedServiceId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const schedules = schedulesQuery.data ?? [];
  const selectedService = useMemo(
    () => services.find(service => service.id === selectedServiceId) ?? services[0],
    [services, selectedServiceId],
  );

  if (!slug || !centerId) return null;
  if (servicesQuery.isError) return null;
  if (servicesQuery.isSuccess && services.length === 0) return null;

  const isLoading = servicesQuery.isLoading || (!!selectedServiceId && schedulesQuery.isLoading);
  const hasSchedules = schedules.length > 0;
  const showServicePicker = services.length > 1;
  const hasError = schedulesQuery.isError;

  return (
    <div className={classNames(localSty.root)} dir="rtl">
      <div
        className={classNames(
          projectcss.all,
          projectcss.root_reset,
          projectcss.plasmic_default_styles,
          projectcss.plasmic_mixins,
          styleTokensClassNames,
        )}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Button
          children2={
            <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__jtSe)}>برنامه کاری</div>
          }
          className={classNames('__wab_instance', sty.button__o3I8D, localSty.scheduleTrigger)}
          outline
          showStartIcon
          startIcon={<CalendarIcon className={classNames(projectcss.all, sty.svg__ieOcA)} role="img" />}
          onClick={() => setDialogOpen(true)}
          style={{ width: '100%', maxWidth: '100%', alignSelf: 'stretch' }}
        />

        <Dialog
          noTrigger
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          className={classNames('__wab_instance', sty.dialog)}
          title={
            <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__hsVOo)}>
              {`برنامه کاری در ${centerName ?? ''}`}
            </div>
          }
          body={
            <>
              {isLoading ? (
                <div className={classNames(projectcss.all, sty.freeBox__vpiFh)}>
                  <Icon17Icon className={classNames(projectcss.all, sty.svg__mzAE, 'loader')} role="img" />
                </div>
              ) : null}

              {!isLoading && hasError ? (
                <div className={classNames(projectcss.all, sty.freeBox__uNfGv)}>
                  <XIcon className={classNames(projectcss.all, sty.svg__dKT8)} role="img" />
                  <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__t71AX)}>
                    خطا در دریافت برنامه کاری پزشک
                  </div>
                </div>
              ) : null}

              {!isLoading && !hasError ? (
                <div className={classNames(projectcss.all, sty.freeBox__qv9Rk)}>
                  {showServicePicker && selectedService ? (
                    <Popover
                      align="start"
                      className={classNames('__wab_instance', sty.popoverCore)}
                      onOpenChange={setServiceMenuOpen}
                      open={serviceMenuOpen}
                      side="bottom"
                      overlay={
                        <div className={classNames(projectcss.all, sty.freeBox__kShU)}>
                          <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__xYhmM)}>
                            خدمت را انتخاب کنید.
                          </div>
                          {services.map(service => {
                            const isSelected = service.id === selectedServiceId;
                            return (
                              <Button
                                key={service.id}
                                children2={
                                  <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__nuEbc)}>
                                    {service.service?.title ?? 'خدمت'}
                                  </div>
                                }
                                className={classNames('__wab_instance', sty.button__hIyj4)}
                                color={isSelected ? 'softBlue' : 'text'}
                                size="compact"
                                space
                                onClick={() => {
                                  setSelectedServiceId(service.id);
                                  setServiceMenuOpen(false);
                                }}
                              />
                            );
                          })}
                        </div>
                      }
                    >
                      <Button
                        children2={
                          <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__voqEo)}>
                            {selectedService.service?.title ?? 'انتخاب خدمت'}
                          </div>
                        }
                        className={classNames('__wab_instance', sty.button__exzpj)}
                        color="softBlue"
                        showEndIcon
                        space
                        endIcon={<ChevronDownIcon className={classNames(projectcss.all, sty.svg___4WLk1)} role="img" />}
                        style={{ width: '100%' }}
                      />
                    </Popover>
                  ) : null}

                  {hasSchedules ? (
                    WEEK_DAYS.map(day => (
                      <div className={classNames(projectcss.all, sty.freeBox__fgI1)} key={day.english}>
                        <div className={classNames(projectcss.all, sty.freeBox__cBbSj)}>
                          <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__x42En)}>
                            {day.persian}
                          </div>
                        </div>
                        <div className={classNames(projectcss.all, sty.freeBox__nvcct)}>
                          <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text__uTljt)}>
                            <DaySlots schedules={schedules} day={day.english} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={classNames(projectcss.all, sty.freeBox__xhyyH)}>
                      <InfoIcon className={classNames(projectcss.all, sty.svg__psuCv)} role="img" />
                      <div className={classNames(projectcss.all, projectcss.__wab_text, sty.text___6L5Zm)}>
                        پزشک در این مرکز برنامه کاری ندارد.
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </>
          }
        />
      </div>
    </div>
  );
}
