import axios from 'axios';
import { useEasyBook } from '../apis/easyapp-book';

export const useBooking = () => {
  const book = useEasyBook();
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
      const { data } = await book.mutateAsync({
        provider_id: membershipId,
        service_id: serviceId,
        first_name: user.name,
        last_name: user.family,
        phone: user.cell,
        time,
      });
      return onSuccess && onSuccess({ ...data });
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
  return { handleBook, isLoading: book.isLoading };
};

export default useBooking;
