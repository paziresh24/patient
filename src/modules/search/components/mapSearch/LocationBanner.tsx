import React from 'react';
import classNames from '@/common/utils/classNames';

interface LocationBannerProps {
  show: boolean;
  onRetry: () => void;
  className?: string;
}

const LocationBanner: React.FC<LocationBannerProps> = ({
  show,
  onRetry,
  className = "",
}) => {
  if (!show) return null;

  return (
    <div className={classNames("p-3 bg-orange-50 border border-orange-200 rounded-lg", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-orange-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-orange-800 text-sm">
            برای نمایش بهتر نتایج، دسترسی به موقعیت مکانی را فعال کنید
          </span>
        </div>
        <button
          onClick={onRetry}
          className="text-orange-600 hover:text-orange-800 text-sm font-medium transition-colors duration-150"
        >
          تلاش مجدد
        </button>
      </div>
    </div>
  );
};

export default LocationBanner;