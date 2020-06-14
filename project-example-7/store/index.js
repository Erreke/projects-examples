import Vue from 'vue';
import Vuex from 'vuex';

import moduleEnrollToWebinar from './modules/enroll-to-webinar';
import moduleWebinarRecording from './modules/webinar-recording';

Vue.use(Vuex);

let store;

export default function createStore() {
  if (!store) {
    store = new Vuex.Store({
      strict: process.env.NODE_ENV !== 'production',
      modules: {
        'enroll-to-webinar': moduleEnrollToWebinar,
        'webinar-recording': moduleWebinarRecording,
      },
    });
  }

  return store;
}
