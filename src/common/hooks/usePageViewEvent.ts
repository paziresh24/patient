import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { splunkInstance } from '../services/splunk';

interface UsePageViewEvent {
  group: string;
  type: string;
  data?: Record<string, unknown>;
}

export const usePageViewEvent = () => {
  const userInfo = useUserInfoStore(state => state.info);
  const { query } = useRouter();

  const sendPageViewEvent = ({ group, type, data }: UsePageViewEvent) =>
    splunkInstance('doctor-profile').sendEvent({
      group,
      type,
      event: {
        event_action: 'page-view',
        data: {
          url: window.location.pathname,
          user: {
            username: userInfo?.cell ?? null,
            terminal_id: getCookie('terminal_id'),
          },
          ...data,
          query: { ...query },
        },
      },
    });

  return sendPageViewEvent;
};
