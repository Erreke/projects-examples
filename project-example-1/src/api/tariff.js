import db from '@/utils/firebase/init';

function handleUserTariffs(snapshot) {
  const tariffs = [];

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      tariffs.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  }

  return tariffs;
}

function fetchUserTariffs(uid) {
  return db
    .collection('tariffs')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => handleUserTariffs(snapshot));
}

function subscribeToUserTariffsChanges(uid, callback) {
  return db
    .collection('tariffs')
    .where('uid', '==', uid)
    .orderBy('createdAt', 'desc')
    .onSnapshot((snapshot) => {
      callback({
        uid,
        items: handleUserTariffs(snapshot),
      });
    });
}

function selectTariff(uid, tariff, priceUSD) {
  return db
    .collection('tariffs')
    .doc()
    .set({
      uid,
      priceUSD,
      tariff,
      amountTNG: 0,

      isAttemptedToPay: false,
      isPaymentConfirmed: false,
      isAdRunning: false,
      isAdStopped: false,
      isAdExpired: false,

      attemptedAt: null,
      paymentConfirmedAt: null,
      adRunnedAt: null,
      adStoppedAt: null,
      adExpiredAt: null,

      createdAt: new Date(),
      updatedAt: null,

      updatedBy: null,
    });
}

function attemptToPay(id) {
  return db
    .collection('tariffs')
    .doc(id)
    .update({
      attemptedAt: new Date(),
      isAttemptedToPay: true,
    });
}

function cancelBuying(id) {
  return db
    .collection('tariffs')
    .doc(id)
    .delete();
}

export default {
  fetchUserTariffs,
  subscribeToUserTariffsChanges,
  selectTariff,
  attemptToPay,
  cancelBuying,
};
