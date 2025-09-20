import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';
import { drProfileClient } from '../../client';

export interface DoctorImageResponse {
  image: string;
}

export const getDoctorImage = async (slug: string): Promise<DoctorImageResponse> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}/image`;
  try {
    const { data } = await drProfileClient.get<DoctorImageResponse>(url, {
      timeout: 5000,
    });

    // Send success event to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_image_api_success',
      type: 'api_success',
      event: {
        slug: slug,
        url: url,
        response_data: data,
        image_url: data.image,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching doctor image:', error);

    // Send error to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_image_api_error',
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
      image: '',
    };
  }
};
