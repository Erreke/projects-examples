const { db } = require('../admin');

module.exports = function(uid) {
  return db.collection('profiles')
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return {
          uid: doc.id,
          ...doc.data(),
        };
      }

      return null;
    });
};
