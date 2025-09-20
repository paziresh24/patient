import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';

export interface DoctorImageResponse {
  image: string;
}

export const getDoctorImage = async (slug: string): Promise<DoctorImageResponse> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `https://drprofile.paziresh24.com/api/doctors/${encodedSlug}/image`;

    const { data } = await axios.get<DoctorImageResponse>(url, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
      },
    });

    // Send success event to Splunk
    try {
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_image_api_success',
        type: 'api_success',
        event: {
          event_group: 'doctor_image_api_success',
          event_type: 'api_success',
          slug: slug,
          url: url,
          response_data: data,
          image_url: data.image,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (splunkError) {
      console.error('❌ Failed to send Splunk success event:', splunkError);
    }

    return data;
  } catch (error) {
    console.error('Error fetching doctor image:', error);

    // Send error to Splunk
    try {
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_image_api_error',
        type: 'api_error',
        event: {
          event_group: 'doctor_image_api_error',
          event_type: 'api_error',
          slug: slug,
          url: `https://drprofile.paziresh24.com/api/doctors/${encodeURIComponent(slug)}/image`,
          error_message: error instanceof Error ? error.message : String(error),
          error_status: error instanceof Error && 'response' in error ? (error as any).response?.status : null,
          error_data: error instanceof Error && 'response' in error ? (error as any).response?.data : null,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (splunkError) {
      console.error('❌ Failed to send Splunk error event:', splunkError);
    }

    // Return fallback data in case of error
    return {
      image: '',
    };
  }
};
