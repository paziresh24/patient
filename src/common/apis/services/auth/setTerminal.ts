import { dayToSecond } from '@/common/utils/dayToSecond';
import formData from '@/common/utils/formData';
import removeSubdomain from '@/common/utils/removeSubdomain';
import { getCookie, setCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';
import { clinicClient } from '../../client';

export const setTerminal = async () => {
  if (getCookie('terminal_id')) return;
  return await clinicClient
    .post(
      `/api/setTerminal`,
      formData({ terminal_id: uuidv4(), details: window.navigator.userAgent, ip: '0.0.0.0', type: 'web', version: '1' }),
    )
    .then(data => {
      setCookie('terminal_id', data.data.id, {
        maxAge: dayToSecond(60),
        path: '/',
        domain: removeSubdomain(window.location.hostname),
      });
    });
};
