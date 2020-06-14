const { admin, db } = require("../../../../admin");
const { validateRecoverEmailInProfileFields } = require("../../utils/validate");

function getUserByEmail(email) {
  return admin
    .auth()
    .getUserByEmail(email)
    .then(userRecord => userRecord)
    .catch(error => {
      console.error("Unable getting user by email. Error:", error);
      throw new Error("Unable getting user by email");
    });
}

function updateUserProfile(user) {
  return db
    .collection("profiles")
    .doc(user.uid)
    .update({
      email: user.email,
      phone: user.phoneNumber
    })
    .catch(error => {
      console.error("Unable updating user profile. Error:", error);
      throw new Error("Unable updating user profile");
    });
}

module.exports = async function recoverEmailInProfile(req, res) {
  let status = 400;
  let response = {
    success: false
  };

  try {
    const email = req.body.email || null;

    const errors = await validateRecoverEmailInProfileFields(email);

    if (errors.length) {
      status = 400;
      response = {
        success: false,
        errors: errors
      };
    } else {
      const user = await getUserByEmail(email);
      const result = await updateUserProfile(user);

      status = 200;
      response = {
        success: true,
        result
      };
    }

    res.status(status).send(response);
  } catch (error) {
    console.error(error);

    status = 400;
    response = {
      success: false,
      errors: ["unknown-error"]
    };

    res.status(status).send(response);
  }
};
