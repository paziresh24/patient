import axios from 'axios';
import { useAppointments } from '../apis/appointments';

export const useBooking = () => {
  const appointments = useAppointments();
  const handleBook = async (
    {
      user,
      membershipId,
      serviceId,
      time,
    }: {
      user: any;
      membershipId: string;
      serviceId: string;
      userId?: string;
      time: string;
    },
    {
      onSuccess,
      onExpire,
      onError,
    }: {
      onSuccess?: (data: any) => void;
      onExpire?: (data: any) => void;
      onError?: (data: any) => void;
    },
  ) => {
    try {
      const { data } = await appointments.mutateAsync({
        membership_id: membershipId,
        service_id: serviceId,
        time,
        ...(user.isSubUser && { sub_user: Number(user.id) }),
      });
      return onSuccess && onSuccess({ ...data, time: data.start_time });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error);

        if (error.response?.status === 400) {
          return onExpire && onExpire(error.response?.data);
        }
        return onError && onError(error.response?.data);
      }
    }
  };
  return { handleBook, isLoading: appointments.isLoading || appointments.isLoading };
};

export default useBooking;
