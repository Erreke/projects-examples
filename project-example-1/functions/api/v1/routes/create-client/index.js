module.exports = async (req, res) => {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const errors = [];

    const firstName = req.body.firstName || null;
    const secondName = req.body.secondName || null;
    const email = req.body.email || null;
    const phone = req.body.phone || null;
    const city = req.body.city || null;
    const country = req.body.country || null;
    const region = req.body.region || null;
    const birthday = req.body.birthday || null;
    const gender = req.body.gender || null;

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

      const uid = await createUser({
        email,
        phone,
        password,
        emailVerified: true,
      });

      const userProfile = await createUserProfile({
        uid,
        firstName,
        secondName,
        email,
        phone,
        city,
        country,
        region, 
        birthday: new Date(birthday),
        gender,
        hasInitialPasswordBeenChanged: true,
        bonusHolderNick: null,
        locale: 'ru',
      });

      status = 200;
      response = {
        success: true,
        userProfile,
        password,
      };
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
};
