const getProfileById = require('../utils/get-profile-by-id');
const getAllParents = require('../utils/get-all-parents');
const chargeReferralBonus = require('../utils/charge-referral-bonus');
const initParentsData = require('../utils/init-parents-data');

module.exports = async function handleBusinessPlaceActivation(change, context) {
  const beforeData = change.before.data();
  const afterData = change.after.data();

  if (!afterData.isPurchased) {
    return false;
  }

  if (
    beforeData.isPurchased === afterData.isPurchased &&
    beforeData.isInstimePurchased === afterData.isInstimePurchased
  ) {
    return false;
  }

  try {
    const profile = await getProfileById(afterData.uid);

    if (!profile) {
      throw new Error('User profile not found:', afterData.uid);
    }

    const allParents = await getAllParents(afterData.parent);
    await initParentsData(profile, allParents);
    await chargeReferralBonus(profile);

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};
