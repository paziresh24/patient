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

export interface DoctorSlugErrorResponse {
  error: string;
}

export type DoctorSlugResponse = DoctorSlugValidationResponse | DoctorSlugRedirectResponse | DoctorSlugErrorResponse;

export interface DoctorSlug500ErrorResponse {
  error: string;
  statusCode: 500;
}

export const validateDoctorSlug = async (slug: string): Promise<DoctorSlugResponse> => {
  const encodedSlug = encodeURIComponent(slug);
  const url = `/api/doctors/${encodedSlug}`;

  // Send API request start event to Splunk
  splunkInstance('doctor-profile').sendEvent({
    group: 'doctor_slug_api_request',
    type: 'api_request_start',
    event: {
      original_slug: slug,
      encoded_slug: encodedSlug,
      url: url,
      full_url: `https://drprofile.paziresh24.com${url}`,
      timestamp: new Date().toISOString(),
    },
  });

  try {
    const { data } = await drProfileClient.get<DoctorSlugResponse>(url, {
      timeout: 5000,
    });

    // Check if response contains error information (like "Slug not found")
    if ('error' in data) {
      // Send error event to Splunk for slug not found
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_slug_not_found',
        type: 'slug_not_found',
        event: {
          original_slug: slug,
          error_message: data.error,
          url: url,
          timestamp: new Date().toISOString(),
        },
      });

      return data;
    }

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

    // Check if it's a network/timeout error (should be retried)
    const axiosError = error as any;
    const isNetworkError =
      !axiosError.response || // No response (network error)
      axiosError.code === 'ECONNABORTED' || // Timeout
      axiosError.code === 'ETIMEDOUT' || // Timeout
      axiosError.message?.includes('timeout') || // Timeout message
      axiosError.message?.includes('Network Error'); // Network error

    // If it's a network/timeout error, throw it so retry mechanism can handle it
    if (isNetworkError) {
      // Send error to Splunk for network errors
      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_slug_validation_error',
        type: 'network_error',
        event: {
          slug: slug,
          url: url,
          error_message: error instanceof Error ? error.message : String(error),
          error_code: axiosError.code,
          timestamp: new Date().toISOString(),
        },
      });

      // Throw the error so retry mechanism can catch it
      throw error;
    }

    // For other errors (like 500, 502, etc.), send to Splunk and return 404 response
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_slug_validation_error',
      type: 'api_error',
      event: {
        slug: slug,
        url: url,
        error_message: error instanceof Error ? error.message : String(error),
        error_status: axiosError.response?.status || null,
        error_data: axiosError.response?.data || null,
        timestamp: new Date().toISOString(),
      },
    });

    // Send 404 event to Splunk for fallback errors
    splunkInstance('doctor-profile').sendEvent({
      group: 'doctor_profile_404',
      type: 'page_not_found_fallback',
      event: {
        original_slug: slug,
        error_message: 'Slug not found (fallback)',
        url: url,
        error_details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
    });

    // Return error response for other errors to show 404 page
    return {
      error: 'Slug not found',
    };
  }
};
