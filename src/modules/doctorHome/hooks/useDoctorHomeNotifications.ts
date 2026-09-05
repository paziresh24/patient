import { useGetNotifications } from '@/modules/hamdast/apis/notifications';
import { UserInfo } from '@/modules/login/store/userInfo';
import { useMemo } from 'react';
import { DoctorHomeFeedAlert } from '../types/feed';
import { dedupeNotifications } from '../utils/dedupeNotifications';
import {
  filterNotificationsBySelectedDate,
  getNotificationGregorianDateSet,
} from '../utils/normalizeNotification';
import { useSelectedDateStore } from '../store/selectedDate';
import { doctorHomeQueryDefaults } from '../utils/doctorHomeQuery';
import { useDoctorHomeContext } from './useDoctorHomeContext';

export const useDoctorHomeNotifications = (user?: UserInfo) => {
  const { isDoctor } = useDoctorHomeContext(user);
  const selectedDate = useSelectedDateStore(state => state.selectedDate);
  const notifications = useGetNotifications(undefined, {
    enabled: isDoctor,
    ...doctorHomeQueryDefaults,
  });

  const allItems = useMemo(() => {
    const raw = notifications.data?.data?.items ?? [];
    return raw.map(
      (item: {
        id?: string | number;
        title?: string;
        description?: string;
        sender?: string;
        created_at?: string;
        createdAt?: string;
      }): DoctorHomeFeedAlert => ({
        id: item.id,
        title: item.title,
        description: item.description,
        sender: item.sender,
        created_at: item.created_at ?? item.createdAt,
      }),
    );
  }, [notifications.data?.data?.items]);

  const notificationDateSet = useMemo(
    () => getNotificationGregorianDateSet(dedupeNotifications(allItems)),
    [allItems],
  );

  const itemsForSelectedDate = useMemo(
    () => filterNotificationsBySelectedDate(dedupeNotifications(allItems), selectedDate),
    [allItems, selectedDate],
  );

  return {
    isDoctor,
    items: itemsForSelectedDate,
    notificationDateSet,
    isLoading: notifications.isLoading,
  };
};
