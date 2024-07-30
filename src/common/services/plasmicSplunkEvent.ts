import { getCookie } from 'cookies-next';
import { isPWA } from '../utils/isPwa';
import { splunk } from '@paziresh24/splunk-event';

export default function plasmicSplunkEvent({
  token,
  group,
  type,
  data,
  api_host,
}: {
  token: string;
  group: string;
  type: string;
  data: Record<string, any>;
  api_host?: string;
}) {
  splunk
    .create({
      baseUrl: api_host ? api_host : 'https://p24splk.paziresh24.com',
      token: token,
      constant: {
        url: {
          href: window.location.href,
          qurey: window.location.search,
          pathname: window.location.pathname,
          host: window.location.host,
        },
        userAgent: window.navigator.userAgent,
        terminal_id: getCookie('terminal_id'),
        is_application: isPWA(),
      },
    })
    .sendEvent({
      group,
      type,
      event: data,
    });
}
