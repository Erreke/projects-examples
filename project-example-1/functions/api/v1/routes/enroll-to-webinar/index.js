const { db } = require('../../../../admin');
const { validateEnrollToWebinarFields } = require('../../utils/validate');
const fixPhoneForAmoCRM = require('../../../../utils/fix-phone-for-amo-crm');
const moveInAmoCrm = require('../../utils/move-in-amo-crm');
const getUserByPhone = require('../../utils/get-user-by-phone');

async function updateProfileExistInAmoField(fixedPhone) {
  const phone = `+7${fixedPhone}`;
  const user = await getUserByPhone(phone);

  return db
    .collection('profiles')
    .doc(user.uid)
    .update({ isExistInAmo: true });
}

module.exports = async function enrollToWebinar(req, res) {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const name = req.body.name || null;
    const email = req.body.email || null;
    const phone = req.body.phone || null;
    const city = req.body.city || null;

    const errors = await validateEnrollToWebinarFields(name, email, phone, city);

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors,
      };
    } else {
      const fixedPhone = fixPhoneForAmoCRM(phone);
      const movedInAmoCrm = await moveInAmoCrm(name, email, fixedPhone, city);

      if (typeof movedInAmoCrm === 'boolean' && movedInAmoCrm) {
        updateProfileExistInAmoField(fixedPhone);

        status = 200;
        response = {
          success: movedInAmoCrm,
        };
      } else {
        status = 400;
        response = {
          success: false,
          errors: [movedInAmoCrm.message],
          extra: movedInAmoCrm.extra,
        };
      }
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
