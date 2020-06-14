import db from "@/utils/firebase/init";

function handleUserFollowers(snapshot) {
  const result = [];

  snapshot.forEach(doc => {
    result.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return result;
}

function handleDiscount(doc) {
  if (doc.exists) {
    const data = doc.data();

    return data.deadline;
  }

  return null;
}

function fetchUserProfile(uid) {
  return db
    .collection("profiles")
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      }
      return {};
    });
}

function subscribeToUserProfileChanges(uid, callback) {
  return db
    .collection("profiles")
    .doc(uid)
    .onSnapshot(doc => {
      callback({
        uid: doc.id,
        ...doc.data()
      });
    });
}

function fetchUserFollowers(uid) {
  return db
    .collection("profiles")
    .where("bonusHolderId", "==", uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => handleUserFollowers(snapshot));
}

function subscribeToUserFollowersChanges(uid, callback) {
  return db
    .collection("profiles")
    .where("bonusHolderId", "==", uid)
    .orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      callback({ uid, followers: handleUserFollowers(snapshot) });
    });
}

function fetchUserDiscount(uid) {
  return db
    .collection("discounts")
    .doc(uid)
    .get()
    .then(doc => handleDiscount(doc));
}

function subscribeToUserDiscountChanges(uid, callback) {
  return db
    .collection("discounts")
    .doc(uid)
    .onSnapshot(doc => {
      callback({ uid, deadline: handleDiscount(doc) });
    });
}

function saveUserInfo(uid, fields, values) {
  const data = {};

  fields.forEach((field, index) => {
    data[field] = values[index];
  });

  return db
    .collection("profiles")
    .doc(uid)
    .update(data);
}

function isUniqueNickname(nickname) {
  return db
    .collection("profiles")
    .where("nickname", "==", nickname)
    .get()
    .then(snapshot => snapshot.empty);
}

export default {
  fetchUserProfile,
  subscribeToUserProfileChanges,
  fetchUserFollowers,
  subscribeToUserFollowersChanges,
  fetchUserDiscount,
  subscribeToUserDiscountChanges,
  saveUserInfo,
  isUniqueNickname
};
