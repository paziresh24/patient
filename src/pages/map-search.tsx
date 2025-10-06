import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { useSearchDoctors } from '@/common/apis/services/search/jahannamaSearch';
import { useGeolocation } from '@/common/hooks/useGeolocation';
import { useMapSearchRouting } from '@/modules/search/hooks/useMapSearchRouting';
import { useDebounce } from 'react-use';
import SearchInput from '@/modules/search/components/mapSearch/SearchInput';
import LocationBanner from '@/modules/search/components/mapSearch/LocationBanner';
import MapComponent from '@/modules/search/components/mapSearch/MapComponent';
import DoctorResultsList from '@/modules/search/components/mapSearch/DoctorResultsList';
import classNames from '@/common/utils/classNames';
import { useResponsive } from '@/common/hooks/useResponsive';

interface MapSearchPageProps {}

const MapSearchPage: React.FC<MapSearchPageProps> = () => {
  // Responsive hooks
  const { isMobile } = useResponsive();
  
  // Mobile-specific state for bottom sheet behavior
  const [showMobileResults, setShowMobileResults] = useState(false);
  const [mobileResultsHeight, setMobileResultsHeight] = useState('40vh');
  
  // Hooks
  const geolocation = useGeolocation({ 
    autoRequest: false, // We'll request manually to avoid continuous loading
    timeout: 10000, // 10 second timeout
    enableHighAccuracy: false, // Use less accurate but faster location
  });
  const { getCurrentParams, updateSearchQuery, updateLocation } = useMapSearchRouting();
  
  // Get initial values from URL
  const urlParams = getCurrentParams();
  
  // State management
  const [searchQuery, setSearchQuery] = useState<string>(urlParams.q || '');
  const [debouncedQuery, setDebouncedQuery] = useState<string>(searchQuery);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    urlParams.lat && urlParams.lng 
      ? [urlParams.lat, urlParams.lng]
      : [35.6892, 51.3890] // Default Tehran
  );
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [locationRequested, setLocationRequested] = useState<boolean>(false);
  const [showDefaultDoctors, setShowDefaultDoctors] = useState<boolean>(true);

  // Debounce search query
  useDebounce(() => {
    setDebouncedQuery(searchQuery);
  }, 500, [searchQuery]);

  // API hooks - Always enable search to show default doctors
  const doctorsQuery = useSearchDoctors({
    query: debouncedQuery || 'پزشک', // Default search to show doctors
    lat: geolocation.position?.lat || urlParams.lat || mapCenter[0],
    lon: geolocation.position?.lng || urlParams.lng || mapCenter[1],
    size: 20,
  }, {
    enabled: showDefaultDoctors || !!debouncedQuery, // Always enabled to show default doctors
  });

  // Auto-request location if not in URL and not already requested
  useEffect(() => {
    if (!urlParams.lat && !urlParams.lng && !locationRequested && !geolocation.permissionAsked) {
      setLocationRequested(true);
      // Request location after a short delay to avoid immediate loading issues
      const timer = setTimeout(() => {
        geolocation.requestLocation();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [urlParams.lat, urlParams.lng, locationRequested, geolocation.permissionAsked, geolocation.requestLocation]);

  // Update map center when geolocation changes
  useEffect(() => {
    if (geolocation.position && !urlParams.lat && !urlParams.lng) {
      const newCenter: [number, number] = [geolocation.position.lat, geolocation.position.lng];
      setMapCenter(newCenter);
      updateLocation(geolocation.position.lat, geolocation.position.lng);
    }
  }, [geolocation.position, urlParams.lat, urlParams.lng, updateLocation]);

  // Update URL when search query changes
  useEffect(() => {
    if (debouncedQuery !== urlParams.q) {
      updateSearchQuery(debouncedQuery);
    }
  }, [debouncedQuery, urlParams.q, updateSearchQuery]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setDebouncedQuery(suggestion);
  }, []);

  // Handle map events - simplified without ref dependency
  const handleMapMove = useCallback((center: [number, number], zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
    // Debounce URL updates to avoid too many updates
    const timeoutId = setTimeout(() => {
      updateLocation(center[0], center[1]);
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [updateLocation]);

  // Handle doctor card click
  const handleDoctorClick = useCallback((doctorId: string) => {
    setSelectedDoctorId(doctorId);
    // On mobile, minimize results to show more map
    if (isMobile) {
      setMobileResultsHeight('25vh');
    }
    // In a real implementation, you'd get doctor coordinates and center map
    // For now, we'll just select the doctor
  }, [isMobile]);

  // Handle marker click
  const handleMarkerClick = useCallback((doctorId: string) => {
    setSelectedDoctorId(doctorId);
    
    if (isMobile) {
      // On mobile, show results bottom sheet when marker is clicked
      setShowMobileResults(true);
      setMobileResultsHeight('60vh');
      
      // Scroll to doctor card in results list after a short delay
      setTimeout(() => {
        const doctorCard = document.getElementById(`doctor-card-${doctorId}`);
        if (doctorCard) {
          doctorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } else {
      // Desktop behavior
      const doctorCard = document.getElementById(`doctor-card-${doctorId}`);
      if (doctorCard) {
        doctorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [isMobile]);

  const doctors = doctorsQuery.data?.entity?.results || [];
  const totalResults = doctorsQuery.data?.entity?.totalHits;
  
  // Auto-show mobile results when we have search results and no results are shown
  useEffect(() => {
    if (isMobile && doctors.length > 0 && !showMobileResults && debouncedQuery) {
      setShowMobileResults(true);
      setMobileResultsHeight('40vh');
    }
  }, [isMobile, doctors.length, showMobileResults, debouncedQuery]);
  
  // Handle booking appointment
  const handleBookAppointment = useCallback((doctor: any) => {
    // Navigate to booking page
    console.log('Book appointment for:', doctor.source.display_name);
  }, []);
  
  // Handle online consultation
  const handleOnlineConsult = useCallback((doctor: any) => {
    // Navigate to consultation page
    console.log('Start consultation with:', doctor.source.display_name);
  }, []);
  
  // Handle retry location with better error handling
  const handleRetryLocation = useCallback(() => {
    setLocationRequested(false);
    geolocation.reset();
    setTimeout(() => {
      geolocation.requestLocation();
    }, 500);
  }, [geolocation]);

  return (
    <LayoutWithHeaderAndFooter>
      <Head>
        <title>جستجوی پزشکان اطراف من روی نقشه - پذیرش24</title>
        <meta name="description" content="پیدا کردن بهترین پزشکان در نزدیکی شما با استفاده از نقشه. جستجوی آسان و سریع پزشکان متخصص." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="flex flex-col h-screen map-search-container" dir="rtl">
        {/* Search Header */}
        <div className="relative z-50 bg-white border-b border-gray-200 shadow-sm">
          <div className="p-4">
            {/* Search Input */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onSuggestionSelect={handleSuggestionSelect}
              isLoading={doctorsQuery.isLoading}
            />

            {/* Location Banner - Show only when location was denied, not when loading */}
            <LocationBanner
              show={!geolocation.position && geolocation.permissionAsked && !geolocation.isLoading && geolocation.hasPermission === false}
              onRetry={handleRetryLocation}
              className="mt-3"
            />
          </div>
        </div>

        {/* Main Content - Responsive Layout */}
        {isMobile ? (
          /* Mobile Layout: Full-screen map with bottom sheet results */
          <div className="flex-1 relative">
            {/* Full Screen Map */}
            <MapComponent
              center={mapCenter}
              zoom={mapZoom}
              doctors={doctors}
              selectedDoctorId={selectedDoctorId}
              userLocation={geolocation.position}
              onMapMove={handleMapMove}
              onMarkerClick={handleMarkerClick}
              className="h-full w-full"
              isMobile={true}
            />

            {/* Floating Results Button */}
            {!showMobileResults && doctors.length > 0 && (
              <button
                onClick={() => {
                  setShowMobileResults(true);
                  setMobileResultsHeight('60vh');
                }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-[1000] bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 space-x-reverse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="font-medium">
                  {totalResults} نتیجه
                </span>
              </button>
            )}

            {/* Mobile Bottom Sheet Results */}
            <div
              className={classNames(
                'absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl transform transition-transform duration-300 z-[1000]',
                showMobileResults ? 'translate-y-0' : 'translate-y-full'
              )}
              style={{ height: mobileResultsHeight }}
            >
              {/* Bottom Sheet Handle */}
              <div className="flex justify-center py-2 border-b border-gray-200">
                <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
              </div>
              
              {/* Bottom Sheet Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  نتایج جستجو
                  {totalResults !== undefined && totalResults > 0 && (
                    <span className="text-sm font-normal text-gray-500 mr-2">
                      ({totalResults.toLocaleString()} نتیجه)
                    </span>
                  )}
                </h2>
                
                <div className="flex items-center space-x-2 space-x-reverse">
                  {/* Resize Buttons */}
                  <button
                    onClick={() => setMobileResultsHeight(mobileResultsHeight === '25vh' ? '60vh' : '25vh')}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                    title={mobileResultsHeight === '25vh' ? 'بزرگ کردن' : 'کوچک کردن'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {mobileResultsHeight === '25vh' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l3-3 3 3m0-8l-3 3-3-3" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 10l-3 3-3-3m0 8l3-3 3-3" />
                      )}
                    </svg>
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowMobileResults(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-150"
                    title="بستن"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Results Content */}
              <div className="flex-1 overflow-hidden">
                <DoctorResultsList
                  doctors={doctors}
                  totalResults={totalResults}
                  selectedDoctorId={selectedDoctorId}
                  isLoading={doctorsQuery.isLoading}
                  searchQuery={debouncedQuery}
                  onDoctorClick={handleDoctorClick}
                  onBookAppointment={handleBookAppointment}
                  onOnlineConsult={handleOnlineConsult}
                  className="h-full"
                  isMobile={true}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout: Side-by-side map and results */
          <div className="flex-1 flex">
            {/* Map Container - Left Side */}
            <div className="flex-1 relative">
              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                doctors={doctors}
                selectedDoctorId={selectedDoctorId}
                userLocation={geolocation.position}
                onMapMove={handleMapMove}
                onMarkerClick={handleMarkerClick}
                className="h-full w-full"
                isMobile={false}
              />
            </div>

            {/* Results List - Right Side */}
            <div className="w-96 bg-white border-l border-gray-200">
              <DoctorResultsList
                doctors={doctors}
                totalResults={totalResults}
                selectedDoctorId={selectedDoctorId}
                isLoading={doctorsQuery.isLoading}
                searchQuery={debouncedQuery}
                onDoctorClick={handleDoctorClick}
                onBookAppointment={handleBookAppointment}
                onOnlineConsult={handleOnlineConsult}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>
    </LayoutWithHeaderAndFooter>
  );
};

export default MapSearchPage;