import { useBook } from '@/common/apis/services/booking/book';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useWebView from '@/common/hooks/useWebView';

export const useBooking = () => {
  const book = useBook();
  const isWebView = useWebView();

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
      is_webview: isWebView ? 1 : 0,
      first_name: user.name,
      last_name: user.family,
      gender: user.gender,
      cell: user.cell,
      selected_user_id: user.id,
      is_foreigner: user.is_foreigner,
      ...(user.massengerType && { online_channel: user.massengerType }),
      ...(user.national_code && { national_code: user.national_code }),
      ...(user.insurance_id && { insurance_id: user.insurance_id }),
      ...(user.insurance_referral_code && { insurance_referral_code: user.insurance_referral_code }),
      ...(user.insurance_number && { insurance_number: user.insurance_number }),
      ...(selectedSymptoms.length && { symptomes: selectedSymptoms.toString() }),
    });

    if (data.status === ClinicStatus.SUCCESS && onSuccess) return onSuccess(data);
    if (data.status === ClinicStatus.EXPIRE_TIME_SLOT && onExpire) return onExpire(data);
    return onError && onError(data);
  };
  return { handleBook, isLoading: book.isLoading };
};

export default useBooking;
