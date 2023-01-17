import { useGetFreeDays } from '@/common/apis/services/booking/getFreeDays';
import { useGetFreeTurns } from '@/common/apis/services/booking/getFreeTurns';
import { ClinicStatus } from '@/common/constants/status/clinicStatus';

interface UseOtherTimes {
  centerId: string;
  serviceId: string;
  userCenterId: string;
  onEvent: (data: string) => void;
}

export const useOtherTimes = ({ centerId, serviceId, userCenterId, onEvent }: UseOtherTimes) => {
  const getFreeDays = useGetFreeDays();
  const getFreeTimes = useGetFreeTurns();

  const getDays = async () => {
    const { data } = await getFreeDays.mutateAsync({
      center_id: centerId,
      service_id: serviceId,
      user_center_id: userCenterId,
      return_free_turns: false,
      return_type: 'calendar',
    });
    onEvent(data);
    const {
      calendar: { turns },
    } = data;
    return turns;
  };

  const getTimeByDay = async (day: number) => {
    const { data } = await getFreeTimes.mutateAsync({
      center_id: centerId,
      service_id: serviceId,
      user_center_id: userCenterId,
      date: day.toString(),
    });

    const { result, status } = data;

    if (status === ClinicStatus.SUCCESS) {
      return result;
    }
    return [];
  };

  return { days: getFreeDays.data?.data?.calendar?.turns ?? [], onSelectDay: (dayId: number) => getTimeByDay(dayId), getDays };
};

export default useOtherTimes;
