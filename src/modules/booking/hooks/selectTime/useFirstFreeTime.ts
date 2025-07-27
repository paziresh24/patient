import { useGetFreeTurn } from '@/common/apis/services/booking/getFreeTurn';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useApplication from '@/common/hooks/useApplication';
import useWebView from '@/common/hooks/useWebView';
import axios from 'axios';
import pick from 'lodash/pick';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UseFirstFreeTime {
  centerId: string;
  serviceId: string;
  userCenterId: string;
  enabled?: boolean;
  onError?: (errorText: string) => void;
  onEvent?: (data: string) => void;
}

type FirstFreeTime = {
  from?: number;
  to?: number;
  full_date?: string;
  timeId?: string;
  message?: string;
  status?: number;
};

export const useFirstFreeTime = ({ centerId, serviceId, userCenterId, enabled = true, onError, onEvent }: UseFirstFreeTime) => {
  const getFreeTurn = useGetFreeTurn();
  const isWebView = useWebView();
  const isApplication = useApplication();
  const [data, setData] = useState<FirstFreeTime>({});

  useEffect(() => {
    enabled && getFirstFreeTime();
  }, [enabled]);

  const getFirstFreeTime = async (): Promise<FirstFreeTime> => {
    try {
      const { data, meta } = (await getFreeTurn.mutateAsync({
        center_id: centerId,
        service_id: serviceId,
        user_center_id: userCenterId,
        type: isWebView || isApplication ? 'app' : 'web',
      })) as any;

      onEvent && onEvent({ ...data, meta });
      const { result, status } = data;

      if (status === ClinicStatus.SUCCESS) {
        const data = pick(result, ['from', 'to', 'full_date', 'request_code']);
        const dataFormatted = { ...data, timeId: data.request_code, status: status };
        setData(dataFormatted);
        return dataFormatted;
      }
      onError && onError(data.message);
      setData({});
      return {
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status == 429) {
          const message = `متأسفانه در دقایق گذشته، درخواست های زیادی ارسال کرده‌اید و به سقف مجاز رسیده‌اید.
لطفاً چند دقیقه صبر کنید و دوباره تلاش کنید.`;
          onError && onError(message);
          return {
            message: message,
          };
        }
      }
      return {
        message: 'خطایی پیش آمده است.',
      };
    }
  };

  return {
    timeText: data?.full_date,
    timeStamp: data?.from,
    timeId: data?.timeId,
    loading: getFreeTurn.isLoading,
    isSuccess: getFreeTurn.isSuccess,
    getFirstFreeTime: getFirstFreeTime,
  };
};

export default useFirstFreeTime;
