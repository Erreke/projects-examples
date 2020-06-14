import leadsAPI from '@/api/leads';

export default {
  FETCH_LEADS({ commit }) {
    commit('SET_LOADING', true);

    return leadsAPI
      .getLeads()
      .then((response) => {
        commit('SET_ITEMS', response);
        commit('SET_LOADING', false);
      })
      .catch((error) => {
        commit('SET_ERROR', error);
        commit('SET_LOADING', false);
      });
  },
};
