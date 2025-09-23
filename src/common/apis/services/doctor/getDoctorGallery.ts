import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';

export interface DoctorGalleryResponse {
  id: string;
  title: string | null;
  description: string | null;
  image: string;
}

export const getDoctorGallery = async (centerId: string): Promise<DoctorGalleryResponse[]> => {
  const url = `https://drprofile.paziresh24.com/api/centers/${centerId}/gallery`;
  try {
    const { data } = await axios.get<DoctorGalleryResponse[]>(url, {
      timeout: 5000,
    });

    // Send success event to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_gallery_api_success',
      type: 'api_success',
      event: {
        center_id: centerId,
        url: url,
        response_data: data,
        gallery_count: data.length,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching doctor gallery:', error);

    // Send error to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_gallery_api_error',
      type: 'api_error',
      event: {
        center_id: centerId,
        url: `https://drprofile.paziresh24.com/api/centers/${centerId}/gallery`,
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
