const { db } = require('../admin');
const { BONUS_AMOUNT } = require('../config');

module.exports = async function chargeReferralBonus(profile) {
  if (!profile.bonusHolderId) {
    return null;
  }

  const financeData = {
    uid: profile.bonusHolderId,
    forWhomName: `${profile.firstName}${profile.secondName ? ' ' + profile.secondName : ''}`,
    forWhomEmail: profile.email,
    forWhomPhone: profile.phone,
    currency: "USD",
    amount: BONUS_AMOUNT,
    isBonus: true,
    isRejected: false,
    isApproved: true,
    reason: "referral-business-buying",
    createdAt: new Date(),
    approvedAt: new Date(),
    rejectedAt: null
  };

  return db
    .collection('finances')
    .doc()
    .set(financeData)
    .catch((e) => {
      console.error(e);
      throw new Error('Unable Charging Referral Bonus');
    });
};
