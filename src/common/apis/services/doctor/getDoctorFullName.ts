import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';

export interface DoctorFullNameResponse {
  name: string;
  family: string;
}

export const getDoctorFullName = async (slug: string): Promise<DoctorFullNameResponse> => {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const url = `https://drprofile.paziresh24.com/api/doctors/${encodedSlug}/fullname`;
    
    const { data } = await axios.get<DoctorFullNameResponse>(url, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
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
        url: `https://drprofile.paziresh24.com/api/docts/${encodeURIComponent(slug)}/fullname`,
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
