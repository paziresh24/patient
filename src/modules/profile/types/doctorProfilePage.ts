import { ThemeConfig } from '@/common/hooks/useCustomize';

export type DoctorProfileInformation = {
  id?: string | number | null;
  user_id?: string | null;
  provider_id?: string | number | null;
  server_id?: string | number | null;
  display_name?: string;
  employee_id?: string | null;
  experience?: string | number | null;
  biography?: string | null;
  gender?: string | null;
  city_en_slug?: string | null;
  should_recommend_other_doctors?: boolean | null;
  [key: string]: unknown;
};

export type DoctorProfilePageProps = {
  shouldFetchOnClient?: boolean;
  slug?: string;
  status?: number;
  title?: string;
  description?: string;
  host?: string;
  user_id?: string | null;
  information?: DoctorProfileInformation | null;
  centers?: Record<string, unknown>[];
  expertises?: Record<string, unknown>;
  feedbacks?: Record<string, unknown>;
  media?: Record<string, unknown>;
  symptomes?: unknown[] | Record<string, unknown>;
  history?: Record<string, unknown>;
  onlineVisit?: Record<string, unknown>;
  similarLinks?: unknown[];
  waitingTimeInfo?: Record<string, unknown>;
  isBulk?: boolean;
  breadcrumbs?: { text: string; href: string }[];
  fragmentComponents?: {
    risman?: unknown;
  };
  hamdastWidgets?: Record<string, unknown>[];
  hamdastWidgetsData?: Record<string, unknown>;
  config?: ThemeConfig;
  seo?: { slug?: string };
  [key: string]: unknown;
};

export type AggregatedProfileResponse = {
  props?: DoctorProfilePageProps;
  redirect?: {
    statusCode: number;
    destination: string;
  };
};
