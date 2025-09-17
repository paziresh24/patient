import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';
import { drProfileClient } from '../../client';

export interface DoctorFullNameResponse {
  name: string;
  family: string;
}

export const getDoctorFullName = async (slug: string): Promise<DoctorFullNameResponse> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}/fullname`;
  try {
    const { data } = await drProfileClient.get<DoctorFullNameResponse>(url, {
      timeout: 5000,
      headers: {
        Accept: 'application/json',
      },
    });

    // Send success event to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_fullname_api_success',
      type: 'api_success',
      event: {
        slug: slug,
        url: url,
        response_data: data,
        full_name: `${data.name} ${data.family}`,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching doctor full name:', error);

    // Send error to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_fullname_api_error',
      type: 'api_error',
      event: {
        slug: slug,
        url: url,
        error_message: error instanceof Error ? error.message : String(error),
        error_status: error instanceof Error && 'response' in error ? (error as any).response?.status : null,
        error_data: error instanceof Error && 'response' in error ? (error as any).response?.data : null,
        timestamp: new Date().toISOString(),
      },
    });

    // Return fallback data in case of error
    return {
      name: '',
      family: '',
    };
  }
};
