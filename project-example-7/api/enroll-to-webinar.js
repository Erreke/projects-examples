import axios from 'axios';
import { HOST } from '@/config';

let db;

if (process.server) {
  db = require('@/utils/firebase/server').default;
}

if (process.client) {
  db = require('@/utils/firebase/client').default;
}

function getPageDetails() {
  return db
    .collection('enroll_to_webinar')
    .doc('pageDetails')
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      }

      return {};
    });
}

function enrollToWebinar(payload) {
  return axios.post(`${HOST}/api/v1/enroll-to-webinar/`, payload);
}

export default {
  getPageDetails,
  enrollToWebinar,
};
