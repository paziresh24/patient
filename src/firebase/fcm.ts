import { PushProviderIdEnum } from '@novu/node';
import { getApps } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import getConfig from 'next/config';
import { novu } from 'src/pages/_app';
import app from './config';
const { publicRuntimeConfig } = getConfig();

const firebaseCloudMessaging = {
  init: async ({
    id,
    firstName,
    lastName,
    phone,
    avatar,
    isDoctor,
  }: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    avatar: string;
    isDoctor?: boolean;
  }) => {
    if (getApps().length) {
      try {
        const messaging = getMessaging(app);
        const status = await Notification.requestPermission();
        await novu.subscribers.identify(id.toString(), {
          firstName,
          lastName,
          phone,
          avatar,
          data: {
            isDoctor,
          },
        });

        if (status && status === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'BLDC9m-xU9lW32bJyeCVCBPIDVpA3OD0T_V_bqe_uy0UuOO1r8HwuzhAX0qbXOhwxVduP_oiVkgfLmw9WlJnRaQ',
          });
          if (currentToken) {
            if (localStorage.getItem('fcm_token') !== currentToken) {
              localStorage.setItem('fcm_token', currentToken);
              novu.subscribers.setCredentials(id.toString(), PushProviderIdEnum.FCM, {
                deviceTokens: [currentToken],
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
