import { apiGatewayClient } from '@/common/apis/client';

export type AppointmentDoctorResponse = {
  user_id?: number | string;
};

export const getAppointmentDoctor = async (bookId: string): Promise<AppointmentDoctorResponse> => {
  const { data } = await apiGatewayClient.get<AppointmentDoctorResponse>(
    `/core-booking/v1/appointments/${encodeURIComponent(bookId)}/doctor`,
  );
  return data;
};
