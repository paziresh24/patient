import Button from '@/common/components/atom/button';
import React from 'react';
import { useGetSubscriptions } from './apis/subscriptions';
import moment from 'jalali-moment';
import useModal from '@/common/hooks/useModal';
import Modal from '@/common/components/atom/modal';
import { Router, useRouter } from 'next/router';
import { useMarkAsRead } from './apis/mark-read-notification';
import { useGetPerformance } from './apis/performance';

export default function AppCard({ item, deactive, notifications = [], myAppSendEvent }: any) {
  const { data: subscriptions } = useGetSubscriptions({ appKey: item.app_key });
  const { handleOpen, handleClose, modalProps } = useModal();
  const router = useRouter();
  const markAsRead = useMarkAsRead();
  const { data: performance } = useGetPerformance({ appKey: item?.app_key });

  const remainingSubscription = +(
    100 -
    Math.max(
      0,
      100 *
        ((new Date(subscriptions?.data?.active_subscription?.ending_at).getTime() - new Date().getTime()) /
          (new Date(subscriptions?.data?.active_subscription?.ending_at).getTime() -
            new Date(subscriptions?.data?.active_subscription?.subscription_at).getTime())),
    )
  ).toFixed(2);

  return (
    <div className="py-2 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          <img src={item?.icon} alt="" className="w-11 h-11 border object-cover border-slate-100 rounded-full" />
          <div className="flex flex-col">
            <span className="font-medium text-[13px]">{item?.title}</span>
            <span className="text-[11px]">{item?.subtitle}</span>
          </div>
        </div>
        {deactive && (
          <Button
            size="sm"
            variant="secondary"
            className="h-8 min-w-24 text-xs text-amber-900 border-amber-700/30 bg-amber-50 hover:bg-amber-100"
            onClick={() => {
              router.push(item?.link);
              myAppSendEvent('renew_subscription');
            }}
          >
            تمدید اشتراک
          </Button>
        )}
        {!deactive && (
          <div className="relative">
            {notifications?.length > 0 && (
              <span className="bg-red-600 rounded-full font-bold -right-2 -top-2 absolute text-white text-xs w-5 h-5 flex justify-center items-center">
                {notifications?.length}
              </span>
            )}
            <Button
              size="sm"
              variant="secondary"
              className="h-8 min-w-14 text-xs"
              onClick={() => {
                notifications?.length > 0 ? handleOpen() : router.push(item?.link + '?direct=true');

                myAppSendEvent('open_app_button');
              }}
            >
              اجرا
            </Button>
          </div>
        )}
      </div>
      {performance?.data?.metrics && (
        <div className="flex gap-1 rounded-full bg-slate-100 py-1 px-4 justify-between items-center ">
          <span className="text-[10px] font-semibold">آمار استفاده مراجعین صفحه شما</span>

          <div className="flex gap-2 items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  height="1em"
                  role="img"
                  className="text-green-700 w-4 h-4"
                >
                  <path d="M16 7h6v6"></path>
                  <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                </svg>
                <span className="text-[10px] font-medium">{performance?.data?.metrics?.total_clicks}</span>
              </div>
              <span className="text-[10px] font-medium">تعداد کلیک</span>
            </div>
            <div className="flex flex-col justify-center items-center">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  height="1em"
                  role="img"
                  className="text-green-700 w-4 h-4"
                >
                  <path d="M16 7h6v6"></path>
                  <path d="m22 7-8.5 8.5-5-5L2 17"></path>
                </svg>
                <span className="text-[10px] font-medium">{performance?.data?.metrics?.ctr}</span>
              </div>
              <span className="text-[10px] font-medium">نرخ تبدیل</span>
            </div>
          </div>
        </div>
      )}
      {subscriptions?.data?.active_subscription && remainingSubscription > 80 && (
        <div className="flex flex-col gap-1">
          <div className="w-full">
            <div className="bg-slate-100 h-1 w-full rounded-full overflow-hidden">
              <div
                className="bg-red-400 h-full rounded-full"
                style={{
                  width: remainingSubscription + '%',
                }}
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-medium">اشتراک ابزارک درحال تمام شدن است.</span>
            <span className="text-[10px] font-medium text-red-700">
              {moment(subscriptions?.data?.active_subscription?.ending_at).diff(moment(), 'day')} روز دیگر
            </span>
          </div>
        </div>
      )}
      <Modal {...modalProps} title="اعلان‌های خوانده نشده" noHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            {notifications?.map((notification: any) => (
              <div className="p-3 border flex flex-col border-slate-100 rounded-lg" key={item.id}>
                <span className="text-sm font-bold">{notification?.title}</span>
                <span className="text-xs">{notification?.description}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => {
              notifications?.forEach((notification: any) => {
                markAsRead.mutate({ id: notification.id });
              });
              router.push(item?.link + '?direct=true');
              myAppSendEvent('read_notifications_and_open_app');
            }}
          >
            خواندم و اجرای ابزارک
          </Button>
        </div>
      </Modal>
    </div>
  );
}
