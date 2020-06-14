const { db } = require("../../../admin");

module.exports = user => {
  console.log("createUserProfile user:", user);

  const userProfile = {
    firstName: user.firstName,
    secondName: user.secondName,
    bonusHolderNick: user.bonusHolderNick,
    locale: user.locale,
    email: user.email,
    phone: user.phone,

    avatar: null,
    nickname: null,
    accountType: user.accountType || null,
    hasInitialPasswordBeenChanged: user.hasInitialPasswordBeenChanged || false,
    gender: user.gender || null,
    country: user.country || null,
    region: user.region || null,
    city: user.city || null,
    birthday: user.birthday || null,
    isAdmin: false,
    bonusHolderId: null,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date(),
    referrals: []
  };

  return db
    .collection("profiles")
    .doc(user.uid)
    .set(userProfile)
    .then(() => userProfile)
    .catch(error => {
      console.error("Error on createUserProfile:", error);

      throw new Error(error.code.replace("auth/", ""));
    });
};
