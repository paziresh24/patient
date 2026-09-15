import { splunkInstance } from '@/common/services/splunk';

type DoctorHomeFeature =
  | 'stat_satisfaction'
  | 'stat_appointments'
  | 'stat_page_view'
  | 'stat_wallet'
  | 'stat_performance'
  | 'online_visit_toggle'
  | 'online_visit_actions_open'
  | 'clinic_actions_open'
  | 'clinic_picker_select'
  | 'appointments_see_all'
  | 'reviews_see_all'
  | 'notification_click'
  | 'tools_see_all'
  | 'tools_browse'
  | 'widget_open'
  | 'view_mode_switch'
  | 'shortcut_workhours'
  | 'shortcut_vacation'
  | 'shortcut_tariff'
  | 'shortcut_booking_settings'
  | 'shortcut_notifications';

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
