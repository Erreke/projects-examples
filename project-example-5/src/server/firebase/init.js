const admin = require('firebase-admin');
const config = require('firebase-config');

admin.initializeApp({
  credential: admin.credential.cert(config.credential),
  databaseURL: config.databaseURL,
});

const db = admin.firestore();

module.exports = {
  db,
  admin,
};
