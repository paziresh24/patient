import { splunkInstance } from '@/common/services/splunk';
import { drProfileClient } from '../../client';
import { normalizeDoctorBiographyPayload } from './normalizeDoctorBiographyPayload';

export interface DoctorBiographyResponse {
  biography: string;
}

export { normalizeDoctorBiographyPayload } from './normalizeDoctorBiographyPayload';

const BIOGRAPHY_TIMEOUT_MS = 8_000;
const BIOGRAPHY_MAX_ATTEMPTS = 2;

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

const fetchDoctorBiographyOnce = async (slug: string): Promise<string> => {
  const url = `/api/doctors/${encodeURIComponent(slug)}/biography`;
  const { data } = await drProfileClient.get(url, {
    timeout: BIOGRAPHY_TIMEOUT_MS,
  });
  return normalizeDoctorBiographyPayload(data);
};

/**
 * Loads doctor biography from drprofile.
 * Retries once on transport/5xx failures so SSR does not silently drop a valid bio
 * when the parallel profile fan-out hits a transient error.
 */
export const getDoctorBiography = async (slug: string): Promise<DoctorBiographyResponse> => {
  const url = `/api/doctors/${encodeURIComponent(slug)}/biography`;
  let lastError: unknown;

  for (let attempt = 1; attempt <= BIOGRAPHY_MAX_ATTEMPTS; attempt++) {
    try {
      const biography = await fetchDoctorBiographyOnce(slug);

      splunkInstance('doctor-profile').sendEvent({
        group: 'doctor_bio_api_success',
        type: 'api_success',
        event: {
          slug,
          url,
          biography_length: biography.length,
          attempt,
          timestamp: new Date().toISOString(),
        },
      });

      return { biography };
    } catch (error) {
      lastError = error;
      console.error(`Error fetching doctor biography (attempt ${attempt}/${BIOGRAPHY_MAX_ATTEMPTS}):`, error);

      if (attempt < BIOGRAPHY_MAX_ATTEMPTS) {
        await sleep(250 * attempt);
      }
    }
  }

  splunkInstance('doctor-profile').sendEvent({
    group: 'doctor_bio_api_error',
    type: 'api_error',
    event: {
      slug,
      url,
      error_message: lastError instanceof Error ? lastError.message : String(lastError),
      error_status:
        lastError instanceof Error && 'response' in lastError ? (lastError as any).response?.status : null,
      attempts: BIOGRAPHY_MAX_ATTEMPTS,
      timestamp: new Date().toISOString(),
    },
  });

  return {
    biography: '',
  };
};
