import React from 'react';
import { DoctorSearchResult } from '@/common/apis/services/search/jahannamaSearch';
import classNames from '@/common/utils/classNames';

interface DoctorResultsListProps {
  doctors: DoctorSearchResult[];
  totalResults?: number;
  selectedDoctorId?: string | null;
  isLoading?: boolean;
  searchQuery?: string;
  onDoctorClick?: (doctorId: string) => void;
  onBookAppointment?: (doctor: DoctorSearchResult) => void;
  onOnlineConsult?: (doctor: DoctorSearchResult) => void;
  className?: string;
  isMobile?: boolean;
}

const DoctorCard: React.FC<{
  doctor: DoctorSearchResult;
  isSelected: boolean;
  onDoctorClick?: (doctorId: string) => void;
  onBookAppointment?: (doctor: DoctorSearchResult) => void;
  onOnlineConsult?: (doctor: DoctorSearchResult) => void;
  isMobile?: boolean;
}> = ({
  doctor,
  isSelected,
  onDoctorClick,
  onBookAppointment,
  onOnlineConsult,
  isMobile = false,
}) => {
  return (
    <div
      id={`doctor-card-${doctor.documentId}`}
      className={classNames(
        'border rounded-lg cursor-pointer transition-all duration-200 doctor-card-hover',
        isMobile ? 'p-3 active:bg-gray-50' : 'p-4',
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      )}
      onClick={() => onDoctorClick?.(doctor.documentId)}
    >
      <div className="flex items-start space-x-4 space-x-reverse">
        {/* Doctor Image */}
        <div className="flex-shrink-0">
          <img
            src={doctor.source.image ? `https://cdn.paziresh24.com/getImage/p24/search-men/${doctor.source.image}` : 'https://cdn.paziresh24.com/getImage/p24/search-men/noimage.png'}
            alt={doctor.source.display_name}
            className="w-16 h-16 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://cdn.paziresh24.com/getImage/p24/search-men/noimage.png';
            }}
          />
        </div>

        {/* Doctor Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigate to doctor profile page using doctor slug
                    const currentOrigin = window.location.origin;
                    window.open(`${currentOrigin}/dr/${doctor.source.slug}`, '_blank');
                  }}>
                {doctor.source.prefix} {doctor.source.display_name}
              </h3>
              
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {doctor.source.expertise.join('، ')}
              </p>
            </div>

            {/* Bookmark Button */}
            <button 
              className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors duration-150"
              onClick={(e) => {
                e.stopPropagation();
                // Handle bookmark logic
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Rating and Stats */}
          <div className="flex items-center flex-wrap gap-4 mt-2">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium text-gray-700 mr-1">
                {doctor.source.star}
              </span>
              <span className="text-sm text-gray-500 mr-1">
                ({doctor.source.rates_count} نظر)
              </span>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                رضایتمندی: 
                <span className="font-medium text-green-600 mr-1">
                  {doctor.source.satisfaction}%
                </span>
              </span>
            </div>
          </div>

          {/* Consultation Price */}
          {doctor.source.consult_services && doctor.source.consult_services.length > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-600">
                مشاوره آنلاین: 
                <span className="font-medium text-blue-600 mr-1">
                  {doctor.source.consult_services[0].free_price.toLocaleString()} تومان
                </span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className={classNames(
            "flex space-x-2 space-x-reverse mt-3",
            isMobile ? "flex-col space-y-2 space-x-0" : ""
          )}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Navigate to booking page using doctor slug
                const currentOrigin = window.location.origin;
                window.open(`${currentOrigin}/booking/${doctor.source.slug}`, '_blank');
              }}
              className={classNames(
                "text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center",
                isMobile ? "py-2.5 px-4 w-full" : "px-3 py-1.5"
              )}
            >
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              نوبت آنلاین
            </button>
            
            {doctor.source.consult_active_booking && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Navigate to online consultation page using doctor slug
                  const currentOrigin = window.location.origin;
                  window.open(`${currentOrigin}/booking/${doctor.source.slug}/?centerId=5532&skipTimeSelectStep=true`, '_blank');
                }}
                className={classNames(
                  "text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-150 flex items-center justify-center",
                  isMobile ? "py-2.5 px-4 w-full" : "px-3 py-1.5"
                )}
              >
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                مشاوره آنلاین
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{
  hasSearchQuery: boolean;
}> = ({ hasSearchQuery }) => {
  return (
    <div className="text-center py-12">
      {hasSearchQuery ? (
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-xl font-medium text-gray-900 mb-2">نتیجه‌ای یافت نشد</p>
          <p className="text-gray-600 mb-4">متأسفانه پزشکی با این مشخصات یافت نشد</p>
          <div className="text-sm text-gray-500">
            <p>پیشنهاد:</p>
            <ul className="mt-2 space-y-1">
              <li>• کلمات کلیدی دیگری را امتحان کنید</li>
              <li>• املای کلمات را بررسی کنید</li>
              <li>• جستجوی عمومی‌تری انجام دهید</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-xl font-medium text-gray-900 mb-2">جستجوی پزشکان اطراف شما</p>
          <p className="text-gray-600 mb-4">برای یافتن بهترین پزشکان در نزدیکی خود جستجو کنید</p>
          <div className="text-sm text-gray-500">
            <p>می‌توانید جستجو کنید:</p>
            <ul className="mt-2 space-y-1">
              <li>• نام پزشک (مثل: دکتر احمدی)</li>
              <li>• تخصص پزشکی (مثل: قلب و عروق)</li>
              <li>• نام مرکز درمانی</li>
              <li>• نوع بیماری یا علامت</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

const DoctorResultsList: React.FC<DoctorResultsListProps> = ({
  doctors,
  totalResults,
  selectedDoctorId,
  isLoading = false,
  searchQuery = '',
  onDoctorClick,
  onBookAppointment,
  onOnlineConsult,
  className = "",
  isMobile = false,
}) => {
  return (
    <div className={classNames("h-full flex flex-col", className)}>
      {/* Header - Hide on mobile when in bottom sheet mode */}
      {!isMobile && (
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              نتایج جستجو
              {totalResults !== undefined && totalResults > 0 && (
                <span className="text-sm font-normal text-gray-500 mr-2">
                  ({totalResults.toLocaleString()} نتیجه)
                </span>
              )}
            </h2>
            
            {isLoading && (
              <div className="flex items-center text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 ml-2"></div>
                <span className="text-sm">در حال جستجو...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Content */}
      <div className={classNames(
        "flex-1 overflow-y-auto",
        isMobile ? "results-scroll" : ""
      )}>
        {isLoading && doctors.length === 0 ? (
          /* Loading State */
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start space-x-4 space-x-reverse p-4 border border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                    <div className="flex space-x-2 space-x-reverse">
                      <div className="h-6 bg-gray-300 rounded w-20"></div>
                      <div className="h-6 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          /* Doctor Cards */
          <div className={classNames(
            "space-y-4",
            isMobile ? "p-3" : "p-4"
          )}>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.documentId}
                doctor={doctor}
                isSelected={selectedDoctorId === doctor.documentId}
                onDoctorClick={onDoctorClick}
                onBookAppointment={onBookAppointment}
                onOnlineConsult={onOnlineConsult}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <EmptyState hasSearchQuery={!!searchQuery} />
        )}
      </div>
    </div>
  );
};

export default DoctorResultsList;