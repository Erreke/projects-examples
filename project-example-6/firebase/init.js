var admin = require("firebase-admin");
var serviceAccount = require("../settings/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: ""
});

module.exports = admin.firestore();
