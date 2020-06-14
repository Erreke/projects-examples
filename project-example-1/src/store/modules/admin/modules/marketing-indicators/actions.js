import marketingIndicatorsAPI from '@/api/admin/marketing-indicators';

export default {
  FETCH_GROWTH_INDICATORS({ commit }) {
    commit('SET_GROWTH_INDICATORS_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGrowth()
      .then((response) => {
        commit('SET_GROWTH_INDICATORS', response);
        commit('SET_GROWTH_INDICATORS_FETCHING_PROCESS', false);
      });
  },

  CREATE_GROWTH_INDICATOR({ commit }, { createdAt, value }) {
    commit('SET_GROWTH_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.createGrowth(createdAt, value)
      .then(() => {
        commit('SET_GROWTH_INDICATORS_SAVING_PROCESS', false);
      });
  },

  UPDATE_GROWTH_INDICATOR({ commit }, { id, value }) {
    commit('SET_GROWTH_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.updateGrowth(id, value)
      .then(() => {
        commit('SET_GROWTH_INDICATORS_SAVING_PROCESS', false);
      });
  },

  DELETE_GROWTH_INDICATOR({ commit }, id) {
    commit('SET_GROWTH_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.deleteGrowth(id)
      .then(() => {
        commit('SET_GROWTH_INDICATORS_SAVING_PROCESS', false);
      });
  },


  FETCH_GENDER_INDICATORS({ commit }) {
    commit('SET_GENDER_INDICATORS_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGender()
      .then((response) => {
        commit('SET_GENDER_INDICATORS', response);
        commit('SET_GENDER_INDICATORS_FETCHING_PROCESS', false);
      });
  },

  CREATE_GENDER_INDICATOR({ commit }, { createdAt, male, female }) {
    commit('SET_GENDER_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.createGender(createdAt, male, female)
      .then(() => {
        commit('SET_GENDER_INDICATORS_SAVING_PROCESS', false);
      });
  },

  UPDATE_GENDER_INDICATOR({ commit }, { id, male, female }) {
    commit('SET_GENDER_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.updateGender(id, male, female)
      .then(() => {
        commit('SET_GENDER_INDICATORS_SAVING_PROCESS', false);
      });
  },

  DELETE_GENDER_INDICATOR({ commit }, id) {
    commit('SET_GENDER_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.deleteGender(id)
      .then(() => {
        commit('SET_GENDER_INDICATORS_SAVING_PROCESS', false);
      });
  },


  FETCH_AGE_INDICATORS({ commit }) {
    commit('SET_AGE_INDICATORS_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchAge()
      .then((response) => {
        commit('SET_AGE_INDICATORS', response);
        commit('SET_AGE_INDICATORS_FETCHING_PROCESS', false);
      });
  },

  CREATE_AGE_INDICATOR({ commit }, payload) {
    commit('SET_AGE_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.createAge(payload)
      .then(() => {
        commit('SET_AGE_INDICATORS_SAVING_PROCESS', false);
      });
  },

  UPDATE_AGE_INDICATOR({ commit }, payload) {
    commit('SET_AGE_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.updateAge(payload)
      .then(() => {
        commit('SET_AGE_INDICATORS_SAVING_PROCESS', false);
      });
  },

  DELETE_AGE_INDICATOR({ commit }, id) {
    commit('SET_AGE_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.deleteAge(id)
      .then(() => {
        commit('SET_AGE_INDICATORS_SAVING_PROCESS', false);
      });
  },


  FETCH_GEO_INDICATORS({ commit }) {
    commit('SET_GEO_INDICATORS_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGeoIndicators()
      .then((response) => {
        commit('SET_GEO_INDICATORS', response);
        commit('SET_GEO_INDICATORS_FETCHING_PROCESS', false);
      });
  },

  CREATE_GEO_INDICATOR({ commit }, { createdAt, keys, values }) {
    commit('SET_GEO_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.createGeoIndicators(createdAt, keys, values)
      .then(() => {
        commit('SET_GEO_INDICATORS_SAVING_PROCESS', false);
      });
  },

  UPDATE_GEO_INDICATOR({ commit }, { id, keys, values }) {
    commit('SET_GEO_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.updateGeoIndicators(id, keys, values)
      .then(() => {
        commit('SET_GEO_INDICATORS_SAVING_PROCESS', false);
      });
  },

  DELETE_GEO_INDICATOR({ commit }, id) {
    commit('SET_GEO_INDICATORS_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.deleteGeoIndicators(id)
      .then(() => {
        commit('SET_GEO_INDICATORS_SAVING_PROCESS', false);
      });
  },


  FETCH_GEO_CITIES({ commit }) {
    commit('SET_GEO_CITIES_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGeoCities()
      .then((response) => {
        commit('SET_GEO_CITIES', response);
        commit('SET_GEO_CITIES_FETCHING_PROCESS', false);
      });
  },

  CREATE_GEO_CITY({ commit }, city) {
    commit('SET_GEO_CITY_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.createGeoCity(city)
      .then(() => {
        commit('SET_GEO_CITY_SAVING_PROCESS', false);
      });
  },

  UPDATE_GEO_CITY({ commit }, { id, city }) {
    commit('SET_GEO_CITY_SAVING_PROCESS', true);

    return marketingIndicatorsAPI.updateGeoCity(id, city)
      .then(() => {
        commit('SET_GEO_CITY_SAVING_PROCESS', false);
      });
  },

  DELETE_GEO_CITY({ commit }, id) {
    commit('SET_GEO_CITY_DELETING_PROCESS', true);

    return marketingIndicatorsAPI.deleteGeoCity(id)
      .then(() => {
        commit('SET_GEO_CITY_DELETING_PROCESS', false);
      });
  },
};
