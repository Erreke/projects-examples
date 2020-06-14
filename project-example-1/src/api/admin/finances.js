import db from '@/utils/firebase/init';

function handleAllFinances(snapshot) {
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

function fetchClientsAllFinances() {
  return db.collection('finances')
    .get()
    .then(snapshot => handleAllFinances(snapshot));
}

function subscribeToClientsAllFinancesChanges(callback) {
  return db.collection('finances')
    .onSnapshot((snapshot) => {
      callback(handleAllFinances(snapshot));
    });
}

function addCashback(uid, amount) {
  return db
    .collection('finances')
    .doc()
    .set({
      uid,
      amount,
      isCashback: true,
      isApproved: true,
      createdAt: new Date(),
      approvedAt: new Date(),
    });
}

function approveClientWithdrawal(id) {
  return db
    .collection('finances')
    .doc(id)
    .update({
      isApproved: true,
      isRejected: false,
      approvedAt: new Date(),
      rejectedAt: null,
      rejectReason: null,
    });
}

function rejectClientWithdrawal(id, reason) {
  return db
    .collection('finances')
    .doc(id)
    .update({
      isApproved: false,
      isRejected: true,
      approvedAt: null,
      rejectedAt: new Date(),
      rejectReason: reason,
    });
}

function unapproveClientWithdrawal(id) {
  return db
    .collection('finances')
    .doc(id)
    .update({
      isApproved: false,
      isRejected: false,
      approvedAt: null,
      rejectedAt: null,
      rejectReason: null,
    });
}

function unrejectClientWithdrawal(id) {
  return db
    .collection('finances')
    .doc(id)
    .update({
      isApproved: false,
      isRejected: false,
      approvedAt: null,
      rejectedAt: null,
      rejectReason: null,
    });
}

function deleteClientOperation(id) {
  return db
    .collection('finances')
    .doc(id)
    .delete();
}

export default {
  fetchClientsAllFinances,
  subscribeToClientsAllFinancesChanges,
  addCashback,
  approveClientWithdrawal,
  rejectClientWithdrawal,
  unapproveClientWithdrawal,
  unrejectClientWithdrawal,
  deleteClientOperation,
};
