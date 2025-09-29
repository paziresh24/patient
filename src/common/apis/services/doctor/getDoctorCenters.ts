import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';
import { drProfileClient } from '../../client';

export interface DoctorCentersResponse {
  id: string;
  name: string;
  display_number: string[];
  tell: string[];
  address: string;
  type_id: number;
  status: number;
  server_id: number;
  city: {
    id: number;
    name: string;
    slug: string;
    province: {
      id: number;
      name: string;
      slug: string;
    };
  };
  location: {
    lat: number;
    lon: number;
  };
}

export const getDoctorCenters = async (slug: string): Promise<DoctorCentersResponse[]> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}/centers`;
  try {
    const { data } = await drProfileClient.get<DoctorCentersResponse[]>(url, {
      timeout: 5000,
    });

    // Send success event to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_centers_api_success',
      type: 'api_success',
      event: {
        slug: slug,
        url: url,
        response_data: data,
        centers_count: data.length,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching doctor centers:', error);

    // Send error to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_centers_api_error',
      type: 'api_error',
      event: {
        slug: slug,
        url: `https://drprofile.paziresh24.com/api/doctors/${encodeURIComponent(slug)}/centers`,
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
