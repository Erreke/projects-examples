const { admin } = require("../../../admin");

module.exports = user => {
  console.log("createUser user:", user);

  return admin
    .auth()
    .createUser({
      email: user.email,
      phoneNumber: user.phone,
      password: user.password,
      emailVerified: user.emailVerified
    })
    .then(userRecord => {
      return userRecord.uid;
    })
    .catch(error => {
      console.error("Error on createUser:", error);

      throw new Error(error.code.replace("auth/", ""));
    });
};
