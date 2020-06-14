const { db } = require('../../../admin');

module.exports = function getUserBusinessPlaces(uid) {
  return db
    .collection('business_places')
    .where('uid', '==', uid)
    .get()
    .then((snapshot) => {
      const businessPlaces = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          businessPlaces.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }

      return businessPlaces;
    })
    .catch((error) => {
      console.error(error);

      throw new Error('Unable getting user business places');
    });
}
