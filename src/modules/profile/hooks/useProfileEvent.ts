import { splunkInstance } from '@/common/services/splunk';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
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
          terminal_id: getCookie('terminal'),
          group_expertises: profileData.group_expertises?.[0]?.name ?? 'سایر',
          doctor_name: profileData.display_name,
          city: uniq(profileData?.centers?.map(item => item.city)),
          page_Url: location.href,
          rate: profileData.feedbacks?.details?.satisfaction,
          rate_count: profileData.feedbacks?.details?.number_of_feedbacks,
          ...eventData,
        },
      },
    });
  };

  return { rateSplunkEvent };
};
