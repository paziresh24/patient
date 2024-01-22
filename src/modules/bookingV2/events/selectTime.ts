import { sendGaEvent } from '@/common/services/sendGaEvent';
import { splunkInstance } from '@/common/services/splunk';
import { getCookie } from 'cookies-next';

export const sendFirstFreeTimeEvent = ({ data, doctorInfo }: { data: any; doctorInfo: any }) => {
  splunkInstance('booking').sendEvent({
    group: 'doctor profile',
    type: 'doctor profile freeturn see',
    event: {
      data: {
        ...doctorInfo,
        freeturn: data.full_date,
        response_message_text: data.message,
        response_status_code: data.status,
        response_time: data.meta?.responseTime / 1000,
        user_agent: window.navigator.userAgent,
        terminal_id: getCookie('terminal_id'),
      },
    },
  });
};

export const sendOtherFreeTimeEvent = ({ data, doctorInfo }: { data: any; doctorInfo: any }) => {
  sendGaEvent({ action: 'P24DrsPage', category: 'select-another-time', label: 'select-another-time' });
  splunkInstance('booking').sendEvent({
    group: 'doctor profile',
    type: 'doctor profile another FreeTurns See',
    event: {
      data: {
        ...doctorInfo,
        response_message_text: data.message,
        response_status_code: data.status,
        user_agent: window.navigator.userAgent,
        terminal_id: getCookie('terminal_id'),
      },
    },
  });
};
