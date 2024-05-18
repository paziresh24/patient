import { useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import firebaseApp from './config';
import getConfig from 'next/config';
import axios from 'axios';
import { isPWA } from '@/common/utils/isPwa';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { splunkInstance } from '@/common/services/splunk';
const { publicRuntimeConfig } = getConfig();

const useFcmToken = () => {
  const userInfo = useUserInfoStore(state => state.info);
  const [token, setToken] = useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

  const register = async () => {
    try {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        const messaging = getMessaging(firebaseApp);

        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);
        const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');

        if (permission === 'granted') {
          const currentToken = await getToken(messaging, {
            vapidKey: 'BLDC9m-xU9lW32bJyeCVCBPIDVpA3OD0T_V_bqe_uy0UuOO1r8HwuzhAX0qbXOhwxVduP_oiVkgfLmw9WlJnRaQ',
            serviceWorkerRegistration: swRegistration,
          });
          if (currentToken) {
            setToken(currentToken);
            axios.post(`${publicRuntimeConfig.API_GATEWAY_BASE_URL}/v1/notification/subscribers`, {
              user_id: userInfo.id,
              client_id: currentToken,
              user_agent: window.navigator.userAgent,
              terminal: isPWA() ? 'app' : 'web',
            });
            splunkInstance('doctor-profile').sendEvent({
              group: 'notification',
              type: 'web-push-notification-granted',
              event: {
                user_id: userInfo.id,
              },
            });
          } else {
            console.log('No registration token available. Request permission to generate one.');
            splunkInstance('doctor-profile').sendEvent({
              group: 'notification',
              type: 'web-push-notification-no-registration-token',
              event: {
                user_id: userInfo.id,
              },
            });
          }
        }

        if (permission === 'denied') {
          splunkInstance('doctor-profile').sendEvent({
            group: 'notification',
            type: 'web-push-notification-denied',
            event: {
              user_id: userInfo.id,
            },
          });
        }
      }
    } catch (error) {
      splunkInstance('doctor-profile').sendEvent({
        group: 'notification',
        type: 'web-push-notification-error',
        event: {
          user_id: userInfo.id,
          error,
        },
      });
      console.log('An error occurred while retrieving token:', error);
    }
  };

  return { register, fcmToken: token, notificationPermissionStatus };
};

export default useFcmToken;
