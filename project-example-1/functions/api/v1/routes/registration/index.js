const { admin } = require('../../../../admin');
const { HOST } = require('../../../../config');
const { validateRegistrationFields } = require('../../utils/validate');

async function sendVerificationAndPassword(email, firstName, password) {
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
        templateId: EMAIL_TEMPLATES.VERIFICATION_EMAIL_AND_GIVE_PASSWORD,
        data: {
          firstName: firstName,
          password: password,
          email: email,
          link: link,
        },
      }));
    });
}

module.exports = async (req, res) => {
  let status = 200;
  let response = {
    success: true
  };

  try {
    const name = req.body.firstName || null;
    const email = req.body.email || null;
    const phone = req.body.phone || null;
    const bonusHolderNick = req.body.bonusHolderNick || null;
    const locale = req.body.locale || null;

    const errors = await validateRegistrationFields(name, email, phone, bonusHolderNick, locale);

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors
      };

      res.status(status).send(response);
    } else {
      const createUser = require('../../utils/create-user');
      const createUserProfile = require('../../utils/create-user-profile');
      const password = require('../../utils/generate-password')();

      const firstName = name.trim().split(' ')[0];
      const secondName = name.trim().split(' ')[1] || null;
      let bonusHolderId = null;

      const uid = await createUser({
        email: email,
        phone: phone,
        password: password,
        emailVerified: false,
      });

      if (bonusHolderNick) {
        const getProfileIdByNickname = require('../../utils/get-profile-id-by-nickname');

        bonusHolderId = await getProfileIdByNickname(bonusHolderNick);
      }

      const profile = await createUserProfile({
        uid: uid,
        firstName: firstName,
        secondName: secondName,
        email: email,
        phone: phone,
        bonusHolderId: bonusHolderId,
        bonusHolderNick: bonusHolderNick,
        locale: locale,
      });

      const result = await sendVerificationAndPassword(email, firstName, password);

      res.status(status).send({
        success: true,
        result: !!result,
        profile,
       });
    }
  } 
  catch (error) {
    status = 400;
    response = {
      success: false,
      errors: [error.message],
    };

    res.status(status).send(response);
  }
}
