import { createProfileMicroserviceClient } from '@/common/apis/clients/profileMicroserviceClient';

export type ProfileMicroserviceBundle = {
  profile: any;
  shenasname: any;
  specialties: any[];
  bio: any;
  gallery: any[];
  locations: any[];
  statistics: any;
  seo: any;
};

const unwrap = <T>(payload: any): T => (payload?.data !== undefined ? payload.data : payload);

export async function getProfileMicroserviceBundle(slug: string): Promise<ProfileMicroserviceBundle | { error: string; status?: number }> {
  const client = createProfileMicroserviceClient();

  try {
    const { data: profilePayload } = await client.get(`/v1/profiles/by-slug/${encodeURIComponent(slug)}`, {
      // Cold profiles-api can exceed the default 8s and still return 200; don't map that to 503.
      timeout: 15_000,
    });
    const profile = unwrap<any>(profilePayload);
    const profileId = profile?.id;
    if (!profileId) {
      return { error: 'Profile id missing from microservice response', status: 404 };
    }

    const [shenasnameRes, specialtiesRes, bioRes, galleryRes, locationsRes, statisticsRes, seoRes] = await Promise.allSettled([
      client.get(`/v1/profiles/${profileId}/shenasname`),
      client.get(`/v1/profiles/${profileId}/specialties`),
      client.get(`/v1/profiles/${profileId}/bio`),
      client.get(`/v1/profiles/${profileId}/gallery`),
      client.get(`/v1/profiles/${profileId}/locations`),
      client.get(`/v1/profiles/${profileId}/statistics`),
      client.get(`/v1/profiles/${profileId}/seo`),
    ]);

    const settled = (result: PromiseSettledResult<any>, fallback: any = null) =>
      result.status === 'fulfilled' ? unwrap(result.value.data) : fallback;

    return {
      profile,
      shenasname: settled(shenasnameRes, {}),
      specialties: settled(specialtiesRes, []) ?? [],
      bio: settled(bioRes, {}),
      gallery: settled(galleryRes, []) ?? [],
      locations: settled(locationsRes, []) ?? [],
      statistics: settled(statisticsRes, {}),
      seo: settled(seoRes, {}),
    };
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 404) {
      return { error: 'Profile not found', status: 404 };
    }
    return { error: error?.message ?? 'Failed to load profile microservice bundle', status };
  }
}
