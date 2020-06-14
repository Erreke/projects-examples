const { admin } = require("../../../admin");

module.exports = async function decodeUserTokenAndGetUid(token) {
  if (!token) return Promise.resolve(null);

  return admin
    .auth()
    .verifyIdToken(token)
    .then(decodedToken => decodedToken.uid);
};
