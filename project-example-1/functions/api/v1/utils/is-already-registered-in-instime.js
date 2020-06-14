const { db } = require('../../../admin');

module.exports = (email) => {
  return db
    .collection('instime_registrations')
    .where('email', '==', email)
    .limit(1)
    .get()
    .then(snapshot => {
      let data = null;

      if (snapshot.empty) {
        return data;
      }

      snapshot.forEach(doc => {
        data = {
          id: doc.id,
          ...doc.data(),
        };
      });

      return data;
    });
};
