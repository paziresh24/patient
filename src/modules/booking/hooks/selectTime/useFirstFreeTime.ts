import { useGetFreeTurn } from '@/common/apis/services/booking/getFreeTurn';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';
import useWebView from '@/common/hooks/useWebView';
import pick from 'lodash/pick';
import { useEffect, useState } from 'react';

interface UseFirstFreeTime {
  centerId: string;
  serviceId: string;
  userCenterId: string;
  enabled?: boolean;
  onError: (errorText: string) => void;
  onEvent: (data: string) => void;
}

type FirstFreeTime = {
  from?: number;
  to?: number;
  full_date?: string;
  timeId?: string;
};

export const useFirstFreeTime = ({ centerId, serviceId, userCenterId, enabled = true, onError, onEvent }: UseFirstFreeTime) => {
  const getFreeTurn = useGetFreeTurn();
  const isWebView = useWebView();
  const [data, setData] = useState<FirstFreeTime>({});

  useEffect(() => {
    enabled && getFirstFreeTime();
  }, [enabled]);

  const getFirstFreeTime = async (): Promise<FirstFreeTime> => {
    const { data } = await getFreeTurn.mutateAsync({
      center_id: centerId,
      service_id: serviceId,
      user_center_id: userCenterId,
      type: isWebView ? 'app' : 'web',
    });

    onEvent(data);
    const { result, status } = data;

    if (status === ClinicStatus.SUCCESS) {
      const data = pick(result, ['from', 'to', 'full_date', 'request_code']);
      const dataFormatted = { ...data, timeId: data.request_code };
      setData(dataFormatted);
      return dataFormatted;
    }
    onError(data.message);
    setData({});
    return {};
  };

  return {
    timeText: data?.full_date,
    timeId: data?.timeId,
    loading: getFreeTurn.isLoading || getFreeTurn.isIdle,
    isSuccess: getFreeTurn.isSuccess,
    getFirstFreeTime: getFirstFreeTime,
  };
};

export default useFirstFreeTime;
