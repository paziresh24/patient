import { apiGatewayClient } from '@/common/apis/client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelectedCenterStore } from '../store/selectedCenter';
import { collectCenterBookingPlatforms } from '../utils/centerBookingPlatforms';
import { doctorHomeQueryDefaults } from '../utils/doctorHomeQuery';

const CENTERS_URL = '/v1/n8n-nelson/webhook/v1/centers';

export const getDoctorCentersWithOtherPlatforms = async () => {
  const { data } = await apiGatewayClient.get(CENTERS_URL, {
    params: { show_other_platform: true },
  });
  return data;
};

export const useDoctorBookingPlatforms = (enabled = true) => {
  const selectedCenterId = useSelectedCenterStore(s => s.selectedCenterId);
  const query = useQuery(
    ['doctorHome', 'centers', 'show_other_platform'],
    getDoctorCentersWithOtherPlatforms,
    {
      enabled,
      ...doctorHomeQueryDefaults,
      retry: 1,
    },
  );

  const platforms = useMemo(
    () => collectCenterBookingPlatforms(query.data, selectedCenterId),
    [query.data, selectedCenterId],
  );

  return {
    platforms,
    isLoading: query.isLoading && query.data == null,
  };
};
