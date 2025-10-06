import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { DoctorSearchResult } from '@/common/apis/services/search/jahannamaSearch';
import 'leaflet/dist/leaflet.css';

// Dynamic imports to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }) as any;
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }) as any;
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }) as any;
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }) as any;

interface MapComponentProps {
  center: [number, number];
  zoom: number;
  doctors: DoctorSearchResult[];
  selectedDoctorId?: string | null;
  userLocation?: { lat: number; lng: number } | null;
  onMapMove?: (center: [number, number], zoom: number) => void;
  onMarkerClick?: (doctorId: string) => void;
  className?: string;
}

// Simple MapEvents component using the standard approach
const MapEventsHandler = ({ onMapMove }: { onMapMove?: (center: [number, number], zoom: number) => void }) => {
  // This will be dynamically imported and used only client-side
  const [mapEvents, setMapEvents] = useState<any>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-leaflet').then(({ useMapEvents }) => {
        setMapEvents(() => useMapEvents);
      });
    }
  }, []);

  if (!mapEvents) return null;

  return React.createElement(() => {
    const map = mapEvents({
      moveend: () => {
        if (onMapMove) {
          const center = map.getCenter();
          const zoom = map.getZoom();
          onMapMove([center.lat, center.lng], zoom);
        }
      },
      zoomend: () => {
        if (onMapMove) {
          const center = map.getCenter();
          const zoom = map.getZoom();
          onMapMove([center.lat, center.lng], zoom);
        }
      },
    });
    return null;
  });
};

// Custom marker icon
const createCustomIcon = (isSelected: boolean = false) => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-8 h-8 ${isSelected ? 'bg-blue-600' : 'bg-red-500'} rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        ${isSelected ? '<div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45"></div>' : ''}
      </div>
    `,
    className: 'custom-doctor-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
};

// User location marker
const createUserLocationIcon = () => {
  if (typeof window === 'undefined') return null;
  
  const L = require('leaflet');
  
  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        <div class="absolute inset-0 w-6 h-6 bg-blue-300 rounded-full animate-ping opacity-75"></div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  doctors,
  selectedDoctorId,
  userLocation,
  onMapMove,
  onMarkerClick,
  className = "",
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">در حال بارگذاری نقشه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ direction: 'ltr' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map Events Handler */}
        {isClient && <MapEventsHandler onMapMove={onMapMove} />}
        
        {/* Doctor Markers */}
        {doctors.map((doctor, index) => {
          // For demo purposes, generate positions around the map center
          // In a real implementation, you'd get lat/lng from the doctor data
          const offsetLat = (Math.random() - 0.5) * 0.02; // ~1-2km radius
          const offsetLng = (Math.random() - 0.5) * 0.02;
          const position: [number, number] = [
            center[0] + offsetLat,
            center[1] + offsetLng
          ];

          const isSelected = selectedDoctorId === doctor.documentId;
          const customIcon = createCustomIcon(isSelected);

          return (
            <Marker
              key={`${doctor.documentId}-${index}`}
              position={position}
              icon={customIcon}
              eventHandlers={{
                click: () => onMarkerClick?.(doctor.documentId),
              }}
            >
              <Popup closeButton={false} className="custom-popup">
                <div className="text-right min-w-[200px]" dir="rtl">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <img
                      src={doctor.source.image || '/default-doctor.png'}
                      alt={doctor.source.display_name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {doctor.source.prefix} {doctor.source.display_name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        {doctor.source.expertise.slice(0, 2).join('، ')}
                        {doctor.source.expertise.length > 2 && '...'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-xs text-gray-700 mr-1">
                            {doctor.source.star}
                          </span>
                        </div>
                        <span className="text-xs text-green-600 font-medium">
                          {doctor.source.satisfaction}% رضایت
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User Location Marker */}
        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]}
            icon={createUserLocationIcon()}
          >
            <Popup closeButton={false}>
              <div className="text-right" dir="rtl">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-blue-600 font-semibold text-sm">موقعیت شما</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-2">
        {/* Locate Me Button */}
        {userLocation && (
          <button
            onClick={() => {
              // We'll handle this through a different approach since we don't have map ref
              window.location.href = `#lat=${userLocation.lat}&lng=${userLocation.lng}&zoom=15`;
            }}
            className="w-10 h-10 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center"
            title="موقعیت من"
          >
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Custom CSS for markers */}
      <style jsx global>{`
        .custom-doctor-marker {
          background: none !important;
          border: none !important;
        }
        
        .user-location-marker {
          background: none !important;
          border: none !important;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          direction: rtl;
          text-align: right;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 8px;
        }
      `}</style>
    </div>
  );
};

export default MapComponent;