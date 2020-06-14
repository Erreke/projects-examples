const validate = require('../../utils/validate-webinar-recording');
const sendToAmoCRM = require('../../utils/send-to-amo-crm-webinar-recording');
const writeToDB = require('../../utils/write-to-db-webinar-recording');

module.exports = async function getWebinarRecording (req, res) {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const firstName = req.body.firstName || null;
    const phone = req.body.phone || null;
    const email = req.body.email || null;

    const errors = await validate(firstName, email, phone);

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors,
      };
    } else {
      const sendedToAmo = await sendToAmoCRM(firstName, email, phone);
      const writedToDB = await writeToDB(firstName, email, phone);

      status = 200;
      response = {
        success: writedToDB && sendedToAmo,
        url: 'https://www.youtube.com/playlist?list=PLM28TLBa-4GSQEdpZokSc96cyW4x8FytK',
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
