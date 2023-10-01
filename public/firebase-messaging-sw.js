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

localSelf.addEventListener('notificationclick', function (event) {
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

  event.waitUntil(localSelf.registration.showNotification(title, notificationOptions));
});
