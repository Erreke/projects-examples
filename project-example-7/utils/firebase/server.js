const admin = require("firebase-admin");

const config = {
  "type": "",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "",
  "token_uri": "",
  "auth_provider_x509_cert_url": "",
  "client_x509_cert_url": ""
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(config),
    databaseURL: ""
  });
}

export default admin.firestore();