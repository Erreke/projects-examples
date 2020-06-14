export default {
  SET_GROWTH_INDICATORS(state, payload) {
    state.growthIndicators = payload;
  },

  SET_GROWTH_INDICATORS_FETCHING_PROCESS(state, payload) {
    state.isGrowthFetchingProcess = payload;
  },

  SET_GROWTH_INDICATORS_SAVING_PROCESS(state, payload) {
    state.isGrowthSavingProcess = payload;
  },


  SET_GENDER_INDICATORS(state, payload) {
    state.genderIndicators = payload;
  },

  SET_GENDER_INDICATORS_FETCHING_PROCESS(state, payload) {
    state.isGenderFetchingProcess = payload;
  },

  SET_GENDER_INDICATORS_SAVING_PROCESS(state, payload) {
    state.isGenderSavingProcess = payload;
  },


  SET_AGE_INDICATORS(state, payload) {
    state.ageIndicators = payload;
  },

  SET_AGE_INDICATORS_FETCHING_PROCESS(state, payload) {
    state.isAgeFetchingProcess = payload;
  },

  SET_AGE_INDICATORS_SAVING_PROCESS(state, payload) {
    state.isAgeSavingProcess = payload;
  },


  SET_GEO_INDICATORS(state, payload) {
    state.geoIndicators = payload;
  },

  SET_GEO_INDICATORS_FETCHING_PROCESS(state, payload) {
    state.isGeoFetchingProcess = payload;
  },

  SET_GEO_INDICATORS_SAVING_PROCESS(state, payload) {
    state.isGeoSavingProcess = payload;
  },


  SET_GEO_CITIES(state, payload) {
    state.geoCities = payload;
  },

  SET_GEO_CITIES_FETCHING_PROCESS(state, payload) {
    state.isGeoCitiesFetchingProcess = payload;
  },

  SET_GEO_CITY_SAVING_PROCESS(state, payload) {
    state.isGeoCitySavingProcess = payload;
  },

  SET_GEO_CITY_DELETING_PROCESS(state, payload) {
    state.isGeoCityDeletingProcess = payload;
  },
};
