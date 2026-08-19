import { createProfileMicroserviceClient } from '@/common/apis/clients/profileMicroserviceClient';

export type IncrementProfilePageViewResult = {
  page_views?: number;
  counted?: boolean;
};

/**
 * Server-only: +1 page view on profiles-api (microservice backend).
 * POST /v1/profiles/{id}/statistics/page-views
 */
export async function incrementProfilePageView(
  profileApiId: string,
  options?: { terminalId?: string | null; viewerUserId?: string | null },
): Promise<IncrementProfilePageViewResult> {
  const client = createProfileMicroserviceClient();
  const headers: Record<string, string> = {};
  if (options?.terminalId) headers['X-Terminal-Id'] = String(options.terminalId);
  if (options?.viewerUserId) headers['X-Viewer-User-Id'] = String(options.viewerUserId);

  const { data } = await client.post(
    `/v1/profiles/${encodeURIComponent(profileApiId)}/statistics/page-views`,
    {},
    { headers, timeout: 5000 },
  );

  const payload = data?.data ?? data ?? {};
  return {
    page_views: typeof payload.page_views === 'number' ? payload.page_views : undefined,
    counted: typeof payload.counted === 'boolean' ? payload.counted : undefined,
  };
}
