import { dayToSecond } from '@/common/utils/dayToSecond';
import formData from '@/common/utils/formData';
import removeSubdomain from '@/common/utils/removeSubdomain';
import { AxiosResponse } from 'axios';
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { v4 as uuidv4 } from 'uuid';
import { clinicClient } from '../../client';

export const setTerminal = async () => {
  if (hasCookie('terminal_id')) return Promise.resolve(getCookie('terminal_id'));

  try {
    const data: AxiosResponse<any, any> = await clinicClient.post(
      `/api/setTerminal`,
      formData({
        terminal_id: getCookie('terminal_id') ?? uuidv4(),
        details: window.navigator.userAgent,
        ip: '0.0.0.0',
        type: 'web',
        version: '1',
      }),
    );

    if (hasCookie('terminal_id')) return Promise.resolve(getCookie('terminal_id'));

    const id = data?.data?.id;

    setCookie('terminal_id', id, {
      maxAge: dayToSecond(60),
      path: '/',
      domain: removeSubdomain(window.location.hostname),
    });

    return Promise.resolve(id);
  } catch (error) {
    const fallbackId = getCookie('terminal_id') ?? uuidv4();
    if (!hasCookie('terminal_id')) {
      setCookie('terminal_id', fallbackId, {
        maxAge: dayToSecond(60),
        path: '/',
        domain: removeSubdomain(window.location.hostname),
      });
    }
    console.warn('Failed to set terminal from server, using fallback:', error);
    return Promise.resolve(fallbackId);
  }
};
