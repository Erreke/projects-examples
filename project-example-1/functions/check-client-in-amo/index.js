const { db } = require('../admin');
const checkInAmo = require('./_check-in-amo');
const fixPhoneForAmoCRM = require('../utils/fix-phone-for-amo-crm');

module.exports = async function(userSnapshot, context) {
  const user = userSnapshot.data();
  const uid = context.params.userId;

  try {
    const fixedPhone = fixPhoneForAmoCRM(user.phone);
    const isExistInAmo = await checkInAmo(fixedPhone);

    return await db
      .collection('profiles')
      .doc(uid)
      .update({ isExistInAmo });
  } catch (e) {
    console.error(e);

    return false;
  }
};
