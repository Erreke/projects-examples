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

function initFields(doc) {
  let {
    autoReferralsAges,
    autoReferralsGenders,
    autoReferralsGeoKeys,
    autoReferralsGeoValues,
  } = doc.data();

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

  return {
    autoReferralsAges: [ ...autoReferralsAges ],
    autoReferralsGenders: [ ...autoReferralsGenders ],
    autoReferralsGeoKeys: [ ...autoReferralsGeoKeys ],
    autoReferralsGeoValues: [ ...autoReferralsGeoValues ],
  }
}

module.exports = function updateParentsData(payload) {
  const {
    oldBirthday,
    newBirthday,
    oldGender,
    newGender,
    oldCity,
    newCity,
    oldCountry,
    newCountry,
    parents,
  } = payload;

  let oldAge = 0;
  let newAge = 0;
  let oldGeo = '';
  let newGeo = '';

  if (oldBirthday && oldBirthday._seconds) {
    const date1 = new Date(oldBirthday._seconds * 1000);
    const date2 = new Date();

    const y1 = date1.getFullYear();
    const y2 = date2.getFullYear();

    oldAge = y2 - y1;
  }

  if (newBirthday && newBirthday._seconds) {
    const date1 = new Date(newBirthday._seconds * 1000);
    const date2 = new Date();

    const y1 = date1.getFullYear();
    const y2 = date2.getFullYear();

    newAge = y2 - y1;
  }

  if (oldCountry && oldCity) {
    oldGeo = `${oldCountry}, ${oldCity}`;
  }

  if (newCountry && newCity) {
    newGeo = `${newCountry}, ${newCity}`;
  }

  const parentsRefs = parents.map((item) => db.collection('business_places').doc(item));

  return db.runTransaction((transaction) => {
    return Promise.all(parentsRefs.map((parentRef) => {
      return transaction.get(parentRef)
        .then((parentDoc) => {
          if (!parentDoc.exists) {
            throw new Error('Parent does not exist!');
          }

          const {
            autoReferralsAges,
            autoReferralsGenders,
            autoReferralsGeoKeys,
            autoReferralsGeoValues,
          } = initFields(parentDoc);

          if (newAge !== oldAge) {
            if (oldAge < 18 && autoReferralsAges[AGE_UNDER_18_INDEX] > 0) {
              autoReferralsAges[AGE_UNDER_18_INDEX] -= 1;
            }
    
            if (oldAge >= 18 && oldAge <= 25 && autoReferralsAges[AGE_BETWEEN_18_25_INDEX] > 0) {
              autoReferralsAges[AGE_BETWEEN_18_25_INDEX] -= 1;
            }
    
            if (oldAge >= 26 && oldAge <= 35 && autoReferralsAges[AGE_BETWEEN_26_35_INDEX] > 0) {
              autoReferralsAges[AGE_BETWEEN_26_35_INDEX] -= 1;
            }
    
            if (oldAge >= 36 && oldAge <= 55 && autoReferralsAges[AGE_BETWEEN_36_55_INDEX] > 0) {
              autoReferralsAges[AGE_BETWEEN_36_55_INDEX] -= 1;
            }
    
            if (oldAge >= 56 && oldAge <= 85 && autoReferralsAges[AGE_BETWEEN_56_85_INDEX] > 0) {
              autoReferralsAges[AGE_BETWEEN_56_85_INDEX] -= 1;
            }
    
            if (oldAge > 85 && autoReferralsAges[AGE_MORE_85_INDEX] > 0) {
              autoReferralsAges[AGE_MORE_85_INDEX] -= 1;
            }

            if (!oldAge && autoReferralsAges[AGE_UNKNOWN_INDEX] > 0) {
              autoReferralsAges[AGE_UNKNOWN_INDEX] -= 1;
            }

            if (newAge < 18) {
              autoReferralsAges[AGE_UNDER_18_INDEX] += 1;
            }
    
            if (newAge >= 18 && newAge <= 25) {
              autoReferralsAges[AGE_BETWEEN_18_25_INDEX] += 1;
            }
    
            if (newAge >= 26 && newAge <= 35) {
              autoReferralsAges[AGE_BETWEEN_26_35_INDEX] += 1;
            }
    
            if (newAge >= 36 && newAge <= 55) {
              autoReferralsAges[AGE_BETWEEN_36_55_INDEX] += 1;
            }
    
            if (newAge >= 56 && newAge <= 85) {
              autoReferralsAges[AGE_BETWEEN_56_85_INDEX] += 1;
            }
    
            if (newAge > 85) {
              autoReferralsAges[AGE_MORE_85_INDEX] += 1;
            }
          }

          if (newGender !== oldGender) {
            if (oldGender === 'male' && autoReferralsGenders[GENDER_MALE_INDEX] > 0) {
              autoReferralsGenders[GENDER_MALE_INDEX] -= 1;
            }

            if (oldGender === 'female' && autoReferralsGenders[GENDER_FEMALE_INDEX] > 0) {
              autoReferralsGenders[GENDER_FEMALE_INDEX] -= 1;
            }

            if (!oldGender && autoReferralsGenders[GENDER_UNKNOWN_INDEX] > 0) {
              autoReferralsGenders[GENDER_UNKNOWN_INDEX] -= 1;
            }

            if (newGender === 'male') {
              autoReferralsGenders[GENDER_MALE_INDEX] += 1;
            }

            if (newGender === 'female') {
              autoReferralsGenders[GENDER_FEMALE_INDEX] += 1;
            }
          }

          if (newGeo !== oldGeo) {
            const newGeoIndex = autoReferralsGeoKeys.indexOf(newGeo);
            const oldGeoIndex = autoReferralsGeoKeys.indexOf(oldGeo);

            if (oldGeoIndex !== -1) {
              autoReferralsGeoValues[oldGeoIndex] -= 1;

              if (autoReferralsGeoValues[oldGeoIndex] === 0) {
                autoReferralsGeoKeys.splice(oldGeoIndex, 1);
                autoReferralsGeoValues.splice(oldGeoIndex, 1);
              }
            }

            if (newGeoIndex === -1) {
              autoReferralsGeoKeys.push(newGeo);
              autoReferralsGeoValues.push(1);
            } else {
              autoReferralsGeoValues[newGeoIndex] += 1;
            }
          }

          transaction.update(parentRef, {
            isTimeToSynchronize: true,
            autoReferralsAges,
            autoReferralsGenders,
            autoReferralsGeoKeys,
            autoReferralsGeoValues,
          });

          return true;
        });
    }))
    .catch((error) => {
      console.error('Transaction failed: ', error);
    });
  });
};
