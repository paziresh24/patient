import { useRouter } from 'next/router';
import { useCallback } from 'react';

interface MapSearchParams {
  q?: string;
  lat?: number;
  lng?: number;
}

export const useMapSearchRouting = () => {
  const router = useRouter();

  // Update URL with new parameters
  const updateParams = useCallback((newParams: Partial<MapSearchParams>, replace = true) => {
    const currentQuery = { ...router.query };
    
    // Update parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        currentQuery[key] = String(value);
      } else {
        delete currentQuery[key];
      }
    });

    const method = replace ? router.replace : router.push;
    method({
      pathname: router.pathname,
      query: currentQuery,
    }, undefined, { 
      shallow: true,
      scroll: false,
    });
  }, [router]);

  // Get current parameters from URL
  const getCurrentParams = useCallback((): MapSearchParams => {
    const { q, lat, lng } = router.query;
    
    return {
      q: q as string,
      lat: lat ? parseFloat(lat as string) : undefined,
      lng: lng ? parseFloat(lng as string) : undefined,
    };
  }, [router.asPath]); // Use asPath instead of router.query to prevent infinite loops

  // Update search query
  const updateSearchQuery = useCallback((query: string) => {
    updateParams({ q: query });
  }, [updateParams]);

  // Update location
  const updateLocation = useCallback((lat: number, lng: number) => {
    updateParams({ lat, lng });
  }, [updateParams]);

  // Clear all parameters
  const clearParams = useCallback(() => {
    router.replace(router.pathname, undefined, { shallow: true });
  }, [router]);

  // Navigate to search results with filters
  const navigateToSearch = useCallback((searchQuery: string, lat?: number, lng?: number) => {
    const params: MapSearchParams = { q: searchQuery };
    if (lat !== undefined && lng !== undefined) {
      params.lat = lat;
      params.lng = lng;
    }
    updateParams(params, false); // Push instead of replace for navigation
  }, [updateParams]);

  return {
    updateParams,
    getCurrentParams,
    updateSearchQuery,
    updateLocation,
    clearParams,
    navigateToSearch,
  };
};