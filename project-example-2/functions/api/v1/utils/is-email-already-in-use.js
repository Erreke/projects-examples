const { admin } = require("../../../admin");

module.exports = function isEmailAlreadyInUse(email) {
  return admin
    .auth()
    .getUserByEmail(email)
    .then(() => true)
    .catch(() => false);
};
