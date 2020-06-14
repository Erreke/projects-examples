const { db } = require('../admin');

module.exports = async function getAllBusinessPlaces(uid) {
  return db.collection('business_places')
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
    });
};
