const { db } = require('../../../admin');

module.exports = async function getPackageFromQueue(uid, packageName) {
  const query = db
    .collection('business_places')
    .where('packageName', '==', packageName)
    .where('isPurchased', '==', false)
    .where('uid', '==', null)
    .orderBy('number', 'asc')
    .limit(1);

  return db.runTransaction((transaction) => {
    return transaction
      .get(query)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          throw new Error('Document does not exist!');
        }

        const docSnapshot = querySnapshot.docs[0];
        const data = {
          id: docSnapshot.id,
          ...docSnapshot.data(),
        };

        transaction.update(docSnapshot.ref, { uid });

        return data;
      });
  });
}