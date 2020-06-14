const { admin } = require('../../../../admin');
const isValidEmail = require('../../utils/is-valid-email');
const getProfileById = require('../../utils/get-profile-by-id');

function getUserByEmail(email) {
  return admin.auth()
    .getUserByEmail(email)
    .then((user) => ({
      uid: user.uid,
      email: user.email,
      phone: user.phoneNumber,
    }))
    .catch(() => false);
}

module.exports = async (req, res) => {
  let status;
  let response;

  const email = req.query.email || '';

  if (!isValidEmail(email)) {
    status = 400;
    response = {
      error: 'INVALID_EMAIL'
    };
  } else {
    const user = await getUserByEmail(email);

    if (user) {
      const profile = await getProfileById(user.uid);

      if (profile) {
        status = 200;
        response = {
          id: user.uid,
          email: user.email,
          phone: user.phone,
          firstName: profile.firstName,
          secondName: profile.secondName,
        };
      } else {
        status = 400;
        response = {
          error: 'USER_NOT_FOUND'
        };
      }
    } else {
      status = 400;
      response = {
        error: 'USER_NOT_FOUND'
      };
    }
  }

  res.status(status).send(response);
}
