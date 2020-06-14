import db from '@/utils/firebase/init';

function handleItems(snapshot) {
  const items = [];

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  }

  return items;
}

function getLeads() {
  return db.collection('get_webinar_clients')
    .get()
    .then(snapshot => handleItems(snapshot));
}

function subscribeToLeadsChanges(callback) {
  return db
    .collection('get_webinar_clients')
    .onSnapshot((snapshot) => {
      callback(handleItems(snapshot));
    });
}

export default {
  getLeads,
  subscribeToLeadsChanges,
};
