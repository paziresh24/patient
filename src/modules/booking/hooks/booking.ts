import { useBook } from '@/common/apis/services/booking/book';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useApplication from '@/common/hooks/useApplication';
import useWebView from '@/common/hooks/useWebView';

export const useBooking = () => {
  const book = useBook();
  const isWebView = useWebView();
  const isApplication = useApplication();

  const handleBook = async (
    {
      user,
      center,
      timeId,
      selectedSymptoms = [],
    }: {
      user: any;
      center: {
        id: string;
        server_id: string;
        user_center_id: string;
      };
      timeId: string;
      selectedSymptoms?: string[];
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
    const { data } = await book.mutateAsync({
      request_code: timeId,
      center_id: center.id,
      server_id: center.server_id,
      user_center_id: center.user_center_id,
      is_webview: isWebView || isApplication ? 1 : 0,
      first_name: user.name,
      last_name: user.family,
      ...(user.father_name && { father_name: user.father_name }),
      ...(user.birth_date && { birth_date: user.birth_date }),
      ...(user.gender && { gender: user.gender }),
      cell: user.cell ? `0${user.cell}` : user.cell,
      selected_user_id: user.id,
      is_foreigner: user.is_foreigner,
      ...(user.messengerType && { online_channel: user.messengerType }),
      ...(user.national_code && { national_code: user.national_code }),
      ...(user.insurance_id && { insurance_id: user.insurance_id }),
      ...(user.insurance_number && { insurance_number: user.insurance_number }),
      ...(selectedSymptoms.length && { symptomes: selectedSymptoms.toString() }),
      ...(!user.cell && { cell_country_prefix: 1 }),
    });

    if (data.status === ClinicStatus.SUCCESS && onSuccess) return onSuccess(data);
    if (data.status === ClinicStatus.EXPIRE_TIME_SLOT && onExpire) return onExpire(data);
    return onError && onError(data);
  };
  return { handleBook, isLoading: book.isLoading };
};

export default useBooking;
