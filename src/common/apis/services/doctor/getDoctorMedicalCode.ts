import { drProfileClient } from '../../client';
import { normalizeDoctorMedicalCodePayload } from './normalizeDoctorMedicalCodePayload';

export interface DoctorMedicalCodeResponse {
  medical_code: string;
}

export type GetDoctorMedicalCodeParams = {
  id?: string | number | null;
  server_id?: string | number | null;
};

export { normalizeDoctorMedicalCodePayload } from './normalizeDoctorMedicalCodePayload';

export const getDoctorMedicalCode = async (
  slug: string,
  params?: GetDoctorMedicalCodeParams,
): Promise<DoctorMedicalCodeResponse> => {
  const url = `/api/doctors/${encodeURIComponent(slug)}/medical-code`;
  const query: Record<string, string | number> = {};
  if (params?.id != null && String(params.id).trim()) {
    query.id = params.id;
  }
  if (params?.server_id != null && String(params.server_id).trim()) {
    query.server_id = params.server_id;
  }

  try {
    const { data } = await drProfileClient.get(url, {
      timeout: 5000,
      params: Object.keys(query).length ? query : undefined,
    });
    return { medical_code: normalizeDoctorMedicalCodePayload(data) };
  } catch (error) {
    console.error('Error fetching doctor medical code:', error);
    return { medical_code: '' };
  }
};
