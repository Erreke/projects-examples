const isValidEmail = require('../../utils/is-valid-email');
const getUserByEmail = require('../../utils/get-user-by-email');

module.exports = async (req, res) => {
  let status;
  let response;

  const email = req.body.email || "";

  if (!isValidEmail(email)) {
    status = 400;
    response = {
      error: 'INVALID_EMAIL'
    };
  } else {
    const user = await getUserByEmail(email);

    if (user) {
      status = 200;
      response = user;
    } else {
      status = 400;
      response = {
        error: 'USER_NOT_FOUND'
      };
    }
  }

  res.status(status).send(response);
}