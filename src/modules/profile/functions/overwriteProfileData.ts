import getDisplayDoctorExpertise from '@/common/utils/getDisplayDoctorExpertise';

export type OverwriteProfileData = {
  provider: {
    display_name?: string;
    biography?: string;
    employee_id?: string;
    user_id?: string;
  };
};

export const overwriteProfileData = (overwriteData: OverwriteProfileData, source: Record<string, any>) => {
  const information = {
    id: source.id,
    server_id: source.server_id,
    awards: source.awards,
    scientific: source.scientific,
    display_name: source.display_name,
    biography: source.biography,
    employee_id: source.medical_code,
    experience: source.experience,
    gender: source.gender,
    image: source.image,
    city_en_slug: source.city_en_slug,
    should_recommend_other_doctors: source.should_recommend_other_doctors,
    ...overwriteData.provider,
  };

  const centers = source.centers;

  const expertises = {
    group_expertises: source.group_expertises,
    expertises: source.expertises.map((item: any) => ({
      alias_title: getDisplayDoctorExpertise({
        aliasTitle: item.alias_title,
        degree: item.degree?.name,
        expertise: item.expertise?.name,
      }),
      expertise_id: item.expertise.id,
      degree_id: item.degree.id,
    })),
  };

  const feedbacks = { ...source.feedbacks };

  const media = {
    aparat: source.aparat_video_code,
    gallery: source.centers?.find((center: any) => center?.center_type === 1)?.gallery ?? [],
  };

  const symptomes = source.symptomes;

  const history = {
    insert_at_age: source.insert_at_age,
    count_of_consult_books: source.followConsultBoosk,
    count_of_page_view: source.number_of_visits,
  };

  const similarLinks = source.similar_links;

  const onlineVisit = {
    enabled: source.consult_active_booking,
    channels: source.online_visit_channel_types,
  };

  const waitingTimeInfo = source.waiting_time_info;

  return { information, centers, expertises, feedbacks, history, media, onlineVisit, similarLinks, symptomes, waitingTimeInfo };
};
