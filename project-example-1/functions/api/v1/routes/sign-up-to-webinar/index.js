const { validateSignUpToWebinarFields } = require('../../utils/validate');
const sendToAmoCRM = require('../../utils/send-to-amo-crm');
const writeToDB = require('../../utils/write-to-db');

module.exports = async function signUpToWebinar (req, res) {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const firstName = req.body.firstName || null;
    const phone = req.body.phone || null;

    const errors = await validateSignUpToWebinarFields(firstName, phone);

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors,
      };
    } else {
      const sendedToAmo = await sendToAmoCRM(firstName, phone);
      const writedToDB = await writeToDB(firstName, phone);

      status = 200;
      response = {
        success: sendedToAmo && writedToDB,
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
