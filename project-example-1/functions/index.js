const functions = require('firebase-functions');

const api = require('./api');
const approveOrRejectFinances = require('./finances-approve-or-reject');
const notifyAdminAboutNewUser = require('./notify-about-new-user');
const checkClientInAmo = require('./check-client-in-amo');

exports.api = functions.https.onRequest(api());

exports.approveOrRejectFinances = functions.firestore
  .document('finances/{financeId}')
  .onCreate((change, context) => approveOrRejectFinances(change, context));

exports.notifyAdminAboutNewUser = functions.firestore
  .document('profiles/{userId}')
  .onCreate((change, context) => notifyAdminAboutNewUser(change, context));

exports.checkClientInAmo = functions.firestore
  .document('profiles/{userId}')
  .onCreate((change, context) => checkClientInAmo(change, context));
