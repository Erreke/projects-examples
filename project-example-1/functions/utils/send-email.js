const sgMail = require('@sendgrid/mail');
const functions = require('firebase-functions');

const sendGridKey = functions.config().sendgrid.key;

module.exports = function({ templateId, email, data }) {
  sgMail.setApiKey(sendGridKey);

  const msg = {
    to: email,
    from: '',
    templateId,
    dynamic_template_data: data,
  };

  return sgMail.send(msg);
};
