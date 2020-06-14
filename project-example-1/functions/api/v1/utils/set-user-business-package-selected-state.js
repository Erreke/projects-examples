const { db } = require('../../../admin');

module.exports = function setUserBusinessPackageSelectedState(uid) {
  return db
    .collection('profiles')
    .doc(uid)
    .update({ hasInitialBusinessPackageBeenSelected: true });
}
