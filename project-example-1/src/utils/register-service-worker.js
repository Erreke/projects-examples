/* eslint-disable no-console */

import { register } from 'register-service-worker';

// function showNotification(registration) {
//   registration.showNotification('Говорит Автоматон!', {
//     body: 'Поздравляем! У вас новый реферал! А значит больше денег на счету!',
//     icon: '/img/icons/android-chrome-192x192.png',
//     vibrate: [200, 100, 200, 100, 200, 100, 200],
//     tag: 'vibration-sample',
//   });
// }

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('Service worker is active.');
    },
    registered() {
      console.log('Service worker has been registered.');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updated(registration) {
      console.log('New content is available; please refresh.');

      document.dispatchEvent(new CustomEvent('swUpdated', { detail: registration }));
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
}
