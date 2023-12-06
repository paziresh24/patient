import axios from 'axios';
import { useEasyBook } from '../apis/easyapp-book';

export const useBooking = () => {
  const book = useEasyBook();
  const handleBook = async (
    {
      user,
      easybookProviderId,
      easybookServiceId,
      slug,
      providerId,
      userId,
      time,
    }: {
      user: any;
      easybookProviderId: string;
      easybookServiceId: string;
      slug: string;
      providerId: string;
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
        easybook: {
          provider_id: easybookProviderId,
          service_id: easybookServiceId,
        },
        provider: {
          id: providerId,
          user_id: userId,
          slug,
        },
        user: {
          id: user.id,
          first_name: user.name,
          last_name: user.family,
          phone: user.cell,
        },
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
