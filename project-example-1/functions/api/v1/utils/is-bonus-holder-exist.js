const { db } = require('../../../admin');

module.exports = function isBonusHolderExist(nickname) {
  return db
    .collection('profiles')
    .where('nickname', '==', nickname)
    .get()
    .then(snapshot => !snapshot.empty)
    .catch((error) => {
      console.error('Bonusholder exist checking error:', error);
    });
}