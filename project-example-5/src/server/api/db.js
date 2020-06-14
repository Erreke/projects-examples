const { db } = require('../firebase/init');

module.exports = {
  writeToDB(payload) {
    return db
      .collection('sign_up_to_coursebot')
      .doc()
      .set({
        ...payload,
        createdAt: new Date(),
      });
  },
};
