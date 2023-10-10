import { isPWA } from '@/common/utils/isPwa';
import axios from 'axios';
import { getApps } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import getConfig from 'next/config';
import app from './config';
const { publicRuntimeConfig } = getConfig();

const firebaseCloudMessaging = {
  init: async (id: string) => {
    if (getApps().length) {
      try {
        const messaging = getMessaging(app);
        const status = await Notification.requestPermission();
        if (status && status === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'BLDC9m-xU9lW32bJyeCVCBPIDVpA3OD0T_V_bqe_uy0UuOO1r8HwuzhAX0qbXOhwxVduP_oiVkgfLmw9WlJnRaQ',
          });
          if (currentToken) {
            if (localStorage.getItem('fcm_token') !== currentToken) {
              localStorage.setItem('fcm_token', currentToken);
              await axios.post(`${publicRuntimeConfig.API_GATEWAY_BASE_URL}/v1/notification/subscribers`, {
                user_id: id,
                client_id: currentToken,
                user_agent: window.navigator.userAgent,
                terminal: isPWA() ? 'app' : 'web',
              });
            }
            return currentToken;
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};
export { firebaseCloudMessaging };
