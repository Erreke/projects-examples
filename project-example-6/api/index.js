const db = require('../firebase/init');

function getRedirectInfo(redirectFrom) {
  return db.collection('redirects')
    .where('redirectFrom', '==', redirectFrom)
    .limit(1)
    .get()
    .then((snapshot) => {
      let info = null;

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          info = {
            id: doc.id,
            ...doc.data(),
          };
        });
      }

      return info;
    });
}

module.exports = {
  getRedirectInfo
};
