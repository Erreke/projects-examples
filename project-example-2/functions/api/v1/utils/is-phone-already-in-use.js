const { admin } = require("../../../admin");

module.exports = function isPhoneAlreadyInUse(phoneNumber) {
  return admin
    .auth()
    .getUserByPhoneNumber(phoneNumber)
    .then(() => true)
    .catch(() => false);
};
