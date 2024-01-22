import { splunkInstance } from '@/common/services/splunk';
import { getCookie } from 'cookies-next';

export const sendSelectServiceEvent = (doctorInfo: any) => {
  splunkInstance('booking').sendEvent({
    group: 'doctor profile',
    type: 'doctor profile select service button',
    event: {
      data: {
        ...doctorInfo,
        user_agent: window.navigator.userAgent,
        terminal_id: getCookie('terminal_id'),
      },
    },
  });
};
