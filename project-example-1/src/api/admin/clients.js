import axios from 'axios';
import db from '@/utils/firebase/init';
import { HOST } from '@/config';

function handleItems(snapshot) {
  const items = {};

  if (!snapshot.empty) {
    snapshot.forEach((doc) => {
      items[doc.id] = {
        uid: doc.id,
        ...doc.data(),
      };
    });
  }

  return items;
}

function fetchClientsProfiles() {
  return db
    .collection('profiles')
    .get()
    .then(snapshot => handleItems(snapshot));
}

function subscribeToAllClientsDataChanges(callback) {
  return db
    .collection('profiles')
    .onSnapshot((snapshot) => {
      callback(handleItems(snapshot));
    });
}

function fetchClientsDiscounts() {
  return db
    .collection('discounts')
    .get()
    .then(snapshot => handleItems(snapshot));
}

function subscribeToDiscountsChanges(callback) {
  return db
    .collection('discounts')
    .onSnapshot((snapshot) => {
      callback(handleItems(snapshot));
    });
}

function deleteClientProfile(uid) {
  return db
    .collection('profiles')
    .doc(uid)
    .delete();
}

function deleteClient(uid, aid) {
  return axios.post(`${HOST}/api/v1/delete-user/`, {
    uid,
    aid,
  });
}

function saveClientInfo(uid, fields, values) {
  const data = {};

  fields.forEach((field, index) => {
    data[field] = values[index];
  });

  return db
    .collection('profiles')
    .doc(uid)
    .update(data);
}

function createClientDiscountDeadline(uid, deadline, manager) {
  return db
    .collection('discounts')
    .doc(uid)
    .set({
      createdAt: new Date(),
      createdBy: manager,
      deadline,
      updateBy: null,
      updatedAt: null,
    });
}

function updateClientDiscountDeadline(uid, deadline, manager) {
  return db
    .collection('discounts')
    .doc(uid)
    .update({
      deadline,
      updateBy: manager,
      updatedAt: new Date(),
    });
}

function deleteClientDiscountDeadline(uid) {
  return db
    .collection('discounts')
    .doc(uid)
    .delete();
}

function fetchClientsQueue() {
  return db.collection('profiles')
    .where('isTransactionConfirmed', '==', true)
    .where('isAdmin', '==', false)
    .where('isAgent', '==', false)
    .where('isArchived', '==', false)
    .where('autoReferralsCount', '<', 3)
    .orderBy('autoReferralsCount', 'desc')
    .orderBy('transactionConfirmedAt')
    .get()
    .then((snapshot) => {
      const nextCurators = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          nextCurators.push({
            cid: doc.id,
            ...doc.data(),
          });
        });
      }

      return nextCurators;
    });
}

function createClient(payload) {
  return axios.post(`${HOST}/api/v1/create-client/`, payload);
}

export default {
  fetchClientsProfiles,
  subscribeToAllClientsDataChanges,
  fetchClientsDiscounts,
  subscribeToDiscountsChanges,
  deleteClientProfile,
  deleteClient,
  saveClientInfo,
  createClientDiscountDeadline,
  updateClientDiscountDeadline,
  deleteClientDiscountDeadline,
  fetchClientsQueue,
  createClient,
};
