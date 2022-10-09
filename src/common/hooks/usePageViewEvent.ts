import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { splunkInstance } from '../services/splunk';

interface UsePageViewEvent {
  group: string;
  data?: Record<string, unknown>;
}

export const usePageViewEvent = () => {
  const userInfo = useUserInfoStore(state => state.info);
  const { query } = useRouter();

  const sendPageViewEvent = ({ group, data }: UsePageViewEvent) =>
    splunkInstance().sendEvent({
      group,
      event: {
        data: {
          url: window.location.pathname,
          user: {
            username: userInfo?.username ?? null,
            terminal_id: getCookie('terminal_id'),
          },
          ...data,
          query: { ...query },
        },
        type: 'page-view',
      },
    });

  return sendPageViewEvent;
};
