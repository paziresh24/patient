import type { OverwriteProfileData } from '@/modules/profile/functions/overwriteProfileData';
import type { ProfileMicroserviceBundle } from './getProfileMicroserviceBundle';

const CITY_EN_SLUG: Record<string, string> = {
  تهران: 'tehran',
  یزد: 'yazd',
  اصفهان: 'isfahan',
  شیراز: 'shiraz',
  مشهد: 'mashhad',
  کرج: 'karaj',
  تبریز: 'tabriz',
};

function cityEnSlug(cityName?: string | null) {
  if (!cityName) return null;
  return CITY_EN_SLUG[cityName] ?? null;
}

function phonesFromLocation(loc: any): string[] {
  const phones = Array.isArray(loc?.phones) ? loc.phones : [];
  return phones
    .map((p: any) => (typeof p === 'string' ? p : p?.number))
    .filter(Boolean)
    .map(String);
}

function mapLocationsToCenters(locations: any[]) {
  return (locations ?? []).map((loc: any) => {
    const phones = phonesFromLocation(loc);
    const cityName = loc?.address?.city ?? (typeof loc?.city === 'string' ? loc.city : loc?.city?.name) ?? null;
    const citySlug = loc?.address?.city_slug ?? loc?.city_en_slug ?? loc?.city?.slug ?? cityEnSlug(cityName);
    const province = loc?.address?.province ?? loc?.province ?? null;

    return {
      id: String(loc?.id ?? ''),
      name: loc?.name ?? '',
      address: loc?.address?.full ?? loc?.address?.line ?? '',
      display_number: phones,
      tell: phones,
      type_id: loc?.location_type === 'hospital' ? 2 : 1,
      status: loc?.is_active === false ? 2 : 1,
      server_id: loc?.server_id ?? null,
      city: cityName
        ? {
            name: cityName,
            slug: citySlug,
            province: province ? { name: province } : null,
          }
        : null,
      city_en_slug: citySlug,
      province,
      location:
        loc?.geo?.lat != null && loc?.geo?.lng != null
          ? {
              lat: loc.geo.lat,
              lon: loc.geo.lng,
            }
          : null,
      services: loc?.services_at_location ?? [],
    };
  });
}

function mapSpecialtiesToExpertises(specialties: any[]) {
  return (specialties ?? []).map((item: any) => ({
    alias_title: item?.name ?? item?.title ?? '',
    degree: { id: null, name: '' },
    expertise: {
      id: item?.id ?? null,
      name: item?.name ?? item?.title ?? '',
      slug: item?.slug ?? null,
    },
    groups: item?.is_primary
      ? [
          {
            id: item?.id,
            name: item?.name,
            en_slug: item?.slug,
          },
        ]
      : [],
  }));
}

function mapSpecialtiesToGroupExpertises(specialties: any[]) {
  const primary = (specialties ?? []).filter((s: any) => s?.is_primary);
  const source = primary.length > 0 ? primary : specialties?.slice?.(0, 1) ?? [];
  return source.map((item: any) => ({
    id: item?.id,
    name: item?.name ?? '',
    en_slug: item?.slug ?? '',
  }));
}

/**
 * Map microservice bundle → shapes expected by overwriteProfileData + page props.
 */
export function mapMicroserviceToLegacy(bundle: ProfileMicroserviceBundle) {
  const profile = bundle.profile ?? {};
  const shenasname = bundle.shenasname ?? {};
  const bio = bundle.bio ?? {};
  const specialties = Array.isArray(bundle.specialties) ? bundle.specialties : [];
  const locations = Array.isArray(bundle.locations) ? bundle.locations : [];
  const gallery = Array.isArray(bundle.gallery) ? bundle.gallery : [];
  const statistics = bundle.statistics ?? {};
  const seo = bundle.seo ?? {};
  // Relation keys to legacy paziresh systems (kept on profiles-api as external_ids).
  const externalIds = (profile.external_ids ?? shenasname.external_ids ?? {}) as Record<string, unknown>;

  const pickId = (...candidates: unknown[]) => {
    for (const value of candidates) {
      if (value == null || value === '') continue;
      return String(value);
    }
    return null;
  };

  const firstName = shenasname.first_name ?? '';
  const lastName = shenasname.last_name ?? '';
  const displayName = shenasname.display_name || profile.display_name || `${firstName} ${lastName}`.trim();
  const prefix = shenasname.prefix ?? '';
  const avatar = shenasname.avatar_url || profile.avatar_url || null;
  const biography = bio.about || bio.summary || shenasname['bio.about'] || shenasname['bio.summary'] || '';
  const employeeId = pickId(externalIds.employee_id, shenasname.employee_id, shenasname.medical_code);
  const userId = pickId(externalIds.user_id, shenasname.paziresh_user_id, shenasname.user_id);
  const ownerId = pickId(externalIds.paziresh_id, shenasname.paziresh_id, profile.id) ?? '';
  const serverId = pickId(externalIds.server_id, shenasname.paziresh_server_id, shenasname.server_id);

  const centers = mapLocationsToCenters(locations);
  const expertises = mapSpecialtiesToExpertises(specialties);
  const groupExpertises = mapSpecialtiesToGroupExpertises(specialties);

  const slugInfo = {
    slug: profile.slug,
    type: profile.profile_type ?? 'doctor',
    user_id: userId,
    owner_id: ownerId,
    server_id: serverId,
  };

  const fullProfileLike = {
    id: ownerId,
    server_id: serverId,
    name: firstName,
    family: lastName,
    medical_code: employeeId,
    image: avatar,
    biography,
    gender: shenasname.gender ?? null,
    experience: null,
    city_en_slug: cityEnSlug(profile.primary_city || shenasname.primary_city),
    should_recommend_other_doctors: true,
    centers,
    group_expertises: groupExpertises,
    expertises,
    feedbacks: {
      details: {
        doctor_encounter: statistics.rating_score ?? null,
        explanation_of_issue: statistics.rating_score ?? null,
        quality_of_treatment: statistics.rating_score ?? null,
      },
    },
  };

  const overwrite: OverwriteProfileData = {
    provider: {
      prefix,
      name: firstName,
      family: lastName,
      display_name: displayName.startsWith(prefix) ? displayName : `${prefix} ${displayName}`.trim(),
      biography,
      employee_id: employeeId ?? undefined,
      provider_id: ownerId,
      user_id: userId ?? undefined,
    },
    history: {
      count_of_page_view: statistics.page_views != null ? String(statistics.page_views) : undefined,
    },
    feedbacks: {
      countOfFeedbacks: statistics.reviews_count ?? undefined,
      averageRates: {
        average_doctor_encounter: statistics.rating_score ?? undefined,
        average_explanation_of_issue: statistics.rating_score ?? undefined,
        average_quality_of_treatment: statistics.rating_score ?? undefined,
      },
      satisfactionPercent: statistics.satisfaction_rate ?? undefined,
    },
    expertises,
    image: avatar ?? undefined,
    biography,
    centers,
    gallery: gallery.map((img: any) => img?.url ?? img?.image_url ?? img).filter(Boolean),
  };

  return { slugInfo, fullProfileLike, overwrite, seo, displayName };
}
