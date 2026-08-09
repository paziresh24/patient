import classNames from '@/common/utils/classNames';

import { useUserInfoStore } from '@/modules/login/store/userInfo';

import { useEffect, useState } from 'react';

import { DsCard, DsSectionHeader, ds } from '../designSystem';

import { useSelectedDateStore } from '../store/selectedDate';

import { useSheetDrawerProps } from '../hooks/doctorHomeSheetLayout';
import { useSheetRoute } from '../hooks/useSheetRoute';

import { DoctorHomeFeedAlert } from '../types/feed';

import { sendDoctorHomeEvent } from '../utils/analytics';

import {

  formatSelectedDateLabel,

  getNotificationDateKey,

  getNotificationFullText,

  getNotificationHeadline,

  getNotificationPreview,

} from '../utils/normalizeNotification';

import { DsDrawer } from './DsDrawer';

import { dsFocusRing } from '../utils/a11y';

import { FeedStaggerItem } from './feedContentSwap';
import { BellIcon } from './icons';



interface NotificationsSectionProps {

  items: DoctorHomeFeedAlert[];

  className?: string;

  widgetShell?: boolean;

}



export const NotificationsSection = ({ items, className, widgetShell = false }: NotificationsSectionProps) => {

  const userId = useUserInfoStore(state => state.info?.id);

  const selectedDate = useSelectedDateStore(state => state.selectedDate);

  const notificationSheet = useSheetRoute('notification');
  const notificationDrawerProps = useSheetDrawerProps(notificationSheet);

  const [selectedNotification, setSelectedNotification] = useState<DoctorHomeFeedAlert | null>(null);

  const selectedDateLabel = formatSelectedDateLabel(selectedDate);



  useEffect(() => {

    if (!notificationSheet.open) {

      setSelectedNotification(null);

    }

  }, [notificationSheet.open]);



  if (!items.length) return null;



  const openNotification = (notification: DoctorHomeFeedAlert, index: number) => {

    setSelectedNotification(notification);

    notificationSheet.openSheet({

      notification_id: String(notification.id ?? index),

    });

    sendDoctorHomeEvent(userId, 'notification_click', {

      title: getNotificationHeadline(notification),

      index,

      count: items.length,

      selected_date: selectedDate,

    });

  };



  const selectedHeadline = selectedNotification ? getNotificationHeadline(selectedNotification) : '';

  const selectedFullText = selectedNotification ? getNotificationFullText(selectedNotification) : '';



  return (

    <section dir="rtl" className={className}>

      <DsSectionHeader

        title="اعلان‌ها"

        subtitle={`${items.length.toLocaleString('fa-IR')} پیام · ${selectedDateLabel}`}

      />



      <DsCard padding="none" variant={widgetShell ? 'widget' : 'default'} className="overflow-hidden">

        <ul>

          {items.map((notification, index) => {

            const headline = getNotificationHeadline(notification);

            const preview = getNotificationPreview(notification);



            return (

              <li key={notification.id ?? `${headline}-${index}`}>
                <FeedStaggerItem index={index}>
                <button

                  type="button"

                  onClick={() => openNotification(notification, index)}

                  aria-label={`${headline}، مشاهده کامل`}

                  className={classNames(

                    'flex w-full items-start gap-3 text-start',

                    ds.motion.listRow,

                    ds.layout.rowPaddingWide,

                    dsFocusRing,

                    index < items.length - 1 && 'border-b border-slate-100',

                  )}

                >

                  <span className={classNames('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-amber-600', ds.surface.warningSoft)}>

                    <BellIcon size="sm" />

                  </span>



                  <div className="min-w-0 flex-1">

                    <p className={classNames(ds.type.cardTitle, 'leading-6')}>{headline}</p>

                    {preview ? (

                      <p className={classNames(ds.type.cardBody, 'mt-1 line-clamp-3 leading-6')}>{preview}</p>

                    ) : null}

                  </div>

                </button>
                </FeedStaggerItem>

              </li>

            );

          })}

        </ul>

      </DsCard>



      <DsDrawer

        {...notificationDrawerProps}

        title={selectedHeadline}

        description={selectedNotification ? selectedDateLabel : undefined}

      >

        <div className="px-4 pb-8">

          <p className={classNames(ds.type.cardBody, 'whitespace-pre-wrap leading-7')}>{selectedFullText}</p>

        </div>

      </DsDrawer>

    </section>

  );

};


