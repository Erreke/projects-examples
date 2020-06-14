const { db } = require('../admin');
const {
  GENDER_MALE_INDEX,
  GENDER_FEMALE_INDEX,
  GENDER_UNKNOWN_INDEX,
  AGE_UNDER_18_INDEX,
  AGE_BETWEEN_18_25_INDEX,
  AGE_BETWEEN_26_35_INDEX,
  AGE_BETWEEN_36_55_INDEX,
  AGE_BETWEEN_56_85_INDEX,
  AGE_MORE_85_INDEX,
  AGE_UNKNOWN_INDEX,
} = require('../config');

module.exports = function initParentsData(profile, parents) {
  let age;
  let gender;
  let countryCity;

  if (profile.birthday && profile.birthday._seconds) {
    const date1 = new Date(profile.birthday._seconds * 1000);
    const date2 = new Date();

    const y1 = date1.getFullYear();
    const y2 = date2.getFullYear();

    age = y2 - y1;
  }

  if (profile.country && profile.city) {
    countryCity = `${profile.country}, ${profile.city}`;
  }

  if (profile.gender) {
    gender = profile.gender;
  }

  const parentsRefs = parents.map((item) => db.collection('business_places').doc(item));

  return db.runTransaction((transaction) => {
    return Promise.all(parentsRefs.map((parentRef) => {
      return transaction.get(parentRef)
        .then((parentDoc) => {
          if (!parentDoc.exists) {
            throw new Error('Parent does not exist!');
          }

          let {
            autoReferralsAges,
            autoReferralsGenders,
            autoReferralsTotalCount,
            autoReferralsGeoKeys,
            autoReferralsGeoValues,
          } = parentDoc.data();

          if (!autoReferralsAges || !Array.isArray(autoReferralsAges) || !autoReferralsAges.length) {
            autoReferralsAges = [0, 0, 0, 0, 0, 0, 0]; // 'under18', 'between1825', 'between2635', 'between3655', 'between5685', 'more85', 'unknownAge'
          }

          if (!autoReferralsGenders || !Array.isArray(autoReferralsGenders) || !autoReferralsGenders.length) {
            autoReferralsGenders = [0, 0, 0]; // male, female, unknown
          }

          if (!autoReferralsGeoKeys || !Array.isArray(autoReferralsGeoKeys)) {
            autoReferralsGeoKeys = [];
          }

          if (!autoReferralsGeoValues  || !Array.isArray(autoReferralsGeoValues)) {
            autoReferralsGeoValues = [];
          }

          if (age) {
            if (age < 18) {
              autoReferralsAges[AGE_UNDER_18_INDEX] += 1;
            }
    
            if (age >= 18 && age <= 25) {
              autoReferralsAges[AGE_BETWEEN_18_25_INDEX] += 1;
            }
    
            if (age >= 26 && age <= 35) {
              autoReferralsAges[AGE_BETWEEN_26_35_INDEX] += 1;
            }
    
            if (age >= 36 && age <= 55) {
              autoReferralsAges[AGE_BETWEEN_36_55_INDEX] += 1;
            }
    
            if (age >= 56 && age <= 85) {
              autoReferralsAges[AGE_BETWEEN_56_85_INDEX] += 1;
            }
    
            if (age > 85) {
              autoReferralsAges[AGE_MORE_85_INDEX] += 1;
            }

            if (autoReferralsAges[AGE_UNKNOWN_INDEX] > 0) {
              autoReferralsAges[AGE_UNKNOWN_INDEX] -= 1;
            }
          } else {
            autoReferralsAges[AGE_UNKNOWN_INDEX] += 1;
          }

          if (gender) {
            if (gender === 'male') {
              autoReferralsGenders[GENDER_MALE_INDEX] += 1;
            }

            if (gender === 'female') {
              autoReferralsGenders[GENDER_FEMALE_INDEX] += 1;
            }

            if (autoReferralsGenders[GENDER_UNKNOWN_INDEX] > 0) {
              autoReferralsGenders[GENDER_UNKNOWN_INDEX] -= 1;
            }
          } else {
            autoReferralsGenders[GENDER_UNKNOWN_INDEX] += 1;
          }

          if (countryCity) {
            const countryCityIndex = autoReferralsGeoKeys.indexOf(countryCity);

            if (countryCityIndex === -1) {
              autoReferralsGeoKeys.push(countryCity);
              autoReferralsGeoValues.push(1);
            } else {
              autoReferralsGeoValues[countryCityIndex] += 1;
            }
          }

          if (!autoReferralsTotalCount || !Number.isInteger(autoReferralsTotalCount)) {
            autoReferralsTotalCount = 1;
          } else {
            autoReferralsTotalCount += 1;
          }

          transaction.update(parentRef, {
            isTimeToSynchronize: true,
            autoReferralsAges,
            autoReferralsGenders,
            autoReferralsGeoKeys,
            autoReferralsGeoValues,
            autoReferralsTotalCount,
          });

          return true;
        });
    }))
    .catch((error) => {
      console.error('Transaction failed: ', error);
    });
  });
};
