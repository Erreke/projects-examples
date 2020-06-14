import axios from 'axios';
import db from '@/utils/firebase/init';
import { API_HOST, HOST } from '@/config';

function handleUserBusinessPlaces(snapshot) {
  const businessPlaces = [];

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      businessPlaces.push({
        id: doc.id,
        ...doc.data(),
      });
    });
  }

  return businessPlaces;
}

function fetchUserBusinessPlaces(uid) {
  return db
    .collection('business_places')
    .where('uid', '==', uid)
    .get()
    .then(snapshot => handleUserBusinessPlaces(snapshot));
}

function subscribeToUserBusinessPlacesChanges(uid, callback) {
  return db
    .collection('business_places')
    .where('uid', '==', uid)
    .onSnapshot((snapshot) => {
      callback({
        uid,
        items: handleUserBusinessPlaces(snapshot),
      });
    });
}

function updateBusinessPlace(id) {
  return axios.get(`${HOST}/api/v1/update-business-place/`, { params: { id } });
}

function saveSelectedPackageAndGetPayUrl(uid, packageName) {
  return axios.post(`${HOST}/api/v1/save-selected-package-and-get-pay-url/`, { uid, packageName });
}

function attemptToPay(id) {
  return db
    .collection('business_places')
    .doc(id)
    .update({
      isAttemptedToPay: true,
    });
}

function attemptToPayInstime(id) {
  return db
    .collection('business_places')
    .doc(id)
    .update({
      isAttemptedToPayInstime: true,
    });
}

function changeBusinessPlaceField(payload, token) {
  return axios.put(`${API_HOST}/v1/business-place/`, {
    token,
    ...payload,
  });
}

function cancelBuying(id) {
  return db
    .collection('business_places')
    .doc(id)
    .update({
      mount: 0,
      expiredAt: null,
      purchasedAt: null,
      discountedPrice: 0,
      hasDiscount: false,
      instimeAmount: 0,
      instimeExpiredAt: null,
      instimePaymentUrl: null,
      instimePurchasedAt: null,
      isAttemptedToPay: false,
      isAttemptedToPayInstime: false,
      isPurchased: false,
      isInstimePurchased: false,
      isTimeToSynchronize: false,
      paymentCardDate: null,
      paymentCardNumber: null,
      paymentCardType: null,
      paymentType: null,
      regularPrice: 0,
      synchronizedAt: null,
      uid: null,
    });
}

export default {
  fetchUserBusinessPlaces,
  subscribeToUserBusinessPlacesChanges,
  updateBusinessPlace,
  saveSelectedPackageAndGetPayUrl,
  attemptToPay,
  attemptToPayInstime,
  changeBusinessPlaceField,
  cancelBuying,
};
