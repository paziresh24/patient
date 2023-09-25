import { splunk } from '@paziresh24/splunk-event';
import { getCookie } from 'cookies-next';

export const splunkInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: 'f4fd4b50-fe90-48f3-a1ab-5a5070140318',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
    },
  });

export const splunkCenterProfileInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: 'a93b23b1-714e-4a0f-a249-a3b0520b9366',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
    },
  });

export const splunkBookingInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: 'f4fd4b50-fe90-48f3-a1ab-5a5070140318',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
    },
  });

export const splunkSearchInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: '7c4a4dbb-0abc-4d1f-8e65-fbd7e52debbd',
    constant: {
      current_url: window.location.href,
      terminal_id: getCookie('terminal_id'),
    },
  });
