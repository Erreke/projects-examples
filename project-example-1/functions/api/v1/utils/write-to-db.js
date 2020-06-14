const { db } = require('../../../admin');

module.exports = function writeToDb(firstName, phone) {
  return db
    .collection("sign_up_to_webinars")
    .doc()
    .set({ 
      firstName,
      phone,
      createdAt: new Date(),
    });
};
