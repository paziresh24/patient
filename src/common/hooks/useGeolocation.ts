import { useState, useEffect, useCallback } from 'react';

interface GeolocationState {
  position: { lat: number; lng: number } | null;
  error: string | null;
  isLoading: boolean;
  hasPermission: boolean | null;
  permissionAsked: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  autoRequest?: boolean;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    autoRequest = true,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    isLoading: false,
    hasPermission: null,
    permissionAsked: false,
  });

  // Check if geolocation is supported
  const isSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

  // Request location permission and get position
  const requestLocation = useCallback(async () => {
    if (!isSupported) {
      setState(prev => ({
        ...prev,
        error: 'Geolocation is not supported by this browser',
        hasPermission: false,
        permissionAsked: true,
        isLoading: false,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      permissionAsked: true,
    }));

    // Check permissions API if available
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'denied') {
          setState(prev => ({
            ...prev,
            error: 'Location access denied',
            hasPermission: false,
            isLoading: false,
          }));
          return;
        }
      } catch (permissionError) {
        console.warn('Permission API not available or failed:', permissionError);
      }
    }

    // Get current position with better error handling
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
          isLoading: false,
          hasPermission: true,
        }));
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        let hasPermission: boolean | null = null;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            hasPermission = false;
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            hasPermission = true; // Permission was granted but location unavailable
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            hasPermission = true; // Permission was granted but timed out
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location';
            hasPermission = null;
            break;
        }

        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
          hasPermission,
        }));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [isSupported, enableHighAccuracy, timeout, maximumAge]);

  // Watch position changes
  const watchPosition = useCallback(() => {
    if (!isSupported || !state.hasPermission) {
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState(prev => ({
          ...prev,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        }));
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: `Watch position error: ${error.message}`,
        }));
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isSupported, state.hasPermission, enableHighAccuracy, timeout, maximumAge]);

  // Auto-request location on mount if enabled - with better error handling
  useEffect(() => {
    if (autoRequest && !state.permissionAsked) {
      // Add a small delay to avoid immediate errors
      const timer = setTimeout(() => {
        requestLocation();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoRequest, requestLocation, state.permissionAsked]);

  // Reset state
  const reset = useCallback(() => {
    setState({
      position: null,
      error: null,
      isLoading: false,
      hasPermission: null,
      permissionAsked: false,
    });
  }, []);

  return {
    ...state,
    isSupported,
    requestLocation,
    watchPosition,
    reset,
  };
};