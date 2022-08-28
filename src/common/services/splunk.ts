import { splunk } from '@paziresh24/splunk-event';

export const splunkInstance = splunk.create({
  baseUrl: 'https://p24splk.paziresh24.com',
  token: '26018e14-efd5-41a3-8b3d-ca263f0c68ac',
});
