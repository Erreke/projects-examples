import axios from 'axios';
import db from '@/utils/firebase/init';
import { HOST } from '@/config';

function handleBusinessPlaces(snapshot, clients) {
  const items = {
    root: null,
    data: {},
  };

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.parent === null) {
        items.root = doc.id;
      }

      if (!items.data[doc.id]) {
        items.data[doc.id] = {
          ...data,
          client: clients[data.uid],
        };
      }
    });
  }

  return items;
}

function fetchBusinessPlaces(clients) {
  return db
    .collection('business_places')
    .get()
    .then(snapshot => handleBusinessPlaces(snapshot, clients));
}

function subscribeToBusinessPlacesChanges(callback, clients) {
  return db
    .collection('business_places')
    .onSnapshot((snapshot) => {
      callback(handleBusinessPlaces(snapshot, clients));
    });
}

function assignToUser(id, payload) {
  return db
    .collection('business_places')
    .doc(id)
    .update(payload);
}

function sync(id) {
  return axios.get(`${HOST}/api/v1/update-business-place/`, { params: { id } });
}

export default {
  fetchBusinessPlaces,
  subscribeToBusinessPlacesChanges,
  assignToUser,
  sync,
};
