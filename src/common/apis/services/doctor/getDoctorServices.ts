import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';

export interface DoctorServiceResponse {
  id: string;
  can_booking: boolean;
  can_request: boolean;
  duration: string;
  request_description: string | null;
  terms_and_conditions: string | null;
  service: {
    id: string;
    title: string;
    price: number;
    description: string | null;
    service_type_id: number;
    server_id: number;
  };
}

export const getDoctorServices = async (slug: string, centerId: string): Promise<DoctorServiceResponse[]> => {
  const url = `https://drprofile.paziresh24.com/api/doctors/${slug}/centers/${centerId}/services`;
  try {
    const { data } = await axios.get<DoctorServiceResponse[]>(url, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Send success event to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_services_api_success',
      type: 'api_success',
      event: {
        slug: slug,
        center_id: centerId,
        url: url,
        response_data: data,
        services_count: data.length,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching doctor services:', error);

    // Send error to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_services_api_error',
      type: 'api_error',
      event: {
        slug: slug,
        center_id: centerId,
        url: `https://drprofile.paziresh24.com/api/doctors/${slug}/centers/${centerId}/services`,
        error_message: error instanceof Error ? error.message : String(error),
        error_status: error instanceof Error && 'response' in error ? (error as any).response?.status : null,
        error_data: error instanceof Error && 'response' in error ? (error as any).response?.data : null,
        timestamp: new Date().toISOString(),
      },
    });

    // Return fallback data in case of error
    return [];
  }
};
