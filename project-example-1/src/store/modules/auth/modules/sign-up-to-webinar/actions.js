import API from '@/api';

export default {
  SIGN_UP({ commit }, payload) {
    commit('CLEAR_ALL_ERRORS');
    commit('SET_RESULT', false);
    commit('SET_PROCESSING', true);

    return API.signUpToWebinar(payload)
      .then((response) => {
        commit('SET_RESULT', response.data.success);
        commit('SET_PROCESSING', false);
      })
      .catch((e) => {
        commit('SET_ERRORS', e.response.data.errors);
        commit('SET_PROCESSING', false);
      });
  },
};
