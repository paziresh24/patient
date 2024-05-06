/// <reference lib="webworker" />
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAU3TOsBIbTN-9ysiYp9409aP33mrO2X5s',
  projectId: 'paziresh24-c4d37',
  messagingSenderId: '614844775678',
  appId: '1:614844775678:web:7dbb2f618ef5454106f9af',
});

/**
 * @type ServiceWorkerGlobalScope
 */
const localSelf = self;

localSelf.addEventListener('install', e => {
  localSelf.skipWaiting();
});

const openUrl = async url => {
  if (localSelf.clients.openWindow) {
    return localSelf.clients.openWindow(url);
  }
};

const isUrl = url => {
  return url.startsWith('http') || url.startsWith('https') || url.startsWith('intent');
};

localSelf.addEventListener('notificationclick', async function (event) {
  fetch(`https://p24splk.paziresh24.com/services/collector`, {
    method: 'POST',
    headers: {
      'Authorization': 'Splunk f4fd4b50-fe90-48f3-a1ab-5a5070140318',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sourcetype: '_json',
      event: {
        event_group: 'notification',
        event_type: 'click',
        message_id: event.notification.data.messageId,
        distention: event.action ? event.action : event.notification.data.url,
      },
    }),
  });

  event.notification.close();

  if (event.action) {
    if (isUrl(event.action)) {
      event.waitUntil(openUrl(event.action));
    }
  } else {
    event.waitUntil(openUrl(event.notification.data.url));
  }
});

localSelf.addEventListener('push', event => {
  console.log('push-event', event);
  let response = event.data && event.data.text();
  let title = JSON.parse(response).notification.title;
  let body = JSON.parse(response).notification.body;
  let actions = JSON.parse(response).data.actions;
  if (!actions) {
    actions = '[]';
  }
  let icon = JSON.parse(response).data.icon;
  if (!icon) {
    icon = 'https://www.paziresh24.com/img/pz24-icon.png';
  }
  let image = JSON.parse(response).notification.image;
  let url = JSON.parse(response).data.deeplink;
  if (!url) {
    url = JSON.parse(response).data.url;
  }
  let messageId = JSON.parse(response).fcmMessageId;

  try {
    fetch(`https://p24splk.paziresh24.com/services/collector`, {
      method: 'POST',
      headers: {
        'Authorization': 'Splunk f4fd4b50-fe90-48f3-a1ab-5a5070140318',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourcetype: '_json',
        event: {
          event_group: 'notification',
          event_type: 'received',
          message_id: messageId,
        },
      }),
    });
  } catch (error) {
    console.log(error);
  }

  const notificationOptions = {
    body: body,
    dir: 'rtl',
    icon: icon,
    image: image,
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    actions: JSON.parse(actions),
    data: {
      url: url ? url : 'https://www.paziresh24.com/apphome',
      messageId: messageId,
    },
  };

  console.log('push-options', notificationOptions);

  event.waitUntil(localSelf.registration.showNotification(title, notificationOptions));
});
