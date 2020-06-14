const { admin } = require('../../../admin');

module.exports = function getUserByPhone(phoneNumber) {
  return admin.auth()
    .getUserByPhoneNumber(phoneNumber)
    .then(userRecord => userRecord);
}
