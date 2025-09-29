import { splunkInstance } from '@/common/services/splunk';
import { drProfileClient } from '../../client';

export interface DoctorSlugValidationResponse {
  id: number;
  slug: string;
  owner_id: string;
  server_id: number;
  type: string;
  user_id: number;
}

export interface DoctorSlugRedirectResponse {
  redirect: {
    route: string;
    statusCode: number;
  };
}

export type DoctorSlugResponse = DoctorSlugValidationResponse | DoctorSlugRedirectResponse;

export const validateDoctorSlug = async (slug: string): Promise<DoctorSlugResponse> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}`;
  
  try {
    const { data } = await drProfileClient.get<DoctorSlugResponse>(url, {
      timeout: 5000,
    });

    // Check if response contains redirect information
    if ('redirect' in data) {
      // Send redirect event to Splunk
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_slug_redirect',
        type: 'slug_redirect',
        event: {
          original_slug: slug,
          redirect_route: data.redirect.route,
          redirect_status_code: data.redirect.statusCode,
          url: url,
          timestamp: new Date().toISOString(),
        },
      });

      return data;
    }

    // Send success event to Splunk for valid slug
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_slug_validation_success',
      type: 'api_success',
      event: {
        slug: slug,
        doctor_id: data.id,
        owner_id: data.owner_id,
        server_id: data.server_id,
        user_id: data.user_id,
        url: url,
        response_data: data,
        timestamp: new Date().toISOString(),
      },
    });

    return data;
  } catch (error) {
    console.error('Error validating doctor slug:', error);

    // Check if it's a 400 error and has redirect data in response
    if (error instanceof Error && 'response' in error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;
      const responseData = axiosError.response?.data;

      // If it's a 400 error and response contains redirect information
      if (status === 400 && responseData && 'redirect' in responseData) {
        // Send redirect event to Splunk for 400 error
        splunkInstance('doctor-profile').sendEvent({
          group: 'doctor_slug_redirect_400',
          type: 'slug_redirect_400',
          event: {
            original_slug: slug,
            redirect_route: responseData.redirect.route,
            redirect_status_code: responseData.redirect.statusCode,
            url: url,
            error_status: status,
            timestamp: new Date().toISOString(),
          },
        });

        return responseData as DoctorSlugRedirectResponse;
      }
    }

    // Send error to Splunk for other errors
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_slug_validation_error',
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

    // Return a fallback redirect response for other errors
    return {
      redirect: {
        route: `/dr/${slug}/`,
        statusCode: 301,
      },
    };
  }
};
