import axios from 'axios';
import db from '@/utils/firebase/init';

function handleAllTariff(snapshot) {
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

function fetchAllTariff() {
  return db.collection('tariffs')
    .get()
    .then(snapshot => handleAllTariff(snapshot));
}

function subscribeToAllTariffChanges(callback) {
  return db.collection('tariffs')
    .onSnapshot((snapshot) => {
      callback(handleAllTariff(snapshot));
    });
}

function confirmPayment(id, amountTNG) {
  return db.collection('tariffs')
    .doc(id)
    .update({
      amountTNG,
      isPaymentConfirmed: true,
      paymentConfirmedAt: new Date(),
    });
}

function runAd(id) {
  return db.collection('tariffs')
    .doc(id)
    .update({
      isAdRunning: true,
      isAdStopped: false,
      isAdExpired: false,
      adRunnedAt: new Date(),
      adStoppedAt: null,
      adExpiredAt: null,
    });
}

function stopAd(id) {
  return db.collection('tariffs')
    .doc(id)
    .update({
      isAdRunning: false,
      isAdStopped: true,
      isAdExpired: false,
      adRunnedAt: null,
      adStoppedAt: new Date(),
      adExpiredAt: null,
    });
}

function expireAd(id) {
  return db.collection('tariffs')
    .doc(id)
    .update({
      isAdRunning: false,
      isAdStopped: false,
      isAdExpired: true,
      adRunnedAt: null,
      adStoppedAt: null,
      adExpiredAt: new Date(),
    });
}

function deleteOrder(id) {
  return db.collection('tariffs')
    .doc(id)
    .delete();
}

function fetchUsdRate(date) {
  axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
  return axios.get(`https://nationalbank.kz/rss/get_rates.cfm?fdate=${date}&switch=russian`);
}

export default {
  fetchAllTariff,
  subscribeToAllTariffChanges,
  confirmPayment,
  runAd,
  stopAd,
  expireAd,
  deleteOrder,
  fetchUsdRate,
};
