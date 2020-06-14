const getAllBusinessPlaces = require('../utils/get-all-business-places');
const getAllParents = require('../utils/get-all-parents');
const updateParentsData = require('../utils/update-parents-data');

module.exports = async function updateFollowerInfoInAllParents(change, context) {
  const beforeData = change.before.data();
  const afterData = change.after.data();
  const uid = context.params.uid;

  const oldBirthday = beforeData.birthday;
  const newBirthday = afterData.birthday;

  const oldGender = beforeData.gender;
  const newGender = afterData.gender;

  const oldCity = beforeData.city;
  const newCity = afterData.city;

  const oldCountry = beforeData.country;
  const newCountry = afterData.country;

  if (
    oldGender === newGender
    && oldCity === newCity
    && oldCountry === newCountry
    && (oldBirthday === newBirthday
      || (oldBirthday && newBirthday && oldBirthday._seconds === newBirthday._seconds)
    )
  ) {
    return false;
  }

  const businessPlaces = await getAllBusinessPlaces(uid);
  const allParents = await Promise.all(businessPlaces.map(item => getAllParents(item.parent)));

  allParents.forEach(async parents => {
    await updateParentsData({
      oldBirthday,
      newBirthday,
      oldGender,
      newGender,
      oldCity,
      newCity,
      oldCountry,
      newCountry,
      parents,
    });
  });

  return true;
}
