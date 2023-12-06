/* eslint-disable @next/next/no-img-element */

import { dayToSecond } from '@/common/utils/dayToSecond';
import { getCookie, setCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import Text from '../atom/text';
import CloseIcon from '../icons/close';
import StarIcon from '../icons/star';

import logoSvg from '../../../../public/logos/primary.svg';

export const PromoteAppBanner = () => {
  const [isShow, setIShow] = useState(false);
  useEffect(() => {
    setIShow(!getCookie('closeAppBanner'));
  }, []);
  const handleHide = () => {
    setCookie('closeAppBanner', true, {
      maxAge: dayToSecond(60),
    });
    setIShow(false);
  };

  if (!isShow) return null;
  return (
    <div className="fixed right-0 z-50 flex pwa:hidden items-center justify-between w-full p-3 px-5 bg-white border-t border-b border-solid md:hidden bottom-16 border-slate-200">
      <div className="flex items-center space-s-2">
        <CloseIcon className="cursor-pointer" onClick={handleHide} />
        <a href="/app" className="flex items-center space-s-2">
          <img className="w-12 h-12 p-1 border border-solid rounded-md" width={48} height={48} src={logoSvg.src} alt="اپلیکیشن پذیرش24" />
          <div className="flex flex-col">
            <Text fontSize="sm" fontWeight="bold">
              پذیرش24
            </Text>
            <Text fontSize="xs" fontWeight="medium">
              کاربری راحت تر با نصب اپلیکیشن
            </Text>
            <div className="flex mt-1">
              <StarIcon width={14} height={14} fill />
              <StarIcon width={14} height={14} fill />
              <StarIcon width={14} height={14} fill />
              <StarIcon width={14} height={14} fill />
              <StarIcon width={14} height={14} fill />
            </div>
          </div>
        </a>
      </div>
      <a href="/app">
        <Text fontWeight="bold" fontSize="sm" className="underline">
          نصب
        </Text>
      </a>
    </div>
  );
};

export default PromoteAppBanner;
