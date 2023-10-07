import * as Sentry from '@sentry/nextjs';
import { specialities } from '../apis/specialities';

type GetSpecialities = { provider_id: string };

export const getSpecialitiesData = async ({ provider_id }: GetSpecialities) => {
  const { data: response } = await specialities({ provider_id });

  if (!response) {
    Sentry.captureMessage(`provider_id:${provider_id}`);
  }

  return {
    ...response.providers_specialities,
  };
};
