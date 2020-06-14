import marketingIndicatorsAPI from '@/api/marketing-indicators';

export default {
  FETCH_GROWTH_INDICATORS({ state, commit }) {
    if (Object.keys(state.growthIndicators).length) return Promise.resolve(true);

    commit('SET_GROWTH_INDICATORS_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGrowth()
      .then((response) => {
        commit('SET_GROWTH_INDICATORS', response);
        commit('SET_GROWTH_INDICATORS_FETCHING_PROCESS', false);
      });
  },

  FETCH_GENDER_INDICATORS({ state, commit }) {
    if (Object.keys(state.genderIndicator).length) return Promise.resolve(true);

    commit('SET_GENDER_INDICATOR_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGender()
      .then((response) => {
        commit('SET_GENDER_INDICATOR', response);
        commit('SET_GENDER_INDICATOR_FETCHING_PROCESS', false);
      });
  },

  FETCH_AGE_INDICATORS({ state, commit }) {
    if (Object.keys(state.ageIndicator).length) return Promise.resolve(true);

    commit('SET_AGE_INDICATOR_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchAge()
      .then((response) => {
        commit('SET_AGE_INDICATOR', response);
        commit('SET_AGE_INDICATOR_FETCHING_PROCESS', false);
      });
  },

  FETCH_GEO_INDICATORS({ state, commit }) {
    if (Object.keys(state.geoIndicator).length) return Promise.resolve(true);

    commit('SET_GEO_INDICATOR_FETCHING_PROCESS', true);

    return marketingIndicatorsAPI.fetchGeo()
      .then((response) => {
        commit('SET_GEO_INDICATOR', response);
        commit('SET_GEO_INDICATOR_FETCHING_PROCESS', false);
      });
  },
};
