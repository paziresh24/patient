import axios from 'axios';

export const sendEvent = (url: string, body: any) => {
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, JSON.stringify(body));
  } else {
    axios.post(url, body);
  }
};
