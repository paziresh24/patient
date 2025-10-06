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

interface MapSearchPageProps {}

const MapSearchPage: React.FC<MapSearchPageProps> = () => {
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
    // In a real implementation, you'd get doctor coordinates and center map
    // For now, we'll just select the doctor
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((doctorId: string) => {
    setSelectedDoctorId(doctorId);
    // Scroll to doctor card in results list
    const doctorCard = document.getElementById(`doctor-card-${doctorId}`);
    if (doctorCard) {
      doctorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const doctors = doctorsQuery.data?.entity?.results || [];
  const totalResults = doctorsQuery.data?.entity?.totalHits;
  
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

      <div className="flex flex-col h-screen" dir="rtl">
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

        {/* Main Content */}
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
      </div>
    </LayoutWithHeaderAndFooter>
  );
};

export default MapSearchPage;