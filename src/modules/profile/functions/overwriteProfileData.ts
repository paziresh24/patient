import type { BioCredentials } from '@/common/apis/services/profile-microservice/normalizeBioCredentials';
import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import { joinProfileNameParts } from '@/modules/profile/utils/resolveProfileDisplayName';
import flatMap from 'lodash/flatMap';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export type OverwriteProfileData = {
  provider: {
    prefix?: string;
    name?: string;
    family?: string;
    display_name?: string;
    biography?: string;
    employee_id?: string;
    provider_id?: string;
    user_id?: string;
    expertises?: any;
    experience?: string;
  };
  history: {
    insert_at_age?: string;
    count_of_page_view?: string;
    deleted_books_rate?: string;
  };
  feedbacks: {
    waiting_time_info?: any;
    waiting_time_statistics?: any;
    reviews?: any;
    averageRates?: any;
    countOfFeedbacks?: number;
    satisfactionPercent?: number;
    hideRates?: boolean;
  };
  expertises?: any;
  image?: string;
  biography?: string;
  credentials?: BioCredentials;
  centers?: any;
  gallery?: any;
};

const pickNonEmptyBiography = (...candidates: unknown[]): string | null => {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate;
    }
  }
  return null;
};

const normalizeGroupExpertise = (group: any) => ({
  id: group?.id,
  en_slug: group?.en_slug ?? group?.slug ?? null,
  icon: group?.icon ?? null,
  name: group?.name ?? group?.title ?? null,
});

const dedupeGroupExpertises = (groups: Array<{ id?: number; en_slug?: string | null; icon?: string | null; name?: string | null }>) =>
  groups.filter((group, index, array) => {
    const slug = group?.en_slug;
    if (slug) {
      return array.findIndex(item => item?.en_slug === slug) === index;
    }
    if (group?.id != null) {
      return array.findIndex(item => item?.id === group.id) === index;
    }
    return false;
  });

const resolveGroupExpertises = (overwriteData: OverwriteProfileData, source: Record<string, any>) => {
  const fromTaggables = flatMap(overwriteData?.provider?.expertises ?? [], item => get(item, 'speciality.taggables', []))
    .map((item: any) => item?.tag)
    .filter(Boolean)
    .map((item: any) =>
      normalizeGroupExpertise({
        id: item.id,
        slug: item.slug,
        icon: item.icon,
        title: item.title,
      }),
    );

  if (!isEmpty(fromTaggables)) {
    return dedupeGroupExpertises(fromTaggables);
  }

  const fromExpertiseApi = flatMap(overwriteData?.expertises ?? [], item => item?.groups ?? [])
    .filter(Boolean)
    .map(normalizeGroupExpertise);

  if (!isEmpty(fromExpertiseApi)) {
    return dedupeGroupExpertises(fromExpertiseApi);
  }

  return source?.group_expertises ?? [];
};

export const overwriteProfileData = (overwriteData: OverwriteProfileData, source: Record<string, any>) => {
  // Pull biography out of provider so an empty/undefined provider.biography cannot wipe a valid bio.
  const { biography: providerBiography, ...providerRest } = overwriteData.provider ?? {};
  const information = {
    id: source?.id ?? null,
    server_id: source?.server_id ?? null,
    display_name: joinProfileNameParts({ name: source?.name, family: source?.family }) || source?.display_name || '',
    name: source?.name,
    family: source?.family,
    biography: pickNonEmptyBiography(overwriteData?.biography, providerBiography, source?.biography),
    employee_id: source?.medical_code,
    experience: source?.experience ?? null,
    gender: source?.gender ?? null,
    image: overwriteData?.image ?? source?.image ?? null,
    city_en_slug: source?.city_en_slug ?? null,
    should_recommend_other_doctors: source?.should_recommend_other_doctors ?? null,
    ...providerRest,
    prefix: '',
    ...(overwriteData.credentials ? { credentials: overwriteData.credentials } : {}),
  };

  const resolvedGroupExpertises = resolveGroupExpertises(overwriteData, source);

  const centers =
    overwriteData?.centers?.map((newCenter: any) => {
      const resolvedCenterType = newCenter.type_id ?? newCenter.center_type ?? null;
      return {
        ...newCenter,
        display_number_array: newCenter.display_number,
        tell_array: newCenter.tell,
        center_type: resolvedCenterType,
        city: newCenter.city?.name || (typeof newCenter.city === 'string' ? newCenter.city : null),
        city_en_slug: newCenter.city?.slug || newCenter.city_en_slug || null,
        province:
          newCenter.city?.province?.name ||
          (typeof newCenter.province === 'string' ? newCenter.province : null),
        map: newCenter.location
          ? {
              lat: newCenter.location.lat,
              lon: newCenter.location.lon,
            }
          : newCenter.map ?? null,
        services: newCenter.services ?? [],
      };
    }) ??
    [];

  const expertises = {
    group_expertises: resolvedGroupExpertises,
    expertises:
      (overwriteData?.expertises ?? source?.expertises)?.map?.((item: any) => {
        // New expertise API may flatten to { name, id, slug }; full-profile keeps { expertise: { name } }.
        const expertiseName = item.expertise?.name ?? item.name ?? '';
        const expertiseId = item.expertise?.id ?? item.id;
        const expertiseSlug = item.expertise?.slug ?? item.slug;
        const degreeName = item.degree?.name ?? '';

        return {
          alias_title: getDisplayDoctorExpertise({
            aliasTitle: item.alias_title,
            degree: degreeName,
            expertise: expertiseName,
          }),
          expertise_id: expertiseId,
          degree_id: item.degree?.id,
          degree_name: degreeName,
          expertise_name: expertiseName,
          ...(expertiseSlug && { slug: expertiseSlug }),
        };
      }) ?? [],
  };

  const feedbacks = {
    ...source?.feedbacks,
    statistics: overwriteData.feedbacks.waiting_time_statistics || null,
    details: {
      average_rates: {
        average_doctor_encounter: source?.feedbacks?.details?.doctor_encounter,
        average_explanation_of_issue: source?.feedbacks?.details?.explanation_of_issue,
        average_quality_of_treatment: source?.feedbacks?.details?.quality_of_treatment,
        ...overwriteData.feedbacks?.averageRates,
      },
      hide_rates: overwriteData?.feedbacks?.hideRates,
      count_of_feedbacks: overwriteData.feedbacks?.countOfFeedbacks ?? null,
      satisfaction_percent: overwriteData.feedbacks?.satisfactionPercent ?? null,
      satisfaction: overwriteData.feedbacks?.satisfactionPercent
        ? ((overwriteData.feedbacks?.satisfactionPercent ?? 0) / 20).toFixed(1)
        : null,
      like: source?.feedbacks?.details?.like ?? null,
    },
  };

  // Merge galleries from all centers (fallback logic)
  const fallbackGalleryFromCenters =
    centers
      ?.flatMap((center: any) => center?.gallery ?? [])
      ?.filter(Boolean) ?? [];
  // When new API returns no gallery, also try gallery from original profile centers (e.g. old API or different source)
  const fallbackGalleryFromSource =
    source?.centers
      ?.flatMap((center: any) => center?.gallery ?? [])
      ?.filter(Boolean) ?? [];
  const fallbackGallery =
    fallbackGalleryFromCenters.length > 0 ? fallbackGalleryFromCenters : fallbackGalleryFromSource;

  const media = {
    aparat: source?.aparat_video_code ?? null,
    gallery: overwriteData?.gallery && overwriteData?.gallery?.length > 0 ? overwriteData?.gallery : fallbackGallery,
  };

  const symptomes = source?.symptomes ?? [];

  const history = {
    insert_at_age: source?.insert_at_age ?? null,
    count_of_consult_books: source?.followConsultBoosk ?? null,
    count_of_page_view: source?.number_of_visits ?? null,
    ...overwriteData.history,
  };

  const similarLinks = source?.similar_links ?? null;

  const onlineVisit = {
    // Legacy full-profile gate — still mapped for activity widgets; profile booking uses centers API + Saman.
    enabled: source?.consult_active_booking ?? null,
    // Plasmic Services calls channels.includes(...) — never pass null.
    channels: source?.online_visit_channel_types ?? [],
  };

  const waitingTimeInfo = overwriteData?.feedbacks?.waiting_time_info?.filter((items: any) => !!items?.waiting_time_title) ?? null;

  return { information, centers, expertises, feedbacks, history, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo };
};

