import React, { useState } from 'react';
import CloseIcon from '../../icons/close';
import { useRouter } from 'next/router';

export default function HamiBanner() {
  const [isShow, setIsShow] = useState(typeof window != 'undefined' && !window.localStorage.getItem('dont-show-hami-banner'));
  const router = useRouter();

  if (!isShow) return null;
  return (
    <div className="w-full bg-primary py-3 px-3 flex justify-between items-center" onClick={() => router.push('/s/?turn_type=consult')}>
      <span className="text-white font-medium text-xs text-right leading-5">
        در ویزیت آنلاین، امکان برقراری ارتباط با پزشک در پیام‌رسان داخلی پذیرش۲۴ و تماس وجود دارد و محدودیتی در ارسال پیام نیست.
      </span>
      <div
        className="min-w-6 h-6 bg-white/15 rounded-full flex items-center justify-center"
        onClick={() => {
          setIsShow(false);
          localStorage.setItem('dont-show-hami-banner', 'true');
        }}
      >
        <CloseIcon className="min-w-4 h-4 text-white " />
      </div>
    </div>
  );
}
