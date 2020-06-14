import {
  CHART_COLORS,
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
} from '@/config';

function getTotalCountPreviousOrCurrent(value) {
  let result;

  if (typeof value === 'number') {
    result = value;
  } else if (typeof value === 'object') {
    result = value.autoReferralsTotalCount || 0;
  } else {
    result = 0;
  }

  return result;
}

function getGenderPreviousOrCurrent(value, index) {
  let result;

  if (typeof value === 'number') {
    result = value;
  } else if (typeof value === 'object' && 'autoReferralsGenders' in value && value.autoReferralsGenders[index]) {
    result = value.autoReferralsGenders[index];
  } else {
    result = 0;
  }

  return result;
}

function getAgePreviousOrCurrent(value, index) {
  let result;

  if (typeof value === 'number') {
    result = value;
  } else if (typeof value === 'object' && 'autoReferralsAges' in value && value.autoReferralsAges[index]) {
    result = value.autoReferralsAges[index];
  } else {
    result = 0;
  }

  return result;
}

function summGenderFollowers(state, index) {
  return state.items.reduce((prev, curr) => {
    const p = getGenderPreviousOrCurrent(prev, index);
    const c = getGenderPreviousOrCurrent(curr, index);

    return p + c;
  }, 0);
}

function summAgeGroup(state, index) {
  return state.items.reduce((prev, curr) => {
    const p = getAgePreviousOrCurrent(prev, index);
    const c = getAgePreviousOrCurrent(curr, index);

    return p + c;
  }, 0);
}

export default {
  autoInvitedCount(state) {
    return state.items.reduce((prev, curr) => {
      const p = getTotalCountPreviousOrCurrent(prev);
      const c = getTotalCountPreviousOrCurrent(curr);

      return p + c;
    }, 0);
  },

  autoInvitedFemaleCount(state) {
    return summGenderFollowers(state, GENDER_FEMALE_INDEX);
  },

  autoInvitedMaleCount(state) {
    return summGenderFollowers(state, GENDER_MALE_INDEX);
  },

  autoInvitedUndefinedGenderCount(state) {
    return summGenderFollowers(state, GENDER_UNKNOWN_INDEX);
  },

  autoInvitedGeography(state) {
    const result = [];

    state.items.forEach((item) => {
      if (
        item.autoReferralsGeoKeys
        && item.autoReferralsGeoValues
        && Array.isArray(item.autoReferralsGeoKeys)
        && Array.isArray(item.autoReferralsGeoValues)
      ) {
        item.autoReferralsGeoKeys.forEach((geoKey, index) => {
          const findedGeoIndex = result.findIndex(i => i.name === geoKey);

          if (findedGeoIndex === -1) {
            result.push({
              name: geoKey,
              type: 'bar',
              barGap: 0,
              data: [item.autoReferralsGeoValues[index]],
              color: CHART_COLORS[index],
            });
          } else {
            result[findedGeoIndex].data[0] += item.autoReferralsGeoValues[index];
          }
        });
      }
    });

    return result;
  },

  autoInvitedAge(state) {
    return [
      summAgeGroup(state, AGE_UNDER_18_INDEX),
      summAgeGroup(state, AGE_BETWEEN_18_25_INDEX),
      summAgeGroup(state, AGE_BETWEEN_26_35_INDEX),
      summAgeGroup(state, AGE_BETWEEN_36_55_INDEX),
      summAgeGroup(state, AGE_BETWEEN_56_85_INDEX),
      summAgeGroup(state, AGE_MORE_85_INDEX),
      summAgeGroup(state, AGE_UNKNOWN_INDEX),
    ];
  },
};
