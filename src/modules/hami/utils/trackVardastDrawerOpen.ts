import { splunkInstance } from '@/common/services/splunk';

export type VardastDrawerOpenSource = 'trigger' | 'edge' | 'swipe';

export const trackVardastDrawerOpen = (
  chatId: string,
  options?: { source?: VardastDrawerOpenSource; userId?: string },
) => {
  if (typeof window === 'undefined' || !chatId) return;

  splunkInstance('dashboard').sendEvent({
    group: 'hamdast-vardast',
    type: 'drawer_open',
    event: {
      data: {
        chat_id: chatId,
        source: options?.source,
        user_id: options?.userId,
      },
    },
  });
};
