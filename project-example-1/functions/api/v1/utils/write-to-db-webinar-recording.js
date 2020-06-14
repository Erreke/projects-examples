const { db } = require('../../../admin');

module.exports = function writeToDb(firstName, email, phone) {
  return db
    .collection("get_webinar_clients")
    .doc()
    .set({ 
      firstName,
      email,
      phone,
      createdAt: new Date(),
    });
};
