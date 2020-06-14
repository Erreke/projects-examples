import db from '@/utils/firebase/init';

function createRedirect(redirect) {
  return db
    .collection('redirects')
    .doc()
    .set(redirect);
}

function recoverRedirect(id, redirect) {
  return db
    .collection('redirects')
    .doc(id)
    .set(redirect);
}

function updateRedirect(id, redirect) {
  return db
    .collection('redirects')
    .doc(id)
    .update(redirect);
}

function deleteRedirect(id) {
  return db
    .collection('redirects')
    .doc(id)
    .delete();
}

function fetchAllRedirectsInfo() {
  return db.collection('redirects')
    .orderBy('createdAt', 'desc')
    .get()
    .then((snapshot) => {
      const redirects = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          redirects.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }

      return redirects;
    });
}

function fetchAvailablePhones() {
  return db.collection('available_phones')
    .get()
    .then((snapshot) => {
      const phones = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          phones.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }

      return phones;
    });
}

function subscribeToRedirectsInfoChanges(callback) {
  return db
    .collection('redirects')
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      const redirects = [];

      snapshot.forEach((doc) => {
        redirects.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      callback(redirects);
    });
}

function subscribeToAvailablePhonesChanges(callback) {
  return db
    .collection('available_phones')
    .onSnapshot((snapshot) => {
      const phones = [];

      snapshot.forEach((doc) => {
        phones.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      callback(phones);
    });
}

export default {
  createRedirect,
  recoverRedirect,
  updateRedirect,
  deleteRedirect,
  fetchAllRedirectsInfo,
  fetchAvailablePhones,
  subscribeToRedirectsInfoChanges,
  subscribeToAvailablePhonesChanges,
};
