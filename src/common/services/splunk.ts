import { splunk } from '@paziresh24/splunk-event';
import { getCookie } from 'cookies-next';
import { isPWA } from '../utils/isPwa';

type Index = 'doctor-profile' | 'booking-v2' | 'rokhnama' | 'search' | 'center-profile' | 'booking' | 'error' | 'dashboard' | 'cwv';

export const splunkInstance = (index: Index) => {
  switch (index) {
    case 'doctor-profile': {
      return splunk.create({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: 'f4fd4b50-fe90-48f3-a1ab-5a5070140318',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'booking-v2': {
      return splunk.create({
        baseUrl: 'https://booking-splunk-hec.paziresh24.com',
        token: '6605bd5e-79c4-413e-bab9-159fc20b9bf7',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'rokhnama': {
      return splunk.create({
        baseUrl: 'https://slpunk-rokhnama.paziresh24.com',
        token: '5c2a7141-bbfc-41c1-8e92-5c0c924b9125',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'center-profile': {
      return splunk.create({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: 'a93b23b1-714e-4a0f-a249-a3b0520b9366',
        constant: {
          current_url: window.location.href,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'booking': {
      return splunk.create({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: 'f4fd4b50-fe90-48f3-a1ab-5a5070140318',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'search': {
      return splunk.create({
        baseUrl: 'https://rokhdad-splunk-hec.paziresh24.com',
        token: '1e490c2c-d98b-4777-816d-cf7f09b21888',
        constant: {
          current_url: window.location.href,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'error': {
      return splunk.create({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: '0578f83b-e3d0-41a8-8409-15e5f439dba2',
        constant: {
          current_url: window.location.href,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'dashboard': {
      return splunk.create({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: 'f2287603-5e9d-4bdd-a8ef-33344421838b',
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
      });
    }
    case 'cwv': {
      return splunk.create({
        baseUrl: 'https://p24splk.paziresh24.com',
        token: '2ab7c78b-d713-46ff-b5a7-2a09920787c4',
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
      });
    }
  }
};
