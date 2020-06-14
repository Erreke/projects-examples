export default {
  SET_GROWTH_INDICATORS(state, payload) {
    state.growthIndicators = payload;
  },

  SET_GROWTH_INDICATORS_FETCHING_PROCESS(state, payload) {
    state.isGrowthFetchingProcess = payload;
  },

  SET_GENDER_INDICATOR(state, payload) {
    state.genderIndicator = payload;
  },

  SET_GENDER_INDICATOR_FETCHING_PROCESS(state, payload) {
    state.isGenderFetchingProcess = payload;
  },

  SET_AGE_INDICATOR(state, payload) {
    state.ageIndicator = payload;
  },

  SET_AGE_INDICATOR_FETCHING_PROCESS(state, payload) {
    state.isAgeFetchingProcess = payload;
  },

  SET_GEO_INDICATOR(state, payload) {
    state.geoIndicator = payload;
  },

  SET_GEO_INDICATOR_FETCHING_PROCESS(state, payload) {
    state.isGeoFetchingProcess = payload;
  },
};
