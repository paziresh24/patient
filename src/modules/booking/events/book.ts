import { splunkInstance } from '@/common/services/splunk';
import optimizeLogging from '@/common/utils/optimizeLogging';
import { getCookie } from 'cookies-next';

export const sendBookEvent = ({ bookInfo, userInfo, doctorInfo }: { bookInfo: any; userInfo: any; doctorInfo: any }) => {
  optimizeLogging(() => {
    splunkInstance('booking').sendEvent({
      group: 'doctor profile',
      type: 'doctor profile book received',
      event: {
        data: {
          ...doctorInfo,
          user_name: userInfo.name,
          user_family: userInfo.family,
          user_national_code: userInfo.national_code,
          user_tell: userInfo.cell,
          reference_code: bookInfo.reference_code,
          date: bookInfo.from,
          user_agent: window.navigator.userAgent,
          terminal_id: getCookie('terminal_id'),
          center_id: bookInfo.center_id,
        },
      },
    });
  });
};
