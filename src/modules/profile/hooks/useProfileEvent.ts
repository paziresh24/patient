import { splunkInstance } from '@/common/services/splunk';
import { useProfileDataStore } from '@/modules/profile/store/profileData';
import { getCookie } from 'cookies-next';
import uniq from 'lodash/uniq';

export const useProfileSplunkEvent = () => {
  const profileData = useProfileDataStore(state => state.data);
  const rateSplunkEvent = (eventType: string, eventData?: any) => {
    splunkInstance().sendEvent({
      group: 'patient-review-card',
      type: eventType,
      event: {
        data: {
          terminal_id: getCookie('terminal_id'),
          user_agent: window.navigator.userAgent,
          page_url: window.location.pathname,
          referrer: document.referrer,
          group_expertises: profileData.group_expertises?.[0]?.name ?? 'سایر',
          doctor_name: profileData.display_name,
          city: uniq(profileData?.centers?.map(item => item.city)),
          rate: profileData?.feedbacks?.details?.satisfaction,
          rate_count: profileData?.feedbacks?.details?.number_of_feedbacks,
          ...eventData,
        },
      },
    });
  };

  const profileEvent = (eventType: string, eventData?: any) => {
    splunkInstance().sendEvent({
      group: 'doctor profile',
      type: eventType,
      event: {
        data: {
          terminal_id: getCookie('terminal_id'),
          user_agent: window.navigator.userAgent,
          page_url: window.location.pathname,
          referrer: document.referrer,
          group_expertises: profileData.group_expertises?.[0]?.name ?? 'سایر',
          doctor_name: profileData.display_name,
          server_id: profileData.server_id,
          ...eventData,
        },
      },
    });
  };

  const recommendEvent = (eventType: string, eventData?: any) => {
    splunkInstance().sendEvent({
      group: 'recommend',
      type: eventType,
      event: {
        data: {
          terminal_id: getCookie('terminal_id'),
          user_agent: window.navigator.userAgent,
          page_url: window.location.pathname,
          referrer: document.referrer,
          group_expertises: profileData.group_expertises?.[0]?.name ?? 'سایر',
          doctor_name: profileData.display_name,
          server_id: profileData.server_id,
          ...eventData,
        },
      },
    });
  };

  return { rateSplunkEvent, profileEvent, recommendEvent };
};
