import db from '@/utils/firebase/init';

function handleFinances(snapshot) {
  const result = [];

  snapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return result;
}

function fetchFinances(uid) {
  return db
    .collection('finances')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => handleFinances(snapshot));
}

function subscribeToFinancesChanges(uid, callback) {
  return db
    .collection('finances')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      callback({
        uid,
        items: handleFinances(snapshot),
      });
    });
}

function addWithdrawalRequest(payload) {
  return db
    .collection('finances')
    .doc()
    .set(payload);
}

function addTransferRequest(payload) {
  const batch = db.batch();

  payload.forEach((item) => {
    const docRef = db.collection('finances').doc();
    batch.set(docRef, item);
  });

  return batch.commit();
}

export default {
  fetchFinances,
  subscribeToFinancesChanges,
  addWithdrawalRequest,
  addTransferRequest,
};
