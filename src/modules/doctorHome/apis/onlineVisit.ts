import { apiGatewayClient } from '@/common/apis/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface UserCenterService {
  user_center_id: string;
  active_booking?: boolean;
}

export interface UserCenterServicesResponse {
  data?: UserCenterService[];
}

export const getUserCenterServices = async (params: { user_center_id: string; server_id: number }) => {
  const { data } = await apiGatewayClient.get<UserCenterServicesResponse>('/v1/user-center-services', { params });
  return data;
};

export const toggleOnlineVisitBooking = async (payload: { user_center_id: string; can_booking: '0' | '1' }) => {
  const { data } = await apiGatewayClient.patch('/v1/canbookingon&off', payload);
  return data;
};

export const useOnlineVisitServices = (userCenterId?: string) =>
  useQuery(
    ['doctorHome', 'onlineVisitServices', userCenterId],
    () => getUserCenterServices({ user_center_id: userCenterId!, server_id: 1 }),
    {
      enabled: !!userCenterId,
      staleTime: 60 * 1000,
    },
  );

export const useToggleOnlineVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleOnlineVisitBooking,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['doctorHome', 'onlineVisitServices', variables.user_center_id]);
    },
  });
};
