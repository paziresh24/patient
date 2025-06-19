export interface DoctorParams {
  id?: string;
  name: string;
  family: string;
  display_name: string;
  image?: string;
  expertises: Expertises;
  slug?: string;
  doctor_url?: string;
  centers?: Center[];
  server_id?: string;
  group_expertises?: GroupExpertises;
  feedbacks?: Feedback;
  online_visit_channel_types?: string[];
}

export type Feedback = {
  details: {
    satisfaction_percent?: number;
    count_of_feedbacks?: number;
  };
};

export type Expertises = Array<{
  alias_title?: string;
  degree?: {
    id?: string;
    name?: string;
  };
  expertise?: {
    id?: string;
    name?: string;
  };
}>;

export type GroupExpertises = Array<{
  en_slug?: string;
  name?: string;
}>;

export type Center = {
  id?: string;
  name?: string;
  server_id?: string;
  address?: string;
  center_type?: number;
  display_number_array?: string[];
  province?: string;
  city?: string;
  map?: {
    lat?: number;
    lon?: number;
  };
};
