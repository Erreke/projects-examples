const { db } = require('../../../admin');

module.exports = function getProfileCreatedDateById(uid) {
  return db.collection('profiles')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();

        return data.createdAt._seconds;
      }

      return null;
    });
}