import { getCookie } from 'cookies-next';
import { isPWA } from '../utils/isPwa';

type Index =
  | 'doctor-profile'
  | 'booking-v2'
  | 'gozargah'
  | 'search'
  | 'center-profile'
  | 'booking'
  | 'error'
  | 'dashboard'
  | 'cwv'
  | 'contribute'
  | 'homepage';

type SplunkOptions = {
  baseUrl: string;
  token: string;
  constant?: Record<string, unknown>;
};

type SplunkEventFields = Record<string, any>;

type SendEventPayload = {
  group: string;
  type: string;
  /** Canonical payload field used across most call sites. */
  event?: SplunkEventFields;
  /**
   * Legacy alias used by some callers (e.g. hamdast pages).
   * Treated the same as `event` when posting to HEC.
   */
  data?: SplunkEventFields;
};

type SendBatchEventPayload = {
  group: string;
  type: string;
  events: SplunkEventFields[];
};

type SplunkClient = {
  sendEvent: (payload: SendEventPayload) => Promise<unknown>;
  sendBatchEvent: (payload: SendBatchEventPayload) => Promise<unknown>;
};

/**
 * Do not use @paziresh24/splunk-event's response.json() — it returns without await
 * inside try/catch, so HTML HEC responses become unhandled JSON.parse rejections
 * (often when recommend popup / loadrecommend fires).
 */
const parseJsonSafely = (text: string): unknown => {
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const postCollector = async (baseUrl: string, token: string, body: unknown): Promise<unknown> => {
  try {
    const response = await fetch(`${baseUrl}/services/collector`, {
      method: 'POST',
      headers: {
        Authorization: `Splunk ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    return parseJsonSafely(text);
  } catch {
    return undefined;
  }
};

const createSafeSplunk = ({ baseUrl, token, constant = {} }: SplunkOptions): SplunkClient => ({
  sendEvent: async ({ group, type, event, data }) =>
    postCollector(baseUrl, token, {
      sourcetype: '_json',
      event: {
        event_group: group,
        event_type: type,
        ...constant,
        ...(event ?? {}),
        ...(data ?? {}),
      },
    }),
  sendBatchEvent: async ({ group, type, events }) =>
    postCollector(
      baseUrl,
      token,
      events.map(item => ({
        sourcetype: '_json',
        event: {
          event_group: group,
          event_type: type,
          ...constant,
          ...item,
        },
      })),
    ),
});

export const splunkInstance = (index: Index) => {
  switch (index) {
    case 'doctor-profile': {
      return createSafeSplunk({
        baseUrl: 'https://profile-splunk-hec.paziresh24.com',
        token: '4de2b795-9991-4629-acf3-04857ff8523e',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'contribute': {
      return createSafeSplunk({
        baseUrl: 'https://hamdast-splunk-hec.paziresh24.com',
        token: '43820143-5537-4ea8-89c0-c0574cfa649f',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'booking-v2': {
      return createSafeSplunk({
        baseUrl: 'https://p24-shelter-splunk-hec.paziresh24.com',
        token: '49a5600c-e81d-4b55-8e32-c668f0faf4f0',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'center-profile': {
      return createSafeSplunk({
        baseUrl: 'https://profile-splunk-hec.paziresh24.com',
        token: '4de2b795-9991-4629-acf3-04857ff8523e',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'booking': {
      return createSafeSplunk({
        baseUrl: 'https://p24-shelter-splunk-hec.paziresh24.com',
        token: '49a5600c-e81d-4b55-8e32-c668f0faf4f0',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'search': {
      return createSafeSplunk({
        baseUrl: 'https://rokhdad-splunk-hec.paziresh24.com',
        token: '1e490c2c-d98b-4777-816d-cf7f09b21888',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'homepage': {
      return createSafeSplunk({
        baseUrl: 'https://rokhdad-splunk-hec.paziresh24.com',
        token: 'f9a5959d-625a-4d2e-b892-1c87cfa4e9af',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'error': {
      return createSafeSplunk({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: '0578f83b-e3d0-41a8-8409-15e5f439dba2',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'dashboard': {
      return createSafeSplunk({
        baseUrl: 'https://hamdast-splunk-hec.paziresh24.com',
        token: 'c2b3263e-4c92-4cb6-99dc-a5834b7f0773',
        constant: {
          url:
            typeof window !== 'undefined'
              ? {
                  href: window.location.href,
                  qurey: window.location.search,
                  pathname: window.location.pathname,
                  host: window.location.host,
                }
              : null,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'cwv': {
      return createSafeSplunk({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: '2ab7c78b-d713-46ff-b5a7-2a09920787c4',
        constant: {
          url:
            typeof window !== 'undefined'
              ? {
                  href: window.location.href,
                  qurey: window.location.search,
                  pathname: window.location.pathname,
                  host: window.location.host,
                }
              : null,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'gozargah': {
      return createSafeSplunk({
        baseUrl: 'https://gozargah-splunk.paziresh24.com',
        token: 'cd46b97e-bf0d-46e4-ba7e-111c2f88291f',
        constant: {
          url:
            typeof window !== 'undefined'
              ? {
                  href: window.location.href,
                  qurey: window.location.search,
                  pathname: window.location.pathname,
                  host: window.location.host,
                }
              : null,
          popupForm: typeof window !== 'undefined' ? !window.location.pathname?.startsWith('/login/') : null,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
  }
};
