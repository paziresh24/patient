import { splunkBookingInstance } from '@/common/services/splunk';
import { getCookie } from 'cookies-next';

export const sendSelectCenterEvent = ({ center, doctorInfo }: { center: any; doctorInfo: any }) => {
  splunkBookingInstance().sendEvent({
    group: 'doctor profile',
    type: 'doctor profile select center button',
    event: {
      data: {
        ...doctorInfo,
        selected_center_name: center.name,
        freeturn_text: center.freeturn_text,
        user_agent: window.navigator.userAgent,
        terminal_id: getCookie('terminal_id'),
      },
    },
  });
};
