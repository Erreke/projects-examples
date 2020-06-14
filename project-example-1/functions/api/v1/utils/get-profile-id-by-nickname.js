const { db } = require('../../../admin');

module.exports = function getProfileIdByNickname(nickname) {
  return db
    .collection('profiles')
    .where('nickname', '==', nickname)
    .limit(1)
    .get()
    .then(snapshot => {
      let id = null;

      if (snapshot.empty) {
        return id;
      }

      snapshot.forEach(doc => {
        id = doc.id;
      });

      return id;
    });
}