const { db } = require('../../../admin');

module.exports = function getUserByEmail(email) {
  return db
    .collection('profiles')
    .where('email', '==', email)
    .limit(1)
    .get()
    .then(snapshot => {
      let userData = null;

      if (snapshot.empty) {
        return userData;
      }

      snapshot.forEach(doc => {
        const data = doc.data();

        userData = {
          id: doc.id,
          email: data.email,
          phone: data.phone,
          firstName: data.firstName,
          secondName: data.secondName,
        };
      });

      return userData;
    });
}
