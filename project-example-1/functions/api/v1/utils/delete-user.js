const { db, admin } = require('../../../admin');

module.exports = async function deleteUser(uid) {
  try {
    const userProfileDeleteResult = await db
      .collection('profiles')
      .doc(uid)
      .delete();


    const userAuthDeleteResult = await admin
      .auth()
      .deleteUser(uid)
      .then(() => true);

    return userProfileDeleteResult && userAuthDeleteResult;
  }
  catch (error) {
    console.error("Error on deleting User:", error);

    return false;
  }
}