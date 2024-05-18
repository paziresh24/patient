// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: 'AIzaSyAU3TOsBIbTN-9ysiYp9409aP33mrO2X5s',
  projectId: 'paziresh24-c4d37',
  messagingSenderId: '614844775678',
  appId: '1:614844775678:web:7dbb2f618ef5454106f9af',
  authDomain: 'paziresh24-c4d37.firebaseapp.com',
  storageBucket: 'paziresh24-c4d37',
  measurementId: 'G-K0RDVH2XBF',
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

self.addEventListener('push', function (event) {
  var data = event.data.json();
  var options = {
    body: data.notification.body,
    icon: data.notification.icon,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
    },
  };
  event.waitUntil(self.registration.showNotification(data.notification.title, options));
});

self.addEventListener(
  'notificationclick',
  function (event) {
    var click_action = event.currentTarget.data.notification.click_action || event.currentTarget.data.data.click_action;
    event.notification.close();
    var url = 'home';
    event.waitUntil(
      self.clients.matchAll({ type: 'window' }).then(windowClients => {
        // Check if there is already a window/tab open with the target URL
        for (var i = 0; i < windowClients.length; i++) {
          var client = windowClients[i];
          // If so, just focus it.
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow && click_action) {
          self.clients.openWindow(click_action);
        }
      }),
    );
  },
  false,
);
