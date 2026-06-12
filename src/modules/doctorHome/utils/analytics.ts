import { splunkInstance } from '@/common/services/splunk';

type DoctorHomeFeature =
  | 'stat_performance'
  | 'stat_satisfaction'
  | 'stat_appointments'
  | 'stat_page_view'
  | 'online_visit_toggle'
  | 'appointments_see_all'
  | 'reviews_see_all'
  | 'notification_click'
  | 'tools_see_all'
  | 'view_mode_switch';

export const sendDoctorHomeEvent = (
  userId: string | undefined,
  feature: DoctorHomeFeature,
  metaData?: Record<string, unknown>,
) => {
  if (!userId) return;

  splunkInstance('dashboard').sendEvent({
    group: 'launcher_statistics',
    type: 'widget_features',
    event: {
      feature,
      user_id: userId,
      is_doctor: true,
      meta_data: metaData,
    },
  });
};
