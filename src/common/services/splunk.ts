import { splunk } from '@paziresh24/splunk-event';
import { getCookie } from 'cookies-next';
import { isPWA } from '../utils/isPwa';

type Index =
  | 'doctor-profile'
  | 'booking-v2'
  | 'gozargah'
  | 'rokhnama'
  | 'search'
  | 'center-profile'
  | 'booking'
  | 'error'
  | 'dashboard'
  | 'cwv'
  | 'contribute';

export const splunkInstance = (index: Index) => {
  switch (index) {
    case 'doctor-profile': {
      return splunk.create({
        baseUrl: 'https://splunk-ravi-hec.paziresh24.com',
        token: '64bd80f1-14cb-4808-8986-c183013cbc9d',
        constant: {
          current_url: typeof window !== 'undefined' ? window.location.href : null,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'contribute': {
      return splunk.create({
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
        baseUrl: 'https://splunk-ravi-hec.paziresh24.com',
        token: '0ab1caf8-62e9-4e76-a8f0-e41ef7fda125',
        constant: {
          current_url: window.location.href,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
    case 'booking': {
      return splunk.create({
        baseUrl: 'https://splunk-ravi-hec.paziresh24.com',
        token: '6a22ae6e-2c46-4c2b-bff1-846b7fcd8b86',
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
        baseUrl: 'https://hamdast-splunk-hec.paziresh24.com',
        token: 'c2b3263e-4c92-4cb6-99dc-a5834b7f0773',
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
    case 'gozargah': {
      return splunk.create({
        baseUrl: 'https://gozargah-splunk.paziresh24.com',
        token: '319fa7e9-15e9-4bda-87d0-f0e746caeeed',
        constant: {
          url: {
            href: window.location.href,
            qurey: window.location.search,
            pathname: window.location.pathname,
            host: window.location.host,
          },
          popupForm: !window.location.pathname?.startsWith('/login/'),
          userAgent: window.navigator.userAgent,
          terminal_id: getCookie('terminal_id'),
          is_application: isPWA(),
        },
      });
    }
  }
};
