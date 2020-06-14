const sendEmail = require('../utils/send-email');
const prepareEmail = require('../utils/prepare-email');
const { EMAIL_TEMPLATES } = require('../config');

module.exports = function(userSnapshot, context) {
  const user = userSnapshot.data();
  const userId = context.params.userId;

  return sendEmail(prepareEmail({
    email: '',
    templateId: EMAIL_TEMPLATES.NOTIFICATION_ABOUT_NEW_USER,
    data: {
      uid: userId,
      firstName: user.firstName,
      secondName: user.secondName,
      email: user.email,
    },
  }))
};
