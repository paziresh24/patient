import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';
import flatMap from 'lodash/flatMap';
import flatten from 'lodash/flatten';
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
  centers?: any;
  gallery?: any;
};

export const overwriteProfileData = (overwriteData: OverwriteProfileData, source: Record<string, any>) => {
  // Helper function to construct display name properly
  const constructDisplayName = (name: string | null | undefined, family: string | null | undefined): string => {
    const trimmedName = name?.trim() || '';
    const trimmedFamily = family?.trim() || '';
    
    if (!trimmedName && !trimmedFamily) return '';
    if (!trimmedName) return trimmedFamily;
    if (!trimmedFamily) return trimmedName;
    
    return `${trimmedName} ${trimmedFamily}`;
  };

  const information = {
    id: source?.id ?? null,
    server_id: source?.server_id ?? null,
    display_name: constructDisplayName(source?.name, source?.family),
    name: source?.name,
    family: source?.family,
    biography: overwriteData?.biography ?? source?.biography,
    employee_id: source?.medical_code,
    experience: source?.experience ?? null,
    gender: source?.gender ?? null,
    image: overwriteData?.image ?? source?.image ?? null,
    city_en_slug: source?.city_en_slug ?? null,
    should_recommend_other_doctors: source?.should_recommend_other_doctors ?? null,
    ...overwriteData.provider,
    prefix: '',
  };

  const group_expertises = flatMap(overwriteData?.provider?.expertises ?? [], item => get(item, 'speciality.taggables', [])).map(
    (item: any) => item.tag,
  );

  const centers = overwriteData?.centers?.map((newCenter: any) => {
    // Find corresponding center in full profile
    const sourceCenter = source?.centers?.find((sourceCenter: any) => sourceCenter.id === newCenter.id);
    
    if (sourceCenter) {
      // Merge new center data with full profile data
      return {
        ...sourceCenter, // Start with full profile data
        // Override with new API data where available
        id: newCenter.id,
        name: newCenter.name,
        display_number: newCenter.display_number,
        display_number_array: newCenter.display_number, // Map display_number to display_number_array
        tell: newCenter.tell,
        tell_array: newCenter.tell, // Map tell to tell_array
        address: newCenter.address,
        center_type: newCenter.type_id, // Map type_id to center_type
        status: newCenter.status,
        server_id: newCenter.server_id,
        city: newCenter.city?.name || (typeof newCenter.city === 'string' ? newCenter.city : null) || sourceCenter.city,
        city_en_slug: newCenter.city?.slug,
        province: newCenter.city?.province?.name || (typeof newCenter.city?.province === 'string' ? newCenter.city.province : null),
        map: newCenter.location ? {
          lat: newCenter.location.lat,
          lon: newCenter.location.lon
        } : sourceCenter.map,
        // Keep services from full profile
        services: sourceCenter.services,
        // Keep other full profile fields like freeturn, settings, etc.
      };
    } else {
      // If no matching center in full profile, use new center data with empty services
      return {
        ...newCenter,
        display_number_array: newCenter.display_number, // Map display_number to display_number_array
        tell_array: newCenter.tell, // Map tell to tell_array
        center_type: newCenter.type_id, // Map type_id to center_type
        city: newCenter.city?.name || newCenter.city, // Ensure city is string, not object
        city_en_slug: newCenter.city?.slug,
        province: newCenter.city?.province?.name,
        map: newCenter.location ? {
          lat: newCenter.location.lat,
          lon: newCenter.location.lon
        } : null,
        services: []
      };
    }
  }) ?? source?.centers ?? [];

  const expertises = {
    group_expertises: isEmpty(group_expertises)
      ? source?.group_expertises ?? []
      : group_expertises.map((item: any) => item && { id: item.id, en_slug: item.slug, icon: item.icon, name: item.title }),
    expertises:
      (overwriteData?.expertises ?? source?.expertises)?.map?.((item: any) => ({
        alias_title: getDisplayDoctorExpertise({
          aliasTitle: item.alias_title,
          degree: item.degree?.name,
          expertise: item.expertise?.name,
        }),
        expertise_id: item.expertise?.id,
        degree_id: item.degree?.id,
        degree_name: item?.degree?.name ?? '',
        expertise_name: item.expertise?.name ?? '',
      })) ?? [],
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

  const media = {
    aparat: source?.aparat_video_code ?? null,
    gallery: overwriteData?.gallery && overwriteData?.gallery?.length > 0 ? overwriteData?.gallery : centers?.find((center: any) => center?.center_type === 1)?.gallery ?? [],
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
    enabled: source?.consult_active_booking ?? null,
    channels: source?.online_visit_channel_types ?? null,
  };

  const waitingTimeInfo = overwriteData?.feedbacks?.waiting_time_info?.filter((items: any) => !!items?.waiting_time_title) ?? null;

  return { information, centers, expertises, feedbacks, history, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo };
};
