const admin = require("firebase-admin");
const functions = require("firebase-functions");

const sendQuizAnswersToAmoCRM = require("./_send-quiz-answers-to-amo-crm");

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({ timestampsInSnapshots: true });

const db = admin.firestore();

exports.sendQuizAnswersToAmoCRM = functions.firestore
  .document("answers/{answerId}")
  .onCreate((change, context) => {
    return sendQuizAnswersToAmoCRM(db, change, context);
  });
