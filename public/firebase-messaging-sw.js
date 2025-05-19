importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const base64Config = self?.ENV?.NEXT_PUBLIC_FIREBASE_CONFIG ||
  '';

const decodedConfig = JSON.parse(atob(base64Config));

firebase.initializeApp(decodedConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title || 'Notification', {
    body,
    icon: '/icon.png',
  });
});
