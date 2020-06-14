const { admin } = require('../../../../admin');
const { HOST } = require('../../../../config');

function getUser(uid) {
  return admin.auth()
    .getUser(uid)
    .then(userRecord => userRecord);
}

async function sendVerificationCodeByEmail(email) {
  const actionCodeSettings = {
    url: `${HOST}/?dialog=auth`,
  };

  return await admin.auth()
    .generateEmailVerificationLink(email, actionCodeSettings)
    .then(link => {
      const sendEmail = require('../../utils/send-email');
      const prepareEmail = require('../../utils/prepare-email');
      const { EMAIL_TEMPLATES } = require('../../../../config');

      return sendEmail(prepareEmail({
        email: email,
        templateId: EMAIL_TEMPLATES.VERIFICATION_CODE,
        data: {
          link: link,
        },
      }));
    });
}

module.exports = async function sendVerificationCode (req, res) {
  let user;
  let status = 400;
  let response = {
    success: false
  };

  try {
    const uid = req.body.uid || null;

    const errors = [];

    if (!uid) {
      errors.push('required-uid');
    }

    // TODO: check min-max length and valid uid

    if (uid) {
      user = await getUser(uid);

      if (user.emailVerified) {
        errors.push('already-verified');
      }
    }

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors,
      };
    } else {
      status = 200;
      response = {
        success: true,
        result: await sendVerificationCodeByEmail(user.email),
      };
    }

    res.status(status).send(response);
  }
  catch (error) {
    console.error(error);

    status = 400;
    response = {
      success: false,
      errors: ['unknown-error'],
    };

    res.status(status).send(response);
  }
}