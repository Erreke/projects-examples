/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import express from 'express';
import amoAPI from '../../../../api/amo';
import dbAPI from '../../../../api/db';
// import validate from './_validate';

const router = express.Router();

router.post('/', async (req, res) => {
  let status = 400;
  let response = {
    success: false,
  };

  try {
    const firstName = req.body.firstName || null;
    const secondName = req.body.secondName || null;
    const phone = req.body.phone || null;
    const whatsapp = req.body.whatsapp || null;
    const email = req.body.email || null;
    const city = req.body.city || null;
    const comment = req.body.comment || null;

    // const errors = await validate(firstName, secondName, phone, whatsapp, email, city);
    const errors = [];

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors,
      };
    } else {
      const sendedToAmo = await amoAPI.sendToAmoCRM(firstName, secondName, phone, whatsapp, email, city, comment);
      const writedToDB = await dbAPI.writeToDB({
        firstName, secondName, phone, whatsapp, email, city, comment,
      });

      status = 200;
      response = {
        success: sendedToAmo && writedToDB,
      };
    }

    res.status(status).send(response);
  } catch (error) {
    console.error(error);

    status = 400;
    response = {
      success: false,
      errors: ['unknown-error'],
    };

    res.status(status).send(response);
  }
});

export default router;
