import axios from 'axios';
import { splunkInstance } from '@/common/services/splunk';
import { drProfileClient } from '../../client';

export interface DoctorExpertiseResponse {
  id: string;
  alias_title: string;
  graduation_date: string | null;
  expertise: {
    id: number;
    name: string;
    slug: string;
  };
  degree: {
    id: number;
    name: string;
  };
  groups: Array<{
    id: number;
    name: string;
    en_slug: string;
  }>;
}

export const getDoctorExpertise = async (slug: string): Promise<DoctorExpertiseResponse[]> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}/expertise`;
  try {
    const { data } = await drProfileClient.get<DoctorExpertiseResponse[]>(url, {
      timeout: 5000,
    });

    // Send success event to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_expertise_api_success',
      type: 'api_success',
      event: {
        slug: slug,
        url: url,
        response_data: data,
        expertise_count: data.length,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching doctor expertise:', error);

    // Send error to Splunk
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_expertise_api_error',
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
    return [];
  }
};
