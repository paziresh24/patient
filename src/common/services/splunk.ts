import { splunk } from '@paziresh24/splunk-event';
import { getCookie } from 'cookies-next';
import { isPWA } from '../utils/isPwa';

export const splunkInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: 'f4fd4b50-fe90-48f3-a1ab-5a5070140318',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
      is_application: isPWA(),
    },
  });

export const splunkCenterProfileInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: 'a93b23b1-714e-4a0f-a249-a3b0520b9366',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
      is_application: isPWA(),
    },
  });

export const splunkBookingInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: 'f4fd4b50-fe90-48f3-a1ab-5a5070140318',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
      is_application: isPWA(),
    },
  });

export const splunkSearchInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: '7c4a4dbb-0abc-4d1f-8e65-fbd7e52debbd',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
      is_application: isPWA(),
    },
  });

export const logErrorToSplunk = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: '0578f83b-e3d0-41a8-8409-15e5f439dba2',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
      is_application: isPWA(),
    },
  });

export const coreWebVitalsSplunk = () =>
  splunk.create({
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

export const dashboardSplunk = () =>
  splunk.create({
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
