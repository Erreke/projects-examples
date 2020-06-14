const { db } = require('../../../admin');

module.exports = function getUserDiscountDeadlineDate(uid) {
  return db
    .collection('discounts')
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        const data = doc.data();
    
        return data.deadline._seconds;
      }
    
      return null;
    });
}