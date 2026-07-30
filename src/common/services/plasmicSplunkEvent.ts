import { getCookie } from 'cookies-next';
import { isPWA } from '../utils/isPwa';

/**
 * Plasmic-registered Splunk helper. Must never throw on HTML HEC responses
 * (same JSON.parse issue as @paziresh24/splunk-event).
 */
export default async function plasmicSplunkEvent({
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
  try {
    const baseUrl = api_host ? api_host : 'https://p24splk.paziresh24.com';
    const response = await fetch(`${baseUrl}/services/collector`, {
      method: 'POST',
      headers: {
        Authorization: `Splunk ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourcetype: '_json',
        event: {
          event_group: group,
          event_type: type,
          url: {
            href: window.location.href,
            qurey: window.location.search,
            pathname: window.location.pathname,
            host: window.location.host,
          },
          userAgent: window.navigator.userAgent,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
          ...data,
        },
      }),
    });
    const text = await response.text();
    if (!text) return undefined;
    try {
      return JSON.parse(text);
    } catch {
      return undefined;
    }
  } catch {
    return undefined;
  }
}
