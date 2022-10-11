import { splunk } from '@paziresh24/splunk-event';

export const splunkInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: '26018e14-efd5-41a3-8b3d-ca263f0c68ac',
    constant: {
      current_url: window.location.href,
    },
  });

export const splunkSearchInstance = () =>
  splunk.create({
    baseUrl: 'https://p24splk.paziresh24.com',
    token: '7e35b085-d39f-441d-a62f-22890fdd6ac9',
  });
